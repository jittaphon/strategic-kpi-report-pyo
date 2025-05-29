import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function KPIChart({
  title,
  labels,
  values,
  color = 'rgba(75,192,192,0.6)',
  customOptions = {},
}) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false, // 👈 เพิ่มบรรทัดนี้
    plugins: {
      legend: { display: false },
      title: { display: true, text: title },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: 'black',
        font: {
          weight: 'bold',
          size: 14,
          family: 'Arial',
          style: 'italic',
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'หน่วยบริการ' },
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'จำนวนบริการ การแพทย์ทางไกล ต่อครั้ง' },
      },
    },
  };

  // 🧠 Deep Merge แบบง่าย (merge เฉพาะ plugins และ scales)
  const mergedOptions = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      ...customOptions.plugins,
      datalabels: {
        ...defaultOptions.plugins.datalabels,
        ...customOptions.plugins?.datalabels,
      },
    },
    scales: {
      ...defaultOptions.scales,
      ...customOptions.scales,
      x: {
        ...defaultOptions.scales.x,
        ...customOptions.scales?.x,
      },
      y: {
        ...defaultOptions.scales.y,
        ...customOptions.scales?.y,
      },
    },
  };

  return (
    <div className="h-[600px] mx-auto">
      <Bar data={data} options={mergedOptions} plugins={[ChartDataLabels]} />
    </div>
  );
}
