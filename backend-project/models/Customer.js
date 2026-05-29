import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    telephone: {
      type: String,
      required: [true, "Telephone is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

customerSchema.index({ customerNumber: 1 });

export default mongoose.model("Customer", customerSchema);
