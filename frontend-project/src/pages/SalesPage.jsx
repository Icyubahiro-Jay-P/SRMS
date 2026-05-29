import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import {
  Modal,
  Button,
  Input,
  Select,
  Table,
  Alert,
} from "../components/Common";
import { saleService, customerService, productService } from "../services/api";

export const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    salesDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    customerNumber: "",
    productCode: "",
    quantity: 1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, customersRes, productsRes] = await Promise.all([
        saleService.getAll(),
        customerService.getAll(),
        productService.getAll(),
      ]);
      setSales(salesRes.data.data);
      setCustomers(customersRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Failed to fetch data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSale) {
        await saleService.update(editingSale.invoiceNumber, formData);
        setAlert({ message: "Sale updated successfully", type: "success" });
      } else {
        await saleService.create(formData);
        setAlert({ message: "Sale created successfully", type: "success" });
      }
      setShowModal(false);
      setFormData({
        invoiceNumber: "",
        salesDate: new Date().toISOString().split("T")[0],
        paymentMethod: "",
        customerNumber: "",
        productCode: "",
        quantity: 1,
      });
      fetchData();
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Operation failed",
        type: "error",
      });
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData(sale);
    setShowModal(true);
  };

  const handleDelete = async (sale) => {
    if (window.confirm(`Delete sale ${sale.invoiceNumber}?`)) {
      try {
        await saleService.delete(sale.invoiceNumber);
        setAlert({ message: "Sale deleted successfully", type: "success" });
        fetchData();
      } catch (error) {
        setAlert({
          message: error.response?.data?.message || "Failed to delete",
          type: "error",
        });
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSale(null);
    setFormData({
      invoiceNumber: "",
      salesDate: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      customerNumber: "",
      productCode: "",
      quantity: 1,
    });
  };

  if (loading && sales.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  const tableRows = sales.map((s) => ({
    invoiceNumber: s.invoiceNumber,
    customerNumber: s.customerNumber,
    productCode: s.productCode,
    quantity: s.quantity,
    totalAmount: `$${s.totalAmountPaid.toFixed(2)}`,
    paymentMethod: s.paymentMethod,
    _id: s._id,
  }));

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "credit_card", label: "Credit Card" },
    { value: "check", label: "Check" },
    { value: "transfer", label: "Transfer" },
  ];

  return (
    <div>
      <Navigation />
      <div className="p-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Sales</h1>
          <Button
            variant="primary"
            onClick={() => {
              setEditingSale(null);
              setFormData({
                invoiceNumber: "",
                salesDate: new Date().toISOString().split("T")[0],
                paymentMethod: "",
                customerNumber: "",
                productCode: "",
                quantity: 1,
              });
              setShowModal(true);
            }}
          >
            + New Sale
          </Button>
        </div>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        {sales.length > 0 ? (
          <Table
            headers={[
              "Invoice #",
              "Customer #",
              "Product Code",
              "Quantity",
              "Total Amount",
              "Method",
            ]}
            rows={tableRows}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No sales found. Record one to get started!
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        title={editingSale ? "Edit Sale" : "Record New Sale"}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Invoice Number"
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            disabled={editingSale}
            required
          />

          <Input
            label="Sales Date"
            type="date"
            name="salesDate"
            value={formData.salesDate}
            onChange={handleChange}
            required
          />

          <Select
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            options={paymentMethods}
            required
          />

          <Select
            label="Customer"
            name="customerNumber"
            value={formData.customerNumber}
            onChange={handleChange}
            options={customers.map((c) => ({
              value: c.customerNumber,
              label: `${c.firstName} ${c.lastName}`,
            }))}
            required
          />

          <Select
            label="Product"
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            options={products.map((p) => ({
              value: p.productCode,
              label: `${p.productName} - $${p.unitPrice}`,
            }))}
            required
          />

          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />

          <Button type="submit" variant="primary" className="w-full p-2 text-white bg-blue-600 rounded-md">
            {editingSale ? "Update" : "Record Sale"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SalesPage;
