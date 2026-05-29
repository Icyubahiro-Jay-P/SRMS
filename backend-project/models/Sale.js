import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    salesDate: {
      type: Date,
      required: [true, "Sales date is required"],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit_card", "check", "transfer"],
      required: [true, "Payment method is required"],
    },
    totalAmountPaid: {
      type: Number,
      required: [true, "Total amount paid is required"],
      min: 0,
    },
    customerNumber: {
      type: String,
      required: [true, "Customer number is required"],
      ref: "Customer",
    },
    productCode: {
      type: String,
      required: [true, "Product code is required"],
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 1,
    },
  },
  { timestamps: true },
);

saleSchema.index({ invoiceNumber: 1 });
saleSchema.index({ customerNumber: 1 });
saleSchema.index({ productCode: 1 });
saleSchema.index({ salesDate: -1 });

export default mongoose.model("Sale", saleSchema);
