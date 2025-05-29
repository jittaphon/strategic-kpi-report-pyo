import React, { useEffect, useState } from 'react';
import { API } from '../api';
import KPITable from '../components/KPITable';
import { getTableConfig } from '../utils/getTableConfig';

export default function KPITeleMed() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.tele_med.getAppointments().then(res => setRawData(res.data.data)).finally(() => setLoading(false));
  }, []);

  console.log("Raw TeleMed Data:", rawData); // Debugging line

  const { data, columns } = getTableConfig('tele_med', rawData)

  if (loading) return <div>🔄 กำลังโหลดข้อมูล...</div>;

  return (
    <KPITable
      data={data}
      columns={columns}
      renderHeader={() => (
        <h1 className="rounded-2xl border border-green-400 bg-white p-6 text-xl text-gray-800 shadow-sm">
          <span className="block text-sm text-green-600 font-semibold uppercase tracking-wide mb-1">
            หน่วยบริการที่มีบริการการแพทย์ทางไกล
          </span>
          <span className="block text-lg font-bold">จังหวัดพะเยา ปีงบประมาณ 2568</span>
          <span className="block text-sm text-red-600 font-semibold uppercase tracking-wide mt-1">
            หมายเหตุ : ผลงานตั้งเเต่เดือนมีนาคมเป็นต้นไป ไม่สามารถเเสดงผลเเยกรายเดือน เนื่องจากไม่สามารถเชื่อมต่อฐานข้อมูล HDC ได้
          </span>
        </h1>
      )}
    />
  );
}
