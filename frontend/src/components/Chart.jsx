import React, { useEffect, useRef, useState, useMemo } from "react";
import * as Chart from "chart.js";

// Register Chart.js components
const { Chart: ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, BarController, LineController } = Chart;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);

// ชื่อเดือนแบบปีงบไทย
const monthNames = {
  "10": "ต.ค.",
  "11": "พ.ย.",
  "12": "ธ.ค.",
  "01": "ม.ค.",
  "02": "ก.พ.",
  "03": "มี.ค.",
  "04": "เม.ย.",
  "05": "พ.ค.",
  "06": "มิ.ย.",
  "07": "ก.ค.",
  "08": "ส.ค.",
  "09": "ก.ย.",
};

// ลำดับเรียงตามปีงบ
const fiscalOrder = [
  "ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.",
  "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."
];

// PIVOT: แปลงแถวละเดือน → แถวเดียวรวมทั้งปี
function pivotData(raw) {
  const map = {};
  raw.forEach(row => {
    const hosp = row.HOSPCODE;
    const month = row.month.padStart(2, "0");
    const mName = monthNames[month];
    
    if (!map[hosp]) {
      map[hosp] = {
        HOSPCODE: row.HOSPCODE,
        HOSNAME: row.HOSNAME,
        hospitalDisplay: `${row.HOSPCODE} - ${row.HOSNAME}`,
        months: {},
        total: 0
      };
    }
    
    const value = parseInt(String(row.cnt).trim(), 10) || 0;
    map[hosp].months[mName] = value;
    map[hosp].total += value;
  });
  
  return Object.values(map);
}

// สีสำหรับแต่ละโรงพยาบาล
const colors = [
  { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' },
  { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgb(16, 185, 129)' },
  { bg: 'rgba(251, 146, 60, 0.8)', border: 'rgb(251, 146, 60)' },
  { bg: 'rgba(236, 72, 153, 0.8)', border: 'rgb(236, 72, 153)' },
  { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgb(139, 92, 246)' },
  { bg: 'rgba(234, 179, 8, 0.8)', border: 'rgb(234, 179, 8)' },
  { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' },
  { bg: 'rgba(6, 182, 212, 0.8)', border: 'rgb(6, 182, 212)' },
];

export default function HospitalChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const mappedData = useMemo(() => {
    if (!data) return [];
    const pivoted = pivotData(data);
    // เรียงจากมากไปน้อย
    return pivoted.sort((a, b) => b.total - a.total);
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || mappedData.length === 0) return;

    // ทำลาย chart เก่า
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // เตรียมข้อมูล: แสดงเฉพาะ total ของแต่ละโรงพยาบาล
    const labels = mappedData.map(h => h.hospitalDisplay);
    const totals = mappedData.map(h => h.total);
    const backgroundColors = mappedData.map((_, idx) => colors[idx % colors.length].bg);
    const borderColors = mappedData.map((_, idx) => colors[idx % colors.length].border);

    chartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'จำนวนให้บริการทั้งหมด',
          data: totals,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "จำนวนการให้บริการทั้งหมดแยกตามโรงพยาบาล/สถานพยาบาล",
            font: {
              size: 20,
              weight: "bold",
              family: "'Inter', sans-serif"
            },
            padding: 25,
            color: '#1e40af'
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            titleFont: {
              size: 14,
              family: "'Inter', sans-serif"
            },
            bodyFont: {
              size: 14,
              family: "'Inter', sans-serif"
            },
            padding: 15,
            callbacks: {
              label: function(context) {
                return `ทั้งหมด: ${context.parsed.y.toLocaleString()} ครั้ง`;
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (value) => value.toLocaleString(),
            font: {
              weight: 'bold',
              size: 12
            },
            color: '#1e40af'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString();
              },
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: "จำนวนบริการเเพทย์ทางไกล (ครั้ง)",
              font: {
                size: 14,
                weight: "bold"
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              },
              maxRotation: 45,
              minRotation: 45
            },
            title: {
              display: true,
              text: "โรงพยาบาล/สถานพยาบาล",
              font: {
                size: 14,
                weight: "bold"
              }
            },
            grid: {
              display: false
            }
          }
        }
      },
    
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [mappedData]);

  if (!data || mappedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">ไม่มีข้อมูล</p>
        </div>
      </div>
    );
  }

  
  const totalAll = mappedData.reduce((sum, h) => sum + h.total, 0);


  return (
    <div className="w-full">
      {/* Chart */}
      <div className="bg-white p-6" style={{ height: "600px" }}>
        <canvas ref={chartRef}></canvas>
      </div>

      
    </div>
  );
}