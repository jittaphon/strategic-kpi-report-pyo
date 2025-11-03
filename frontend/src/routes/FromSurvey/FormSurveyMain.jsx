import React from "react";
import { Link } from "react-router-dom";
import { FileText, Sparkles, Clock } from "lucide-react";

export default function FormSurvey() {
  const forms = [
    {
      id: "hdc2026",
      label: "อบรมเชิงปฏิบัติการพัฒนาศักยภาพด้านการจัดการข้อมูลสุขภาพดิจิทัลตามโครงสร้างมาตรฐาน 43 แฟ้ม",
      description: "นำสู่คุณภาพคลังข้อมูล HDC ประจำปี 2569",
      isNew: true,
      date: "พ.ย. 2568"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                แบบฟอร์มสำรวจข้อมูล
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                เลือกแบบฟอร์มที่ต้องการกรอกข้อมูล
              </p>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid gap-6">
          {forms.map((form) => (
            <Link
              key={form.id}
              to={`/form-survey/${form.id}`}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Gradient Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              {/* NEW Badge - Floating */}
              {form.isNew && (
                <div className="absolute top-6 right-6 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-md opacity-60 animate-pulse"></div>
                    <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-1.5 rounded-full font-semibold text-sm shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      <span>NEW</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start gap-5">
                  {/* Icon Circle */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {form.label}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {form.description}
                    </p>
                    
                    {/* Date Badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>เปิดรับข้อมูล: {form.date}</span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex-shrink-0 pt-1">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-colors pointer-events-none"></div>
            </Link>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">หมายเหตุ</h4>
              <p className="text-sm text-gray-600">
                กรุณากรอกข้อมูลให้ครบถ้วนและตรวจสอบความถูกต้องก่อนส่งแบบฟอร์ม
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}