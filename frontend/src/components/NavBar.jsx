import { Link } from "react-router-dom";
import React from "react";

export default function NavBar() {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="w-full px-4">
        <div className="flex items-center h-16 space-x-4">
          <img
            src="/images/icon.png"
            alt="Health Icon"
            className="w-10 h-10"
          />
          <Link to="/" className="text-white text-xl font-bold">
            KPI Health PYO
          </Link>
        </div>
      </div>
    </nav>
  );
}
