import React, { useState } from "react";
import {
  Home,
  FileText,
  BarChart3,
  Menu,
  X,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKpiDropdownOpen, setIsKpiDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "home",
      label: "Overview",
      icon: Home,
      description: "ภาพรวม Dashboard",
      path: "/",
    },
    {
      id: "data-submission",
      label: "สรุปการส่งข้อมูล 43 แฟ้ม",
      icon: FileText,
      description: "ตรวจสอบการส่งข้อมูลรายเดือน",
      path: "/files-43",
    },
    {
      id: "kpi-reports",
      label: "รายงานตัวชี้วัดที่สำคัญ",
      icon: BarChart3,
      description: "ตัวชี้วัดหลัก 100+ รายการ",
      hasSubMenu: true,
      subMenuItems: [
        {
          id: "telemedicine",
          label: "การให้บริการแพทย์ทางไกล (Telemedicine)",
          path: "/kpi/tele_med",
        },
      ],
    },
    {
      id: "form-survey",
      label: "แบบฟอร์มสำรวจ",
      icon: FileText,
      description: "รวบรวมแบบฟอร์มสำรวจต่างๆ",
      path: "/form-survey",
    },
    {
      id: "other",
      label: "อื่นๆ / คู่มือ",
      icon: BookOpen,
      description: "เอกสารและคู่มือการใช้งาน",
      path: "/other",
    },
  ];

  const currentPath = location.pathname;

  // ✅ Logic แก้ใหม่: รองรับ path ลูกเช่น /form-survey/a
  const activeMenu =
    menuItems.find((item) => {
      if (item.hasSubMenu) {
        return (
          currentPath === item.path ||
          currentPath.startsWith(item.path + "/") ||
          item.subMenuItems.some((sub) =>
            currentPath.startsWith(sub.path)
          )
        );
      }
      return (
        currentPath === item.path ||
        currentPath.startsWith(item.path + "/")
      );
    })?.id || "home";

  const handleMenuClick = (path) => {
    setIsMobileMenuOpen(false);
    setIsKpiDropdownOpen(false);
    if (path) navigate(path);
  };

  const toggleKpiDropdown = () => setIsKpiDropdownOpen(!isKpiDropdownOpen);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => handleMenuClick("/")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              <img
                src="https://pyo.moph.go.th/datahub/pyo-kpi/public/images/icon.png"
                alt="Health Icon"
                className="w-12 h-12 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                KPI Health PYO
              </h1>
              <p className="text-xs text-gray-500">
                สำนักงานสาธารณสุขจังหวัดพะเยา
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="flex-1 hidden lg:flex items-center gap-2 ml-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              if (item.hasSubMenu) {
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={toggleKpiDropdown}
                      className={`relative group px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-xl opacity-30 -z-10" />
                      )}
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`w-5 h-5 ${
                            isActive
                              ? "text-white"
                              : "text-gray-600 group-hover:text-blue-600"
                          }`}
                        />
                        <span className="font-medium text-sm whitespace-nowrap">
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isKpiDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {isKpiDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-slideDown">
                        {item.subMenuItems.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.path}
                            onClick={() => handleMenuClick(sub.path)}
                            className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                              currentPath.startsWith(sub.path)
                                ? "bg-blue-50"
                                : ""
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-700 font-medium">
                              {sub.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className={`relative group px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-xl opacity-30 -z-10" />
                  )}
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 group-hover:text-blue-600"
                      }`}
                    />
                    <span className="font-medium text-sm whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors ml-auto"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-gray-200 animate-slideDown">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              if (item.hasSubMenu) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={toggleKpiDropdown}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p
                          className={`text-xs ${
                            isActive ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isKpiDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isKpiDropdownOpen && (
                      <div className="ml-8 mt-2 space-y-1 animate-slideDown">
                        {item.subMenuItems.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.path}
                            onClick={() => handleMenuClick(sub.path)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                              currentPath.startsWith(sub.path)
                                ? "bg-blue-100"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-700">
                              {sub.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p
                      className={`text-xs ${
                        isActive ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
