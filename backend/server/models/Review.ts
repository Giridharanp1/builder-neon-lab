import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  supplier: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one review per user per supplier
reviewSchema.index({ user: 1, supplier: 1 }, { unique: true });

// Create index for supplier reviews
reviewSchema.index({ supplier: 1, createdAt: -1 });

// Create index for rating queries
reviewSchema.index({ rating: 1 });

export default mongoose.model<IReview>('Review', reviewSchema); 