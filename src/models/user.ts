import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  apiKey?: string;
  limit?: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "https://via.placeholder.com/150" },
  apiKey: { type: String, unique: true, sparse: true },
  limit: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>("User", UserSchema);