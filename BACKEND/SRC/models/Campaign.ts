import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  pageName: string;
  objective: string;
  adType: string;
  caption: string;
  mediaUrl?: string;
  budget: number;
  duration: Date;

  frequency: string;
  postDate: Date;
  postTime: string;
  timezone: string;

  audience: {
    minAge: number;
    maxAge: number;
    gender: string;
    interests: string[];
  };

  posts: mongoose.Types.ObjectId[];
  analytics?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    pageName: { type: String, required: true },
    objective: { type: String, required: true },
    adType: { type: String, required: true },
    caption: { type: String, required: true },
    mediaUrl: { type: String },

    budget: { type: Number, required: true },
    duration: { type: Date, required: true },

    frequency: { type: String, enum: ['daily', 'weekly', 'custom'], required: true },
    postDate: { type: Date, required: true },
    postTime: { type: String, required: true },
    timezone: { type: String, required: true },

    audience: {
      minAge: { type: Number, required: true },
      maxAge: { type: Number, required: true },
      gender: { type: String, enum: ['male', 'female', 'any'], required: true },
      interests: [{ type: String }],
    },

    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    analytics: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);