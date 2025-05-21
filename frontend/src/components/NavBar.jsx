import { Link } from "react-router-dom";
import React from "react";

export default function NavBar() {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white text-xl font-bold">
              MyApp
            </Link>

            <div className="relative group">
              <button className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Services
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/service1"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Service 1
                </Link>
                <Link
                  to="/service2"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Service 2
                </Link>
                {/* เพิ่มได้เรื่อย ๆ */}
              </div>
            </div>

            <Link
              to="/about"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
