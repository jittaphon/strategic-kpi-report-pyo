import React, { useEffect, useState } from 'react';
import { API } from '../api';
import KPITable from '../components/KPITable';
import  NcdInputButtonForm  from '../components/NcdInputButtonForm';
import { getTableConfig } from '../utils/getTableConfig';
export default function KPITeleMed() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
const fetchAppointments = async () => {
  setLoading(true);
  try {
    const res = await API.ncd_registry.getAppointments();
    setRawData(res.data.data);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAppointments();
}, []);
  const { data, columns } = getTableConfig('ncd_registry',rawData);



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
    backgroundImage: `url('/images/periods.png')`,
  }}
>
  <div className=" rounded-xl p-4">
    <span className="block text-sm text-green-600 font-semibold uppercase tracking-wide mb-1">
      ผลการดำเนินงาน NCD Registry จ.พะเยา
    </span>
    <span className="block text-lg font-bold">
      จังหวัดพะเยา ปีงบประมาณ 2568
    </span>
   
  </div>
   

</div>

      )}
      extraContent={<NcdInputButtonForm onSuccess={fetchAppointments}/>}
    />
    
   </>
 
    
  );
}
