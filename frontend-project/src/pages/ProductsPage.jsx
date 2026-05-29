import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Modal, Button, Input, Table, Alert } from "../components/Common";
import { productService } from "../services/api";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    quantitySold: 0,
    unitPrice: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data.data);
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Failed to fetch products",
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
      [name]:
        name === "quantitySold" || name === "unitPrice"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.productCode, formData);
        setAlert({ message: "Product updated successfully", type: "success" });
      } else {
        await productService.create(formData);
        setAlert({ message: "Product created successfully", type: "success" });
      }
      setShowModal(false);
      setFormData({
        productCode: "",
        productName: "",
        quantitySold: 0,
        unitPrice: 0,
      });
      fetchProducts();
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Operation failed",
        type: "error",
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Delete product ${product.productName}?`)) {
      try {
        await productService.delete(product.productCode);
        setAlert({ message: "Product deleted successfully", type: "success" });
        fetchProducts();
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
    setEditingProduct(null);
    setFormData({
      productCode: "",
      productName: "",
      quantitySold: 0,
      unitPrice: 0,
    });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  const tableRows = products.map((p) => ({
    productCode: p.productCode,
    productName: p.productName,
    quantitySold: p.quantitySold,
    unitPrice: `$${p.unitPrice.toFixed(2)}`,
    _id: p._id,
  }));

  return (
    <div>
      <Navigation />
      <div className="p-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button
            variant="primary"
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                productCode: "",
                productName: "",
                quantitySold: 0,
                unitPrice: 0,
              });
              setShowModal(true);
            }}
          >
            + Add Product
          </Button>
        </div>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        {products.length > 0 ? (
          <Table
            headers={[
              "Product Code",
              "Product Name",
              "Quantity Sold",
              "Unit Price",
            ]}
            rows={tableRows}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No products found. Add one to get started!
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Code"
            type="text"
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            disabled={editingProduct}
            required
          />

          <Input
            label="Product Name"
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />

          <Input
            label="Quantity Sold"
            type="number"
            name="quantitySold"
            value={formData.quantitySold}
            onChange={handleChange}
            required
          />

          <Input
            label="Unit Price"
            type="number"
            step="0.01"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            required
          />

          <Button type="submit" variant="primary" className="w-full p-2 text-white bg-blue-600 rounded-md">
            {editingProduct ? "Update" : "Create"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
