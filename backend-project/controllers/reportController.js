import Sale from "../models/Sale.js";

// @route   GET /api/reports/daily
// @desc    Get daily sales report
// @access  Private
export const getDailySalesReport = async (req, res, next) => {
  try {
    const { date } = req.query;

    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      query = {
        salesDate: {
          $gte: startDate,
          $lt: endDate,
        },
      };
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      query = {
        salesDate: {
          $gte: today,
          $lt: tomorrow,
        },
      };
    }

    const sales = await Sale.find(query);

    const totalSales = sales.length;
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.totalAmountPaid,
      0,
    );

    res.status(200).json({
      success: true,
      reportType: "Daily",
      date: date || new Date().toISOString().split("T")[0],
      totalSales,
      totalRevenue,
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/reports/weekly
// @desc    Get weekly sales report
// @access  Private
export const getWeeklySalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);

      query = {
        salesDate: {
          $gte: start,
          $lt: end,
        },
      };
    } else {
      // Default to current week (Monday to Sunday)
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(today.setDate(diff));
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 7);

      query = {
        salesDate: {
          $gte: monday,
          $lt: sunday,
        },
      };
    }

    const sales = await Sale.find(query);

    const totalSales = sales.length;
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.totalAmountPaid,
      0,
    );

    // Group by day
    const dailyBreakdown = {};
    sales.forEach((sale) => {
      const day = sale.salesDate.toISOString().split("T")[0];
      if (!dailyBreakdown[day]) {
        dailyBreakdown[day] = { count: 0, revenue: 0 };
      }
      dailyBreakdown[day].count += 1;
      dailyBreakdown[day].revenue += sale.totalAmountPaid;
    });

    res.status(200).json({
      success: true,
      reportType: "Weekly",
      totalSales,
      totalRevenue,
      dailyBreakdown,
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/reports/monthly
// @desc    Get monthly sales report
// @access  Private
export const getMonthlySalesReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    let query = {};
    let reportMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    let reportYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 1);

    query = {
      salesDate: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    const sales = await Sale.find(query);

    const totalSales = sales.length;
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.totalAmountPaid,
      0,
    );

    // Group by payment method
    const paymentMethodBreakdown = {};
    sales.forEach((sale) => {
      if (!paymentMethodBreakdown[sale.paymentMethod]) {
        paymentMethodBreakdown[sale.paymentMethod] = { count: 0, revenue: 0 };
      }
      paymentMethodBreakdown[sale.paymentMethod].count += 1;
      paymentMethodBreakdown[sale.paymentMethod].revenue +=
        sale.totalAmountPaid;
    });

    // Group by day
    const dailyBreakdown = {};
    sales.forEach((sale) => {
      const day = sale.salesDate.toISOString().split("T")[0];
      if (!dailyBreakdown[day]) {
        dailyBreakdown[day] = { count: 0, revenue: 0 };
      }
      dailyBreakdown[day].count += 1;
      dailyBreakdown[day].revenue += sale.totalAmountPaid;
    });

    res.status(200).json({
      success: true,
      reportType: "Monthly",
      month: reportMonth,
      year: reportYear,
      totalSales,
      totalRevenue,
      paymentMethodBreakdown,
      dailyBreakdown,
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/reports/summary
// @desc    Get overall sales summary
// @access  Private
export const getSalesSummary = async (req, res, next) => {
  try {
    const totalSales = await Sale.countDocuments();
    const totalRevenue = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmountPaid" },
        },
      },
    ]);

    // Get top products
    const topProducts = await Sale.aggregate([
      {
        $group: {
          _id: "$productCode",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmountPaid" },
          salesCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    // Get payment method breakdown
    const paymentMethodBreakdown = await Sale.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmountPaid" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.status(200).json({
      success: true,
      reportType: "Summary",
      totalSales,
      totalRevenue: totalRevenue[0]?.total || 0,
      topProducts,
      paymentMethodBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
