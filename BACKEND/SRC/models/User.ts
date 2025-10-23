import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  facebookId: string;
  password: string;
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
    facebookId: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },       // ✅ Optional
    age: { type: Number, required: false },         // ✅ Optional
    role: { type: String, default: "user" },
    isPermanent: { type: Boolean, default: false }  // ✅ Flag for test accounts
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);