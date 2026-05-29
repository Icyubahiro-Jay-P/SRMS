import Customer from "../models/Customer.js";

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Private
export const createCustomer = async (req, res, next) => {
  try {
    const { customerNumber, firstName, lastName, telephone, address } =
      req.body;

    // Validate required fields
    if (!customerNumber || !firstName || !lastName || !telephone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if customer already exists
    const exists = await Customer.findOne({ customerNumber });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Customer with this number already exists",
      });
    }

    const customer = await Customer.create({
      customerNumber,
      firstName,
      lastName,
      telephone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private
export const getCustomers = async (req, res, next) => {
  try {
    const { search, sort = "-createdAt", page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { customerNumber: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { telephone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const customers = await Customer.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Customer.countDocuments(query);

    res.status(200).json({
      success: true,
      count: customers.length,
      total,
      page: parseInt(page),
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/customers/:customerNumber
// @desc    Get customer by customer number
// @access  Private
export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      customerNumber: req.params.customerNumber,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/customers/:customerNumber
// @desc    Update customer
// @access  Private
export const updateCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, telephone, address } = req.body;

    let customer = await Customer.findOne({
      customerNumber: req.params.customerNumber,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (telephone) customer.telephone = telephone;
    if (address) customer.address = address;

    customer = await customer.save();

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/customers/:customerNumber
// @desc    Delete customer
// @access  Private
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOneAndDelete({
      customerNumber: req.params.customerNumber,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
