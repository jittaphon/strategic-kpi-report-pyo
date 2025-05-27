// KPIOverview.jsx
import { useParams } from 'react-router-dom';
import { API } from '../api';
import KPITable from '../components/KPITable';
import React, { useEffect, useState } from 'react';

export default function KPIOverview() {

  const { type } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    
    if (!type || !API[type]) {
      setError(new Error("ไม่พบประเภท API ที่ระบุ"));
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API[type].getAppointments();
        setData(response.data);
      } catch (err) {
        if (err.name === 'AbortError') {
          // ✅ ปล่อยผ่าน ไม่ต้อง set error ถ้าถูกยกเลิก
        } else {
          console.error('Fetch error:', err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 🔁 Cleanup function: ยกเลิก request เดิมถ้ามีการเปลี่ยน type
    return 

  }, [type]);

  if (loading) return <div className="text-center p-4 text-gray-500">🔄 กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center text-red-500">❌ {error.message}</div>;
  if (data.length === 0) return <div className="text-center text-gray-500 p-4">📭 ไม่พบข้อมูล</div>;

  return <KPITable type={type} data={data.data} />;
}
