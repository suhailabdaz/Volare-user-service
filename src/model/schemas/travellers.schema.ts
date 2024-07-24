import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITraveller extends Document {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  nationality?: string;
  mealPreference?: string;
  passportNo?: string;
  passportNationality?: string;
  passportExpiry?: Date;
  phone?: string;
  email?: string;
  userId?: Schema.Types.ObjectId;
}

const travellerSchema: Schema<ITraveller> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
    },
    mealPreference: {
      type: String,
    },
    passportNo: {
      type: String,
      unique: true,
    },
    passportNationality: {
      type: String,
    },
    passportExpiry: {
      type: Date,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required:true,
      unique:true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const TravellerModel: Model<ITraveller> = mongoose.model("Traveller", travellerSchema);
export default TravellerModel;
