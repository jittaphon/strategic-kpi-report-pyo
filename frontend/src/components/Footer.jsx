import { Link } from "react-router-dom";
import React from "react";

export default function Footer() {
  return (
     <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto text-center">
            <p className="text-lg">&copy; 2025 ระบบสารสนเทศ ทุกสิทธิ์สงวน</p>
            <p className="text-sm mt-2">ออกแบบและพัฒนาโดย ทีมงาน กลุ่มงานสุขภาพดิจิทัล</p>
        </div>
    </footer>
  );}