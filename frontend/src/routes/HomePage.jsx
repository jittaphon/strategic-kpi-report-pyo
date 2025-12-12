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
  const [fiscalYear, setFiscalYear] = React.useState('2569');
  const [data43, setData43] = useState(0);
  const [currentDate, setCurrentDate] = React.useState(getThaiDate());

  function getThaiDate() {
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.
  
  return `${day} ${month} ${year}`;
}


// ฟังก์ชันแปลงรหัสพื้นที่เป็นชื่ออำเภอ
const getDistrictName = (areaCode) => {
  const districtMap = {
    '5601': 'เมืองพะเยา',
    '5602': 'จุน',
    '5603': 'เชียงคำ',
    '5604': 'เชียงม่วน',
    '5605': 'ดอกคำใต้',
    '5606': 'ปง',
    '5607': 'แม่ใจ',
    '5608': 'ภูซาง',
    '5609': 'ภูคามยาว'
  };
  
  return districtMap[areaCode] || areaCode;
};

useEffect(() => {
  setMounted(true);
  Fetch43FileData(fiscalYear)
}, [fiscalYear])

const groupByAreadcode = (data) => {
  const grouped = {};

  data.forEach((item) => {
    const area = item.areacode.slice(0, 4); // ดึงรหัสอำเภอ เช่น 5601

    if (!grouped[area]) {
      grouped[area] = {
        area,
        sum_result: 0,
        sum_target: 0,
        count: 0,
        hospcodes: []
      };
    }

    grouped[area].sum_result += Number(item.result || 0);
    grouped[area].sum_target += Number(item.target || 0);
    grouped[area].count++;
    grouped[area].hospcodes.push(item.hospcode);
  });

  return Object.values(grouped);
};

const Fetch43FileData = async (yearBE) => {

  try {
    const res = await API.hdccheckAPI.getReportS_OPD({ year: yearBE});

    const summary = groupByAreadcode(res.data.data);


    // นับจำนวนสถานบริการทั้งหมด
    const totalHospitals = summary.reduce((sum, item) => sum + item.count, 0);
    setData43(totalHospitals);

    // สร้างข้อมูลสำหรับ Chart - ใช้ชื่ออำเภอแทนรหัส
    const labels = summary.map(item => getDistrictName(item.area));
    const resultData = summary.map(item => item.sum_result);
    const targetData = summary.map(item => item.sum_target);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'ครั้ง ',
          data: resultData,
          borderColor: 'rgb(59, 130, 246)', // blue-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'คน ',
          data: targetData,
          borderColor: 'rgb(236, 72, 153)', // pink-500
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgb(236, 72, 153)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }
      ]
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
               <p className="font-semibold text-gray-800">{currentDate}</p>
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
        สถานบริการ ในจังหวัดทั้งหมด
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
      อัตราการใช้บริการผู้ป่วยนอก ทุกสิทธิ (ครั้งต่อคนต่อปี)
    </h2>
<Select
  value={fiscalYear}
  onChange={setFiscalYear}
  size="large"
  style={{
    width: 160,
    height: 56,
  }}
>
  <Select.Option value="2569">ปีงบ 2569</Select.Option>
  <Select.Option value="2568">ปีงบ 2568</Select.Option>
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

   
    </div>
  );
};

export default HomePage;
