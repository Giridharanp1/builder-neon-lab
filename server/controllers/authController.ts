import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { geocodeAddress } from '../utils/locationUtils.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, companyName, phone, address, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Geocode address if provided
  let location;
  if (address) {
    const coords = await geocodeAddress(address);
    location = {
      type: 'Point',
      coordinates: [coords.lon, coords.lat]
    };
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    companyName,
    phone,
    address,
    location,
    role: role || 'buyer'
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        isVerified: user.isVerified,
        token: user.generateAuthToken()
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        isVerified: user.isVerified,
        token: user.generateAuthToken()
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const fieldsToUpdate: any = {
    name: req.body.name,
    companyName: req.body.companyName,
    phone: req.body.phone,
    address: req.body.address
  };

  // Geocode address if provided
  if (req.body.address) {
    const coords = await geocodeAddress(req.body.address);
    fieldsToUpdate.location = {
      type: 'Point',
      coordinates: [coords.lon, coords.lat]
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: user
  });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user!.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user!.password = newPassword;
  await user!.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // In a real application, you would send a password reset email here
  // For now, we'll just return a success message
  res.json({
    success: true,
    message: 'Password reset email sent (mock implementation)'
  });
}); 