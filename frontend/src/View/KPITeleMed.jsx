import React, { useEffect, useState } from 'react';
import { API } from '../api';
import KPITable from '../components/KPITable';
import KPIChart from '../components/KPIChart';
import { getTableConfig } from '../utils/getTableConfig';

export default function KPITeleMed() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.tele_med.getAppointments().then(res => setRawData(res.data.data)).finally(() => setLoading(false));
  }, []);

  const { data, columns } = getTableConfig('tele_med', rawData)
   

  if (loading) return <div>🔄 กำลังโหลดข้อมูล...</div>;

  return (
    <>
    <KPITable
  data={data}
  columns={columns}
  renderHeader={() => (
   <div
  className="p-6 rounded-2xl border border-green-400 text-xl text-gray-800 bg-cover bg-center rounded-2xl"
  style={{
    backgroundImage: `url('https://pyo.moph.go.th/strategic-kpi-report-pyo/public/images/periods.png')`,
  }}
>
  <div className=" rounded-xl p-4">
    <span className="block text-sm text-green-600 font-semibold uppercase tracking-wide mb-1">
      หน่วยบริการที่มีบริการการแพทย์ทางไกล
    </span>
    <span className="block text-lg font-bold">
      จังหวัดพะเยา ปีงบประมาณ 2568
    </span>
    <span className="block text-sm text-red-600 font-semibold uppercase tracking-wide mt-1">
      หมายเหตุ : ผลงานตั้งแต่เดือนมีนาคมเป็นต้นไป ไม่สามารถแสดงผลแยกรายเดือน
      เนื่องจากไม่สามารถเชื่อมต่อฐานข้อมูล HDC ได้
    </span>
  </div>
</div>

  )}
/>


  <KPIChart
  title=""
  labels={data.map(item => item.HOSPCODE_HOSNAME)}
  values={data.map(item => item.Total)}
  customOptions={{
    scales: {
      x: { title: { display: true, text: 'โรงพยาบาล' } },
      y: { title: { display: true, text: 'จำนวนบริการ การเเพทย์ทางไกล ต่อครั้ง' } },
    },
    plugins: {
      datalabels: {
        color: 'blue',
        formatter: val => `${val} ครั้ง`,
      },
    },
  }}
/>

    
    
    
    
    
    </>
   
    
    
  );
}
