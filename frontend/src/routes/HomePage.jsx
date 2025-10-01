import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Users, Activity, AlertCircle, FileText, CheckCircle2,Server ,Flag, Calendar, ArrowUp, ArrowDown, Zap } from 'lucide-react';
import { API } from '../api';
import { Line } from "react-chartjs-2";
import { Select } from 'antd';
import 'antd/dist/reset.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

const HomePage = () => {
  const containerRef = useRef();
  const [chartData, setChartData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [fiscalYear, setFiscalYear] = React.useState('ปีงบ 2568');
  const [data43, setData43] = useState(0);

  useEffect(() => {
    setMounted(true);
    Fetch43FileData(fiscalYear)
  }, [fiscalYear])

const Fetch43FileData = async (year) => {
  try {
    if (year === "ปีงบ 2568") {
      year = 2025;
    }

    const File_43data = await API.hdccheckAPI.getAppointments(year);
    setData43(File_43data.data.data.length)

    const totalsByMonth = {};
    File_43data.data.data.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (key.includes("_")) {
          // ตัดเหลือเฉพาะชื่อเดือน เช่น "Oct_24" → "Oct"
          const monthKey = key.split("_")[0];
          totalsByMonth[monthKey] =
            (totalsByMonth[monthKey] || 0) + (Number(value) || 0);
        }
      });
    });

    // ลำดับเดือน (ชื่อย่ออังกฤษ)
    const monthOrder = [
      "Oct", "Nov", "Dec",
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep"
    ];

    // Mapping อังกฤษ → ไทย (เต็ม)
    const monthMap = {
      Oct: "ตุลาคม",
      Nov: "พฤศจิกายน",
      Dec: "ธันวาคม",
      Jan: "มกราคม",
      Feb: "กุมภาพันธ์",
      Mar: "มีนาคม",
      Apr: "เมษายน",
      May: "พฤษภาคม",
      Jun: "มิถุนายน",
      Jul: "กรกฎาคม",
      Aug: "สิงหาคม",
      Sep: "กันยายน",
    };

    const labels = monthOrder
      .filter((m) => totalsByMonth[m] !== undefined)
      .map((m) => monthMap[m]); // แปลงเป็นชื่อไทยเต็ม

    const values = monthOrder
      .filter((m) => totalsByMonth[m] !== undefined)
      .map((m) => totalsByMonth[m]);

    setChartData({
      labels,
      datasets: [
        {
          label: "ยอดรวมทั้งหมดทุก รพ.",
          data: values,
          borderColor: "rgba(37,99,235,1)",
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(37,99,235,0.4)");
            gradient.addColorStop(1, "rgba(37,99,235,0)");
            return gradient;
          },
          tension: 0.4,
          pointBackgroundColor: "white",
          pointBorderColor: "rgba(37,99,235,1)",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

 

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden"
    >
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Overview Dashboard
              </h1>
              <p className="text-gray-600 text-lg">ภาพรวมข้อมูลและตัวชี้วัด - สำนักงานสาธารณสุขจังหวัดพะเยา</p>
            </div>
            <div className="glass-card flex items-center gap-3 px-6 py-3">
              <div className='pt-3'>
                     <Calendar className="w-5 h-5  text-blue-600" />
                </div>
         
              <div className="text-right">
                <p className="text-xs text-gray-500">วันที่</p>
                <p className="font-semibold text-gray-800">29 กันยายน 2568</p>
              </div>
            </div>
          </div>
        </div>

{/* Quick Stats Row */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  {/* Card อำเภอ */}
  <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 
                  hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden">
    <div className="absolute inset-0 bg-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 
                    opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

    <div className="relative z-10 flex flex-col items-center text-center">
      {/* Title */}
      <p className="text-gray-600 font-semibold mb-2 flex items-center gap-2">
        <Flag className="w-5 h-5 text-blue-500" /> 
        จำนวนอำเภอ
      </p>

      {/* Number */}
      <h3 className="text-5xl font-extrabold text-gray-800 group-hover:text-transparent 
                     group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 
                     group-hover:bg-clip-text transition-all duration-300">
        9
      </h3>

      {/* Subtitle */}
      <span className="text-gray-500 text-sm mt-1">ในจังหวัดทั้งหมด</span>
    </div>
  </div>

  {/* Card รพ.สต. */}
  <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 
                  hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden">
    <div className="absolute inset-0 bg-pink-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 
                    opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

    <div className="relative z-10 flex flex-col items-center text-center">
      {/* Title */}
      <p className="text-gray-600 font-semibold mb-2 flex items-center gap-2">
        <Server className="w-5 h-5 text-pink-500" /> 
        รพ.สต. ทั้งหมด
      </p>

      {/* Number */}
      <h3 className="text-5xl font-extrabold text-gray-800 group-hover:text-transparent 
                     group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 
                     group-hover:bg-clip-text transition-all duration-300">
        {(data43).toLocaleString('en-US')}
      </h3>

      {/* Subtitle */}
      <span className="text-gray-500 text-sm mt-1">รวมทุกอำเภอ</span>
    </div>
  </div>
</div>


{/* Line Chart Section */}
<div className="mb-8">
  {/* Title + Select */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
      <Zap className="w-6 h-6 text-yellow-500" />
      จำนวนข้อมูลการให้บริการ (อ้างอิงตามข้อมูลในแฟ้ม service)
    </h2>

    <Select
      value={fiscalYear}
      onChange={(val) => setFiscalYear(val)}
      size="large"
      style={{
        width: 160,
        height: 56,
        borderRadius: "14px",
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        fontSize: "18px",
        fontWeight: 600,
      }}
      dropdownStyle={{
        backdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.85)",
        borderRadius: "12px",
        fontSize: "18px",
      }}
    >
      <Select.Option value="2026">ปีงบ 2569</Select.Option>
      <Select.Option value="2025">ปีงบ 2568</Select.Option>
      
    </Select>
  </div>

  {/* Chart */}
  <div className="glass-card p-6 max-h-[400px]">
    {chartData ? (
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              align: "top",
              anchor: "end",
              color: "#1e40af",
              font: { weight: "bold", size: 12 },
              formatter: (val) => val.toLocaleString(),
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => val.toLocaleString(),
              },
            },
          },
        }}
        height={300}
      />
    ) : (
      <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
    )}
  </div>
</div>


      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        .glass-card {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.3);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
