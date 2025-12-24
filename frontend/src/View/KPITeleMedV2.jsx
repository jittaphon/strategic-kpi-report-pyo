import React, { useEffect, useState } from 'react';
import { API } from '../api';

import { Button, Modal, Select } from "antd";

import Table from '../components/Table';
import Chart from '../components/Chart';

export default function KPITeleMedV2() {
  const [year, setYear] = useState("2026");
  const [baseData, setBaseData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [hospital, setHospital] = useState('');

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

   useEffect(() => {
    FetchClinicData(hospital, year);
  }, [hospital]);


  const FetchClinicData = async (hospcode, fiscalYear) => {
    setLoading(true);
    try {
      const clinicRes = await API.tele_med.getClinics(hospcode, fiscalYear);

      if (clinicRes.data?.data) {
        setClinicData(clinicRes.data.data);
      } else {
        throw new Error("Invalid Base API response");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setClinicData([]);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER CARD */}
        <div
          className="p-4 md:p-5 rounded-2xl border border-blue-400 text-gray-800 bg-cover bg-center mb-4"
          style={{
            backgroundImage: `url('https://pyo.moph.go.th/datahub/pyo-kpi/public/images/periods.png')`,
          }}
        >
          <div className="relative z-10 p-4">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1.5 flex items-center gap-3">
              หน่วยบริการที่มีบริการการแพทย์ทางไกล จังหวัดพะเยา
            </h1>

            <p className="text-[10px] font-bold md:text-base text-red-500 mt-1">
              หมายเหตุ : ข้อมูลจะประมวลผลทุกวันที่ 15 และ 30 ของแต่ละเดือน
            </p>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-200/50 p-4 md:p-5 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/30" />
            <h3 className="text-sm md:text-base font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
              ตัวกรอง
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium text-xs md:text-sm">
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

            <Button
              onClick={() => {
                setOpen(true);
                setHospital(null);
              }}
              className="
                bg-gradient-to-r from-blue-600 to-cyan-600
                text-white
                border-0
                rounded-xl
                px-4
                shadow-md
                hover:opacity-90
                transition-all
              "
            >
              เลือกดูคลินิกในแต่ละโรงพยาบาล
            </Button>
          </div>
        </div>

        {/* TABLE AND CHART SECTIONS */}
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

      {/* MODAL */}
     // แทนที่ส่วน Modal ในโค้ดเดิมของคุณด้วยโค้ดนี้

<Modal
  open={open}
  onCancel={() => {
    setOpen(false);
    setHospital(null);
  }}
  footer={null}
  width={1000}
  centered
  className="modern-modal"
  closeIcon={
    <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
      <span className="text-gray-600 text-lg">×</span>
    </div>
  }
>
  <div className="p-6">
    {/* Modal Header */}
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        
        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm shadow-lg">
          ปีงบประมาณ {year === "2026" ? "2569" : "2568"}
        </div>
      </div>
     
    </div>

    {/* Hospital Select */}
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          โรงพยาบาล
        </label>
        <Select
          placeholder="เลือกโรงพยาบาล"
          value={hospital}
          onChange={setHospital}
          style={{ width: '100%' }}
          size="large"
          className="modern-select"
          suffixIcon={
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          }
        >
          <Select.Option value="10717">10717 โรงพยาบาลพะเยา</Select.Option>
          <Select.Option value="10718">10718 โรงพยาบาลเชียงคำ</Select.Option>
          <Select.Option value="11184">11184 โรงพยาบาลจุน</Select.Option>
          <Select.Option value="11185">11185 โรงพยาบาลเชียงม่วน</Select.Option>
          <Select.Option value="11186">11186 โรงพยาบาลดอกคำใต้</Select.Option>
          <Select.Option value="11187">11187 โรงพยาบาลปง</Select.Option>
          <Select.Option value="11188">11188 โรงพยาบาลเเม่ใจ</Select.Option>
          <Select.Option value="40744">40744 โรงพยาบาลภูซาง</Select.Option>
          <Select.Option value="40745">40745 โรงพยาบาลภูกามยาว</Select.Option>
        </Select>
      </div>

      {/* Clinic Data Display */}
      {hospital && clinicData.length > 0 && (
        <div className="mt-6 space-y-4 animate-fadeIn">
         
{/* Clinic Table */}
<div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3">
    <h4 className="text-white font-semibold text-sm">รายการคลินิกการแพทย์ทางไกล</h4>
  </div>
  
  {loading ? (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
        <p className="text-gray-600 text-sm">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  ) : clinicData.length === 0 ? (
    <div className="text-center py-12 text-gray-500">
      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-sm font-medium">ยังไม่มีข้อมูลคลินิก</p>
    </div>
  ) : clinicData.filter(item => item.clinic_name).length > 0 ? (
    <div className="divide-y divide-gray-100">
      {clinicData
        .filter(item => item.clinic_name)
        .map((clinic, index) => (
          <div 
            key={index} 
            className="px-5 py-1.5 hover:bg-blue-50/50 transition-colors flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-gray-400 text-sm font-medium flex-shrink-0 w-8">
                {index + 1}.
              </span>
              <span className="text-sm text-gray-800 truncate">
                {clinic.clinic_name}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 flex-shrink-0">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs font-medium text-green-700">เปิด</span>
            </span>
          </div>
        ))}
    </div>
  ) : (
    <div className="text-center py-12 text-gray-500">
      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-sm">ไม่พบข้อมูลคลินิก</p>
    </div>
  )}
</div>

          {/* Summary Stats - Hidden for now */}
          {/* 
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-90 mb-1">จำนวนคลินิก</div>
              <div className="text-2xl font-bold">
                {clinicData.filter(item => item.clinic_name).length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-90 mb-1">ผู้ป่วยทั้งหมด</div>
              <div className="text-2xl font-bold">
                {clinicData.reduce((sum, item) => sum + (item.total_visit || 0), 0)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-90 mb-1">เฉลี่ย/คลินิก</div>
              <div className="text-2xl font-bold">
                {clinicData.filter(item => item.clinic_name).length > 0 
                  ? Math.round(clinicData.reduce((sum, item) => sum + (item.total_visit || 0), 0) / clinicData.filter(item => item.clinic_name).length)
                  : 0}
              </div>
            </div>
          </div>
          */}
        </div>
      )}

      {/* Loading State */}
      {hospital && loading && (
        <div className="mt-6 flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            <p className="text-gray-600 text-sm">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      )}

      {/* No Hospital Selected */}
      {!hospital && (
        <div className="mt-6 text-center py-12 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p>กรุณาเลือกโรงพยาบาลเพื่อดูข้อมูลคลินิก</p>
        </div>
      )}
    </div>
  </div>
</Modal>

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

        .modern-modal :global(.ant-modal-content) {
          border-radius: 24px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }

        .modern-modal :global(.ant-modal-header) {
          border: none !important;
          padding: 0 !important;
          background: transparent !important;
        }

        .modern-modal :global(.ant-modal-body) {
          padding: 0 !important;
        }

        .modern-select :global(.ant-select-selector) {
          border-radius: 12px !important;
          border: 2px solid #e5e7eb !important;
          height: 48px !important;
          transition: all 0.3s ease !important;
        }

        .modern-select :global(.ant-select-selector:hover) {
          border-color: #3b82f6 !important;
        }

        .modern-select :global(.ant-select-selector:focus),
        .modern-select :global(.ant-select-focused .ant-select-selector) {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}