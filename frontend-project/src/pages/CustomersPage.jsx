import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Modal, Button, Input, Table, Alert } from "../components/Common";
import { customerService } from "../services/api";

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerNumber: "",
    firstName: "",
    lastName: "",
    telephone: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll();
      setCustomers(response.data.data);
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Failed to fetch customers",
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
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.customerNumber, formData);
        setAlert({
          message: "Customer updated successfully",
          type: "success",
        });
      } else {
        await customerService.create(formData);
        setAlert({
          message: "Customer created successfully",
          type: "success",
        });
      }
      setShowModal(false);
      setFormData({
        customerNumber: "",
        firstName: "",
        lastName: "",
        telephone: "",
        address: "",
      });
      fetchCustomers();
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Operation failed",
        type: "error",
      });
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowModal(true);
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Delete customer ${customer.firstName}?`)) {
      try {
        await customerService.delete(customer.customerNumber);
        setAlert({ message: "Customer deleted successfully", type: "success" });
        fetchCustomers();
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
    setEditingCustomer(null);
    setFormData({
      customerNumber: "",
      firstName: "",
      lastName: "",
      telephone: "",
      address: "",
    });
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  const tableRows = customers.map((c) => ({
    customerNumber: c.customerNumber,
    firstName: c.firstName,
    lastName: c.lastName,
    telephone: c.telephone,
    address: c.address,
    _id: c._id,
  }));

  return (
    <div>
      <Navigation />
      <div className="p-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Customers</h1>
          <Button
            variant="primary"
            onClick={() => {
              setEditingCustomer(null);
              setFormData({
                customerNumber: "",
                firstName: "",
                lastName: "",
                telephone: "",
                address: "",
              });
              setShowModal(true);
            }}
          >
            + Add Customer
          </Button>
        </div>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        {customers.length > 0 ? (
          <Table
            headers={[
              "Customer #",
              "First Name",
              "Last Name",
              "Telephone",
              "Address",
            ]}
            rows={tableRows}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No customers found. Add one to get started!
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer Number"
            type="text"
            name="customerNumber"
            value={formData.customerNumber}
            onChange={handleChange}
            disabled={editingCustomer}
            required
          />

          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <Input
            label="Telephone"
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
          />

          <Input
            label="Address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <Button type="submit" variant="primary" className="w-full p-2 text-white bg-blue-600 rounded-md">
            {editingCustomer ? "Update" : "Create"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CustomersPage;
