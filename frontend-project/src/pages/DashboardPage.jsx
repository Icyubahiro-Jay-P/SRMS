import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { reportService } from "../services/api";
import { Alert } from "../components/Common";

export const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await reportService.getSummary();
        setSummary(response.data);
      } catch (error) {
        setAlert({
          message: error.response?.data?.message || "Failed to fetch summary",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Sales Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Sales
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {summary.totalSales}
              </p>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Revenue
              </h2>
              <p className="text-3xl font-bold text-green-600">
                ${summary.totalRevenue?.toFixed(2) || "0.00"}
              </p>
            </div>

            {/* Top Products */}
            {summary.topProducts && summary.topProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Top 5 Products
                </h2>
                <div className="space-y-3">
                  {summary.topProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
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

            {/* Payment Methods */}
            {summary.paymentMethodBreakdown &&
              summary.paymentMethodBreakdown.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Payment Methods
                  </h2>
                  <div className="space-y-3">
                    {summary.paymentMethodBreakdown.map((method, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
