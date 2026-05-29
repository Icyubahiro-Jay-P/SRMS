import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

// @route   POST /api/sales
// @desc    Create a new sale
// @access  Private
export const createSale = async (req, res, next) => {
  try {
    const {
      invoiceNumber,
      salesDate,
      paymentMethod,
      customerNumber,
      productCode,
      quantity,
    } = req.body;

    // Validate required fields
    if (
      !invoiceNumber ||
      !salesDate ||
      !paymentMethod ||
      !customerNumber ||
      !productCode ||
      !quantity
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if sale already exists
    const saleExists = await Sale.findOne({ invoiceNumber });
    if (saleExists) {
      return res.status(400).json({
        success: false,
        message: "Sale with this invoice number already exists",
      });
    }

    // Get product to calculate total amount
    const product = await Product.findOne({ productCode });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const totalAmountPaid = product.unitPrice * quantity;

    const sale = await Sale.create({
      invoiceNumber,
      salesDate,
      paymentMethod,
      totalAmountPaid,
      customerNumber,
      productCode,
      quantity,
    });

    // Update product quantity sold
    product.quantitySold += quantity;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sales
// @desc    Get all sales
// @access  Private
export const getSales = async (req, res, next) => {
  try {
    const { search, sort = "-createdAt", page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { invoiceNumber: { $regex: search, $options: "i" } },
          { customerNumber: { $regex: search, $options: "i" } },
          { productCode: { $regex: search, $options: "i" } },
        ],
      };
    }

    const sales = await Sale.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Sale.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sales.length,
      total,
      page: parseInt(page),
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/sales/:invoiceNumber
// @desc    Get sale by invoice number
// @access  Private
export const getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findOne({
      invoiceNumber: req.params.invoiceNumber,
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/sales/:invoiceNumber
// @desc    Update sale
// @access  Private
export const updateSale = async (req, res, next) => {
  try {
    const { salesDate, paymentMethod, quantity } = req.body;

    let sale = await Sale.findOne({
      invoiceNumber: req.params.invoiceNumber,
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // If quantity changed, recalculate total amount
    if (quantity) {
      const product = await Product.findOne({ productCode: sale.productCode });
      const oldQuantity = sale.quantity;
      sale.quantity = quantity;
      sale.totalAmountPaid = product.unitPrice * quantity;

      // Update product quantity sold
      product.quantitySold -= oldQuantity;
      product.quantitySold += quantity;
      await product.save();
    }

    if (salesDate) sale.salesDate = salesDate;
    if (paymentMethod) sale.paymentMethod = paymentMethod;

    sale = await sale.save();

    res.status(200).json({
      success: true,
      message: "Sale updated successfully",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/sales/:invoiceNumber
// @desc    Delete sale
// @access  Private
export const deleteSale = async (req, res, next) => {
  try {
    const sale = await Sale.findOneAndDelete({
      invoiceNumber: req.params.invoiceNumber,
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // Update product quantity sold
    const product = await Product.findOne({ productCode: sale.productCode });
    product.quantitySold -= sale.quantity;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
