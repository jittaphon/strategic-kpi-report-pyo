import { useState } from "react";
import { FiHome, FiFileText, FiSettings, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import React from 'react'
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: <FiHome />, label: "หน้าหลัก" },
    { icon: <FiFileText />, label: "รายงาน" },
    { icon: <FiSettings />, label: "ตั้งค่า" },
  ];

  return (

    <div className={`h-screen bg-white border-r shadow-md transition-all duration-300 ${ collapsed ? "w-16" : "w-64" } flex flex-col`} >

      <div className="flex justify-end p-2">
        <button className="text-gray-600 hover:text-gray-800 transition" onClick={()=>setCollapsed(!collapsed)} > {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}</button>
      </div>

      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
          >
            <span className="text-blue-600 text-xl">{item.icon}</span>
            {!collapsed && <span className="text-gray-800">{item.label}</span>}
          </div>
        ))}
      </nav>
      
    </div>
  );
}
