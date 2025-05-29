import React, { useEffect, useState } from 'react';
import { API } from '../api';
import KPITable from '../components/KPITable';
import { getTableConfig } from '../utils/getTableConfig';
export default function KPITeleMed() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.ncd_registry.getAppointments().then(res => setRawData(res.data.data)).finally(() => setLoading(false));
  }, []);

  const { data, columns } = getTableConfig('ncd_registry',rawData);



  if (loading) return <div>🔄 กำลังโหลดข้อมูล...</div>;

  return (
    <KPITable
      data={data}
      columns={columns}
      renderHeader={() => (
        <h1 className="rounded-2xl border border-green-400 bg-white p-6 text-xl text-gray-800 shadow-sm">
          <span className="block text-sm text-green-600 font-semibold uppercase tracking-wide mb-1">
             ผลการดำเนินงาน NCD Registry จ.พะเยา
          </span>
          <span className="block text-lg font-bold">จังหวัดพะเยา ปีงบประมาณ 2568</span>
        </h1>
      )}
    />
  );
}
