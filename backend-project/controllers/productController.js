import Product from "../models/Product.js";

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
export const createProduct = async (req, res, next) => {
  try {
    const { productCode, productName, quantitySold, unitPrice } = req.body;

    // Validate required fields
    if (
      !productCode ||
      !productName ||
      quantitySold === undefined ||
      !unitPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if product already exists
    const exists = await Product.findOne({ productCode });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product with this code already exists",
      });
    }

    const product = await Product.create({
      productCode,
      productName,
      quantitySold,
      unitPrice,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products
// @desc    Get all products
// @access  Private
export const getProducts = async (req, res, next) => {
  try {
    const { search, sort = "-createdAt", page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { productCode: { $regex: search, $options: "i" } },
          { productName: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:productCode
// @desc    Get product by product code
// @access  Private
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      productCode: req.params.productCode,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/products/:productCode
// @desc    Update product
// @access  Private
export const updateProduct = async (req, res, next) => {
  try {
    const { productName, quantitySold, unitPrice } = req.body;

    let product = await Product.findOne({
      productCode: req.params.productCode,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (productName) product.productName = productName;
    if (quantitySold !== undefined) product.quantitySold = quantitySold;
    if (unitPrice) product.unitPrice = unitPrice;

    product = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/products/:productCode
// @desc    Delete product
// @access  Private
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      productCode: req.params.productCode,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
