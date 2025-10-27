import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  
  // --- NEW AND MODIFIED FIELDS ---
  facebookId?: string; // Changed to optional, as a user might not have connected to FB yet.
  facebookAccessToken?: string; // New field to securely store the long-lived access token.
  
  phone?: string;
  age?: number;
  role?: string;
  isPermanent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // --- SCHEMA DEFINITIONS FOR NEW/MODIFIED FIELDS ---
    facebookId: { type: String, required: false }, // No longer required on signup
    facebookAccessToken: { type: String, required: false }, // This will be added after OAuth
    
    phone: { type: String, required: false },
    age: { type: Number, required: false },
    role: { type: String, default: "user" },
    isPermanent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
