import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../api';

export default function KPITeleMedV2() {
  const [year, setYear] = useState("2025");     // ค่าเริ่มต้น = ปีงบ 2568
  const [baseData, setBaseData] = useState([]); // ข้อมูลรายเดือนจาก Base API

  const fetchAllData = async (fiscalYear) => {
    try {
      const baseRes = await API.tele_med.getAppointmentsV2(fiscalYear);

      if (baseRes.data && baseRes.data.data) {
        setBaseData(baseRes.data.data);
      } else {
        throw new Error("Base API return format invalid");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // ดึงข้อมูลทุกครั้งที่ year เปลี่ยน
  useEffect(() => {
    fetchAllData(year);
  }, [year]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">KPI TeleMed V2</h1>

      {/* Select year */}
      <div className="mb-4">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded-lg p-2 text-lg"
        >
          <option value="2026">ปีงบ 2569</option>
          <option value="2025">ปีงบ 2568</option>
        </select>
      </div>

      {/* แสดงผลข้อมูลที่ดึงมา */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">ผลลัพธ์จาก API</h2>
        <pre className="text-sm bg-gray-100 p-3 rounded-lg overflow-x-auto">
{JSON.stringify(baseData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
