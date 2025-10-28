import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  user: mongoose.Schema.Types.ObjectId;
  adAccountId: string;
  name: string;
  objective: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  specialAdCategories: string[];
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime?: Date;
  endTime?: Date;
  facebookCampaignId?: string;
}

const CampaignSchema: Schema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  adAccountId: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  objective: {
    type: String,
    required: true,
    // Example objectives: LINK_CLICKS, CONVERSIONS, POST_ENGAGEMENT, etc.
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'ARCHIVED'],
    default: 'PAUSED'
  },
  specialAdCategories: {
    type: [String],
    default: []
    // E.g., ['HOUSING'], ['EMPLOYMENT'], etc. or ['NONE']
  },
  dailyBudget: {
    type: Number,
  },
  lifetimeBudget: {
    type: Number,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  facebookCampaignId: {
    type: String, // To store the ID returned by Facebook
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Campaign = mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default Campaign;
