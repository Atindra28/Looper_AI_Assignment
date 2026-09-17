import mongoose, { Schema, Document } from 'mongoose';
import { TransactionCategory, TransactionStatus } from '../types';

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: TransactionCategory;
  status: TransactionStatus;
  user_id: string;
  user_profile: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    // Preserve original dataset numeric id for display and CSV export
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    // Always positive — direction determined by category field
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Only "Revenue" or "Expense" exist in the dataset
    category: {
      type: String,
      required: true,
      enum: ['Revenue', 'Expense'],
      index: true,
    },
    // Only "Paid" or "Pending" exist in the dataset
    status: {
      type: String,
      required: true,
      enum: ['Paid', 'Pending'],
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    user_profile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for default sort (newest first)
TransactionSchema.index({ date: -1, _id: -1 });
// Index for amount range queries
TransactionSchema.index({ amount: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
