import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Button, Alert } from "../components/Common";
import { reportService } from "../services/api";

export const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("summary");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const fetchReport = async () => {
    setLoading(true);
    try {
      let response;
      switch (selectedReport) {
        case "daily":
          response = await reportService.getDailyReport({ date: filterDate });
          break;
        case "weekly":
          response = await reportService.getWeeklyReport();
          break;
        case "monthly":
          response = await reportService.getMonthlyReport({
            month: filterMonth,
            year: filterYear,
          });
          break;
        case "summary":
        default:
          response = await reportService.getSummary();
          break;
      }
      setReportData(response.data);
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Failed to fetch report",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReport();
  }, [selectedReport]);

  return (
    <div>
      <Navigation />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Sales Reports</h1>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Report Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Report Type</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedReport("summary")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                selectedReport === "summary"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setSelectedReport("daily")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                selectedReport === "daily"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setSelectedReport("weekly")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                selectedReport === "weekly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedReport("monthly")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                selectedReport === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Filters */}
        {selectedReport === "daily" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filter</h2>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <Button
                variant="primary"
                onClick={fetchReport}
                disabled={loading}
              >
                {loading ? "Loading..." : "Generate Report"}
              </Button>
            </div>
          </div>
        )}

        {selectedReport === "monthly" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filter</h2>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(2024, m - 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={filterYear}
                  onChange={(e) => setFilterYear(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 w-24"
                />
              </div>
              <Button
                variant="primary"
                onClick={fetchReport}
                disabled={loading}
              >
                {loading ? "Loading..." : "Generate Report"}
              </Button>
            </div>
          </div>
        )}

        {/* Report Display */}
        {reportData && (
          <div className="space-y-6">
            {/* Summary Stats */}
            {(selectedReport === "summary" ||
              selectedReport === "daily" ||
              selectedReport === "weekly" ||
              selectedReport === "monthly") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Total Sales
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {reportData.totalSales}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Total Revenue
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${reportData.totalRevenue?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            )}

            {/* Daily Breakdown for Weekly/Monthly */}
            {reportData.dailyBreakdown && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Daily Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(reportData.dailyBreakdown).map(
                    ([day, data]) => (
                      <div
                        key={day}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <span className="text-gray-700">{day}</span>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${data.revenue?.toFixed(2) || "0.00"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {data.count} sales
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Payment Method Breakdown for Monthly/Summary */}
            {reportData.paymentMethodBreakdown &&
              reportData.paymentMethodBreakdown.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Payment Methods
                  </h3>
                  <div className="space-y-3">
                    {reportData.paymentMethodBreakdown.map((method, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <span className="text-gray-700 capitalize">
                          {method._id?.replace("_", " ")}
                        </span>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${method.revenue?.toFixed(2) || "0.00"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {method.count} transactions
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Top Products for Summary */}
            {reportData.topProducts && reportData.topProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Top 5 Products
                </h3>
                <div className="space-y-3">
                  {reportData.topProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="text-gray-700">{product._id}</span>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${product.totalRevenue?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.salesCount} sales
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transactions List */}
            {reportData.data && reportData.data.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Transactions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left px-4 py-2 font-semibold">
                          Invoice #
                        </th>
                        <th className="text-left px-4 py-2 font-semibold">
                          Customer #
                        </th>
                        <th className="text-left px-4 py-2 font-semibold">
                          Product Code
                        </th>
                        <th className="text-left px-4 py-2 font-semibold">
                          Quantity
                        </th>
                        <th className="text-left px-4 py-2 font-semibold">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.data.map((sale, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{sale.invoiceNumber}</td>
                          <td className="px-4 py-2">{sale.customerNumber}</td>
                          <td className="px-4 py-2">{sale.productCode}</td>
                          <td className="px-4 py-2">{sale.quantity}</td>
                          <td className="px-4 py-2">
                            ${sale.totalAmountPaid?.toFixed(2) || "0.00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
