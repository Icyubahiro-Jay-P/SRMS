import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    quantitySold: {
      type: Number,
      required: [true, "Quantity sold is required"],
      default: 0,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: 0,
    },
  },
  { timestamps: true },
);

productSchema.index({ productCode: 1 });

export default mongoose.model("Product", productSchema);
