import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
  content: string;
  imageUrl?: string;
  scheduledAt?: Date;
  published: boolean;
  status: 'pending' | 'posted' | 'failed';
  platform?: string;
  campaign?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    imageUrl: { type: String },
    scheduledAt: { type: Date },
    published: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'posted', 'failed'],
      default: 'pending',
    },
    platform: { type: String },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign' },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', PostSchema);