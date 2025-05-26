import { useState } from "react";
import {
  FiHome,
  FiFileText,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import React from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    icon: <FiHome />,
    label: "หน้าหลัก",
    path: "/",
  },
  {
    icon: <FiFileText />,
    label: "รายงาน",
    children: [
      { label: "KPI จังหวัด", path: "/report/tele_med" },
      { label: "KPI เขต", path: "/report/region" },
    ],
  },
];


export default function Sidebar() {
  const [collapsed] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [reportExpanded, setReportExpanded] = useState(false);
  const navigate = useNavigate();

  const expanded = hovered || !collapsed;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
      setHovered(false);
      setReportExpanded(false); // ปิด sub-menu ทันทีเมื่อ mouse ออก
  }}
      
      className={`h-screen border-r bg-white shadow-md flex flex-col transition-all duration-300 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* Menu Items */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            {/* Main menu item */}
            <div
              className="group flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => {
                if (item.children) {
                  setReportExpanded(!reportExpanded);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              <span className="text-blue-600 text-xl">{item.icon}</span>
              <div className="flex-1 flex items-center justify-between">
                <span
                  className={`text-gray-800 whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                    expanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
                {item.children && expanded && (
                  <FiChevronDown
                    className={`text-gray-500 text-sm transition-transform ${
                      reportExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Sub-menu items */}
            {item.children && reportExpanded && expanded && (
              <div className="ml-10 mt-1 space-y-1">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    to={child.path}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
