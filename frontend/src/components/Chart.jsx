import React, { useEffect, useRef, useMemo } from "react";
import * as Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
  LineController,
  ChartDataLabels  // เพิ่ม plugin
);

// HOSPCODE ที่ต้องแสดงก่อนเสมอ
const priorityHospCodes = ['10717', '10718', '11185', '11186', '11187', '11188', '40744', '40745'];

// รวมข้อมูลแต่ละโรงพยาบาล
function aggregateData(raw) {
  const map = {};
  
  raw.forEach(row => {
    const hosp = row.HOSPCODE;
    
    if (!map[hosp]) {
      map[hosp] = {
        HOSPCODE: row.HOSPCODE,
        HOSNAME: row.HOSNAME,
        hospitalDisplay: `${row.HOSPCODE} - ${row.HOSNAME}`,
        total: 0
      };
    }
    
    const value = parseInt(row.total_visit, 10) || 0;
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
  { bg: 'rgba(168, 85, 247, 0.8)', border: 'rgb(168, 85, 247)' },
  { bg: 'rgba(244, 63, 94, 0.8)', border: 'rgb(244, 63, 94)' },
  { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgb(34, 197, 94)' },
  { bg: 'rgba(249, 115, 22, 0.8)', border: 'rgb(249, 115, 22)' },
];

export default function HospitalChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const mappedData = useMemo(() => {
    if (!data) return [];
    const aggregated = aggregateData(data);
    
    // เรียงลำดับ: priority hospitals ก่อน, แล้วเรียงตาม total
    return aggregated.sort((a, b) => {
      const aIsPriority = priorityHospCodes.includes(a.HOSPCODE);
      const bIsPriority = priorityHospCodes.includes(b.HOSPCODE);
      
      if (aIsPriority && bIsPriority) {
        return b.total - a.total;
      }
      
      if (aIsPriority) return -1;
      if (bIsPriority) return 1;
      
      return b.total - a.total;
    });
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || mappedData.length === 0) return;

    // ทำลาย chart เก่า
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // เตรียมข้อมูล
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
              size: 13,
              family: "'Inter', sans-serif"
            },
            color: '#1e40af',
            offset: 4
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
              text: "จำนวนบริการแพทย์ทางไกล (ครั้ง)",
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
        },
        layout: {
          padding: {
            top: 30  // เพิ่มพื้นที่ด้านบนให้ตัวเลข
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

  return (
    <div className="w-full">
      <div className="bg-white p-6 rounded-xl shadow-lg" style={{ height: "600px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}