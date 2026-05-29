import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input, Button, Alert } from "../components/Common";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: "Passwords do not match", type: "error" });
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
          SRMS
        </h1>
        <p className="mb-6 text-center text-gray-600">Create Account</p>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full p-2 text-white bg-blue-600 rounded-md"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
