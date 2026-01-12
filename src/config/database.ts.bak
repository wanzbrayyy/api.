import mongoose from "mongoose";
import { CONSTANTS } from "./constants";

export const connectDB = async () => {
  try {
    await mongoose.connect(CONSTANTS.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};