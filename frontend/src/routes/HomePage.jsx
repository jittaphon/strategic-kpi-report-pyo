import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ต้องลงทะเบียน plugin สำหรับ React ก่อน
gsap.registerPlugin(useGSAP);

export default function HomePage() {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".welcome-text", {
      opacity: 0,
  y: -20,
  filter: "blur(4px)",
  duration: 0.8,
  delay: 0.2,
    })
     .from(".icon", {
  opacity: 0,
  scale: 0.8,
  filter: "blur(10px)",
  duration: 1,
  ease: "power2.out",
}) // เริ่มซ้อนกับก่อนหน้าครึ่งวินาที
      .from(".office-info", {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }, "-=0.3");
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-start pt-20 overflow-hidden bg-white"
    >
      {/* พื้นหลัง Blob */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-br from-green-300 to-green-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-gradient-to-br from-teal-300 to-teal-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000" />

      {/* Welcome Text */}
       <h1 className="welcome-text text-4xl font-bold mb-10 text-black z-10">
       Welcome to the KPI Health PYO
      </h1>
      <h1 className="welcome-text text-3xl font-bold mb-10 text-black z-10">
        ยินดีต้อนรับเข้าสู่ระบบรายงาน KPI
      </h1>

      {/* Animated Icon */}
      <img
  src="https://pyo.moph.go.th/datahub/strategic-kpi-report-pyo/public/images/icon.png"
  alt="Health Icon"
  className="icon w-64 h-64 my-[100px] drop-shadow-lg z-10 hover:scale-105 transition-transform duration-300"
/>


      {/* Office name */}
      <div className="office-info text-center mt-4 bg-black/50 p-4 rounded-xl shadow-lg text-white z-10">
        <p className="text-2xl font-semibold">สำนักงานสาธารณสุขจังหวัดพะเยา</p>
        <p className="text-lg">Phayao Provincial Public Health Office</p>
      </div>
    </div>
  );
}
