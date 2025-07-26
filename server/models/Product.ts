import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  currency: string;
  supplier: mongoose.Types.ObjectId;
  isAvailable: boolean;
  minimumOrderQuantity: number;
  stockQuantity: number;
  images: string[];
  specifications: {
    [key: string]: string;
  };
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Vegetables',
      'Fruits',
      'Dairy',
      'Eggs',
      'Meat',
      'Poultry',
      'Fish',
      'Grains',
      'Cereals',
      'Pulses',
      'Spices',
      'Condiments',
      'Beverages',
      'Snacks',
      'Confectionery',
      'Organic',
      'Frozen',
      'Bakery',
      'Other'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit'],
    enum: [
      'kg',
      'g',
      'l',
      'ml',
      'piece',
      'dozen',
      'pack',
      'box',
      'bundle',
      'ton',
      'quintal'
    ]
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1,
    min: [0, 'Minimum order quantity cannot be negative']
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  images: {
    type: [String],
    default: []
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  tags: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create text index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  tags: 'text'
});

// Create compound index for supplier and category
productSchema.index({ supplier: 1, category: 1 });

// Create index for price range queries
productSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', productSchema); 