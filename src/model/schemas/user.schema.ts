import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../user.entities";
import transactionSchema from "./transaction.schema";

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ITransaction {
  amount: number;
  date: Date;
  description: string;
  type: "credit" | "debit";
}


export interface IUser extends Document {
  name: string;
  email: string;
  wallet:number;
  transactions: ITransaction[];
  password?: string;
  status: boolean;
  role:string;
  gender?:string;
  address?:string;
  pincode?:string;
  state?:string;
  birthday?:Date;
  image_link?:string;
  usedCoupons:string[];
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    address: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    image_link: {
      type: String,
    },
    usedCoupons: {
      type: [String], 
      default: [],
    },
    
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegex.test(value);
        },
        message: "Please enter a valid email.",
      },
      unique: true,
    },

    password: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    wallet:{
      type:Number,
      default:0,
    },
    transactions: {
      type: [transactionSchema], // Embed the transactions schema as an array
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password || "", 10);
  next();
});

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role || "user" },
    process.env.ACCESS_TOKEN || "suhail",
    {
      expiresIn: "5m",
    }
  );
};

// sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role || "user" },
    process.env.REFRESH_TOKEN || "suhail",
    {
      expiresIn: "3d",
    }
  );
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel: Model<IUser> = mongoose.model("users", userSchema);
export default UserModel;
