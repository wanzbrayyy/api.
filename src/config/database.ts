import mongoose from "mongoose";
import { CONSTANTS } from "./constants.js";

export const connectDB = async () => {
  try {
    // Mencegah Mongoose connect ulang jika sudah ada koneksi aktif (penting untuk serverless)
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(CONSTANTS.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000, 
      family: 4, // Wajib: Paksa IPv4 karena Vercel kadang gagal di IPv6
      dbName: "awan321" // Memastikan nama database sesuai URI
    });
    
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    // Jangan process.exit(1) di Vercel/Serverless, biarkan throw error agar function restart
    throw error;
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Runtime Error:", err);
});