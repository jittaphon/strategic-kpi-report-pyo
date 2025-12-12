import React, { useEffect, useState } from 'react';
import { API } from '../api';
import { Select } from 'antd';
import Table from '../components/Table';
import Chart from '../components/Chart';
export default function KPITeleMedV2() {
  const [year, setYear] = useState("2026");
  const [baseData, setBaseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async (fiscalYear) => {
    setLoading(true);
    try {
      const baseRes = await API.tele_med.getAppointmentsV2(fiscalYear);

      if (baseRes.data?.data) {
        setBaseData(baseRes.data.data);
      } else {
        throw new Error("Invalid Base API response");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setBaseData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(year);
  }, [year]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 md:p-8">

      <div className="max-w-[1600px] mx-auto">

        {/* HEADER CARD - Compact Design */}
        <div className="p-4 md:p-5 rounded-2xl border border-blue-400 text-gray-800 bg-cover bg-center mb-6"
            style={{
              backgroundImage: `url('https://pyo.moph.go.th/datahub/pyo-kpi/public/images/periods.png')`,
            }}>
<div className="relative z-10 p-4">
  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1.5 flex items-center gap-3">
    หน่วยบริการที่มีบริการการแพทย์ทางไกล จังหวัดพะเยา
  </h1>

  <p className="text-[10px] font-bold  md:text-base text-red-500 mt-1">
    หมายเหตุ : ข้อมูลรายเดือนจะประมวลผลทุกๆ วันที่ 10 ในเดือนถัดไป
  </p>

  <div className="flex items-center gap-2.5 mt-3">
    <span className="text-gray-700 font-semibold text-xs md:text-sm">
      ปีงบประมาณ
    </span>

    <Select
      value={year}
      onChange={setYear}
      size="middle"
      style={{ width: 140 }}
      className="custom-select"
    >
      <Select.Option value="2026">2569</Select.Option>
      <Select.Option value="2025">2568</Select.Option>
    </Select>
  </div>
</div>

        </div>

        {/* TABLE CARD - Liquid Glass Effect */}
       <div className="space-y-8">
  {/* Table Section */}
  <div className="relative z-10">
    {/* Table Header */}
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200/50">
      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/30" />
      <h2 className="text-base md:text-lg font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
        ข้อมูลรายงาน
      </h2>
      {loading && (
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      )}
    </div>

    <Table data={baseData} loading={loading} year={year} />
  </div>

  {/* Chart Section */}
  <div className="relative z-10 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-xl p-6 border border-blue-100/50">
    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-blue-200/50">
      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/30" />
      <h2 className="text-base md:text-lg font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
        กราฟแสดงจำนวนครั้งการให้บริการการแพทย์ทางไกล จำแนกตามหน่วยบริการ
      </h2>
      {loading && (
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      )}
    </div>

    <Chart data={baseData} />
  </div>
</div>
      </div>

      <style jsx>{`
        .custom-select :global(.ant-select-selector) {
          background: rgba(255, 255, 255, 0.6) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1) !important;
        }
        
        .custom-select :global(.ant-select-selector:hover) {
          background: rgba(255, 255, 255, 0.8) !important;
          border-color: rgba(59, 130, 246, 0.4) !important;
        }
      `}</style>
    </div>
  );
}