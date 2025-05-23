import { Link } from "react-router-dom";
import React from "react";

export default function NavBar() {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-full px-4">
        <div className="flex justify-start items-left h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white text-xl font-bold">
              KPI Health PYO
            </Link>

     
          </div>

          
        </div>
      </div>
    </nav>
  );
}
