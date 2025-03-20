import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // console.log("MongoDB connected successfully");
    
    // await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully to:", mongoose.connection.db.databaseName);

  } 
  catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;