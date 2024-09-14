import mongoose from "mongoose";
import "dotenv/config";


const connectDB = async () => {
    try {
      const mongoURI = `${process.env.USER_MONGO_URI}${process.env.USER_MONGODB_NAME}`;
      const conn = await mongoose.connect(
        `${process.env.USER_MONGO_URI}${process.env.USER_MONGODB_NAME}`
      );    
      console.log(`UserDB-connected: ${conn.connection.host}`);
    } catch (error: any) {
      console.log(error.message);
      process.exit(1);
    }
  };
  
  export { connectDB };