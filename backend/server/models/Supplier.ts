import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  description: string;
  category: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  businessHours: {
    open: string;
    close: string;
    daysOpen: string[];
  };
  minimumOrder: number;
  deliveryRadius: number; // in kilometers
  paymentMethods: string[];
  certifications: string[];
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>({
  name: {
    type: String,
    required: [true, 'Please add a supplier name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Vegetables & Fruits',
      'Dairy & Eggs',
      'Meat & Poultry',
      'Grains & Cereals',
      'Spices & Condiments',
      'Beverages',
      'Snacks & Confectionery',
      'Organic Products',
      'Frozen Foods',
      'Bakery',
      'Other'
    ]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  state: {
    type: String,
    required: [true, 'Please add a state']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please add a valid URL'
    ]
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
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  businessHours: {
    open: {
      type: String,
      default: '09:00'
    },
    close: {
      type: String,
      default: '18:00'
    },
    daysOpen: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  minimumOrder: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order cannot be negative']
  },
  deliveryRadius: {
    type: Number,
    default: 10,
    min: [0, 'Delivery radius cannot be negative']
  },
  paymentMethods: {
    type: [String],
    default: ['Cash', 'Bank Transfer'],
    enum: ['Cash', 'Bank Transfer', 'Credit Card', 'UPI', 'Cheque']
  },
  certifications: {
    type: [String],
    default: []
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
supplierSchema.index({ location: '2dsphere' });

// Create text index for search functionality
supplierSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  city: 'text',
  state: 'text'
});

export default mongoose.model<ISupplier>('Supplier', supplierSchema); 