import React, { useState } from "react";
import {
  FiHome,
  FiFileText,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
      { label: "ให้บริการ การแพทย์ทางไกล (Telemedicine)", path: "/report/tele_med" },
      { label: "ผลการดำเนินงาน NCD Registry จ.พะเยา", path: "/report/ncd_registry" },
    ],
  },
];

export default function Sidebar() {
  const [collapsed] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [reportExpanded, setReportExpanded] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const expanded = hovered || !collapsed;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setReportExpanded(true);
      }}
    className={`min-h-screen flex flex-col border-r bg-blue-50 backdrop-blur-lg shadow-xl transition-all duration-500 ${ // เปลี่ยนตรงนี้ ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* Menu Items */}
      <nav className="flex-1 mt-4 space-y-1">
        {menuItems.map((item, index) => {
          const isActiveMain = pathname === item.path;
          return (
            <div key={index}>
              {/* Main menu item */}
              <div
                className={`group flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer transition-all ${
                  isActiveMain
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-white/30"
                }`}
                onClick={() => {
                  if (item.children) {
                    setReportExpanded(!reportExpanded);
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
              >
                <span
                  className={`text-xl transition-colors ${
                    isActiveMain ? "text-blue-700" : "text-blue-600 group-hover:text-blue-800"
                  }`}
                >
                  {item.icon}
                </span>

                <div className="flex-1 flex items-center justify-between">
                  <span
                    className={`whitespace-nowrap transition-opacity duration-300 ${
                      expanded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>

                  {item.children && expanded && (
                    <FiChevronDown
                      className={`text-sm text-gray-500 transition-transform ${
                        reportExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Sub-menu */}
              {item.children && (
                <div
                  className={`ml-8 mt-1 space-y-1 transition-all duration-300 overflow-hidden ${
                    expanded && reportExpanded ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible"
                  }`}
                >
                  {item.children.map((child, childIndex) => {
                    const isActiveChild = pathname === child.path;
                    return (
                      <Link
                        key={childIndex}
                        to={child.path}
                        className={`block px-3 py-2 rounded-md text-sm transition-all ${
                          isActiveChild
                            ? "bg-blue-200 text-blue-800 font-medium"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
