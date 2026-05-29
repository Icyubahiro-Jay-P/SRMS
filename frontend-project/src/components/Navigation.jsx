import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navigation = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Customers", path: "/customers"},
    { label: "Products", path: "/products"},
    { label: "Sales", path: "/sales"},
    { label: "Reports", path: "/reports"},
  ];

  return (
    <nav className="text-white bg-blue-600 shadow-lg">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">SRMS</h1>
          </div>

          <div className="items-center hidden space-x-4 md:flex">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="px-3 py-2 text-sm font-medium transition rounded-md hover:bg-blue-700"
              >
              {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium transition bg-red-500 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
