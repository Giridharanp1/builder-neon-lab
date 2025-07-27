import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { 
    supplierId, 
    items, 
    deliveryAddress, 
    deliveryInstructions, 
    paymentMethod,
    notes 
  } = req.body;

  // Validate supplier
  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Validate and calculate order items
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }

    if (!product.isAvailable) {
      res.status(400);
      throw new Error(`Product ${product.name} is not available`);
    }

    if (product.stockQuantity < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const totalPrice = product.price * item.quantity;
    subtotal += totalPrice;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice
    });
  }

  // Calculate totals
  const tax = subtotal * 0.18; // 18% GST
  const deliveryFee = subtotal > 1000 ? 0 : 100; // Free delivery above 1000
  const totalAmount = subtotal + tax + deliveryFee;

  // Create order
  const order = await Order.create({
    user: req.user.id,
    supplier: supplierId,
    items: orderItems,
    subtotal,
    tax,
    deliveryFee,
    totalAmount,
    paymentMethod,
    deliveryAddress,
    deliveryInstructions,
    notes
  });

  // Update product stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stockQuantity: -item.quantity }
    });
  }

  // Create Stripe payment intent if using card payment
  let paymentIntent = null;
  if (paymentMethod === 'Credit Card') {
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'inr',
        metadata: {
          orderId: order._id.toString(),
          userId: req.user.id,
          supplierId: supplierId
        }
      });

      order.paymentIntentId = paymentIntent.id;
      await order.save();
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      // Continue without payment intent for other payment methods
    }
  }

  // Populate order details
  await order.populate([
    { path: 'supplier', select: 'name phone email' },
    { path: 'items.product', select: 'name price unit' }
  ]);

  res.status(201).json({
    success: true,
    data: {
      order,
      paymentIntent: paymentIntent ? {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      } : null
    }
  });
});

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query: any = { user: req.user.id };
  if (status) query.status = status;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const orders = await Order.find(query)
    .populate('supplier', 'name city state')
    .populate('items.product', 'name price unit')
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    count: orders.length,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    },
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('supplier', 'name phone email address city state')
    .populate('items.product', 'name description price unit images')
    .populate('user', 'name companyName phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check authorization
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to view this order');
  }

  res.json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, trackingNumber, estimatedDelivery } = req.body;

  const order = await Order.findById(req.params.id).populate('supplier');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check authorization (supplier owner or admin)
  const supplier = order.supplier as any;
  if (supplier.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this order');
  }

  // Update order
  const updateData: any = { status };
  if (trackingNumber) updateData.trackingNumber = trackingNumber;
  if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
  if (status === 'delivered') updateData.actualDelivery = new Date();

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  ).populate('supplier', 'name phone email');

  res.json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Track order
// @route   GET /api/orders/track/:id
// @access  Public
export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('supplier', 'name phone email')
    .populate('user', 'name companyName phone')
    .select('-paymentIntentId');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Create tracking timeline
  const timeline = [
    {
      status: 'Order Placed',
      date: order.createdAt,
      description: 'Order has been placed successfully'
    }
  ];

  if (order.status !== 'pending') {
    timeline.push({
      status: 'Order Confirmed',
      date: order.updatedAt,
      description: 'Order has been confirmed by supplier'
    });
  }

  if (['processing', 'shipped', 'delivered'].includes(order.status)) {
    timeline.push({
      status: 'Processing',
      date: order.updatedAt,
      description: 'Order is being processed'
    });
  }

  if (['shipped', 'delivered'].includes(order.status)) {
    timeline.push({
      status: 'Shipped',
      date: order.updatedAt,
      description: order.trackingNumber 
        ? `Order shipped with tracking: ${order.trackingNumber}`
        : 'Order has been shipped'
    });
  }

  if (order.status === 'delivered') {
    timeline.push({
      status: 'Delivered',
      date: order.actualDelivery || order.updatedAt,
      description: 'Order has been delivered successfully'
    });
  }

  res.json({
    success: true,
    data: {
      order: {
        _id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        actualDelivery: order.actualDelivery,
        trackingNumber: order.trackingNumber
      },
      supplier: order.supplier,
      customer: order.user,
      timeline
    }
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check authorization
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to cancel this order');
  }

  // Check if order can be cancelled
  if (!['pending', 'confirmed'].includes(order.status)) {
    res.status(400);
    throw new Error('Order cannot be cancelled at this stage');
  }

  // Update order status
  order.status = 'cancelled';
  await order.save();

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stockQuantity: item.quantity }
    });
  }

  // Refund payment if paid
  if (order.paymentStatus === 'paid' && order.paymentIntentId) {
    try {
      await stripe.refunds.create({
        payment_intent: order.paymentIntentId
      });
      order.paymentStatus = 'refunded';
      await order.save();
    } catch (error) {
      console.error('Payment refund failed:', error);
    }
  }

  res.json({
    success: true,
    data: order
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
export const getOrderStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await Order.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        avgOrderValue: { $avg: '$totalAmount' }
      }
    }
  ]);

  const statusStats = await Order.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || { totalOrders: 0, totalSpent: 0, avgOrderValue: 0 },
      statusBreakdown: statusStats
    }
  });
}); 