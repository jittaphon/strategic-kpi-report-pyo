// src/pages/KPITeleMed.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../api'; // สมมติว่านี่คือ API ที่ใช้ดึงข้อมูลจาก Base ของคุณ
// import axios from 'axios'; // ถ้าคุณใช้ axios ในการ fetch API กระทรวง
import KPITable from '../components/KPITable';
import KPIChart from '../components/KPIChart';
import { getTableConfig } from '../utils/getTableConfig'; // Import getTableConfig ตัวกลางของเรา

export default function KPITeleMed() {
  const [baseData, setBaseData] = useState([]); // ข้อมูลรายเดือนจาก Base ของคุณ (total_october, ..., total_march เดิม)
  const [apiTotalsData, setApiTotalsData] = useState([]); // ข้อมูล Total จาก API กระทรวง
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [date,setDate] = useState('');
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- 1. ดึงข้อมูลรายเดือนจาก Base ของคุณ ---
        const baseRes = await API.tele_med.getAppointments();
        if (baseRes.data && baseRes.data.data) {
          setBaseData(baseRes.data.data);
        } else {
          throw new Error("รูปแบบข้อมูลจาก Base API ไม่ถูกต้อง");
        }

        // --- 2. ดึงข้อมูล Total จาก API กระทรวงสาธารณสุข ---
            const apiUrl = "https://api-hdc.moph.go.th/v1/reports/province/data/2d85d6ec39840f8051854b028fa13073?table_display=provider&year=2568&month=ALL&zone=01&province_code=56&district_code=ALL&subdistrict_code=ALL&department_code=ALL&organization_type=ALL&ministry=ALL&hospital=ALL&service_plan=ALL&jurisdiction_code=ALL&freeze_month=ALL";
            const apiResponse = await axios.get(apiUrl, {
              headers: {
                'Content-Type': 'application/json', // อาจจะจำเป็นหรือไม่ก็ได้
                'domain': 'pyo', // <-- นี่คือ Header ที่คุณต้องเพิ่ม (สมมติว่าเป็นชื่อนี้)
                // หรืออาจจะเป็น 'Referer': 'https://pyo.moph.go.th'
              }
            });
            const apiRawData = apiResponse.data;
  
        // --- 3. แปลง (Map) ข้อมูล Total จาก API กระทรวง ให้มีรูปแบบ HOSPCODE_HOSNAME เหมือน Base ของคุณ ---
        const mappedApiTotals = apiRawData.rows[0].data
          .filter(item => item.result !== null) // กรองเฉพาะรายการที่มีค่า Total
          .map(item => {
            // item.a_name มาในรูปแบบ "06554:โรงพยาบาลส่งเสริมสุขภาพตำบลดงเจน"
            const [a_code, a_name_only] = item.a_name.split(':'); // แยก code กับชื่อ
            return {
              HOSPCODE_HOSNAME: `${a_code.trim()} ${a_name_only.trim()}`, // สร้างรูปแบบ "รหัส ชื่อโรงพยาบาล"
              Total: parseInt(item.result) || 0, // แปลง result เป็นตัวเลข (ใช้ 0 ถ้าเป็น null/NaN)
            };
          });

    
        
        setApiTotalsData(mappedApiTotals); // เก็บข้อมูล Total ที่แปลงแล้ว
        setDate(apiRawData.rows[0].datecom)
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงหรือประมวลผลข้อมูล:", err);
        setError("ไม่สามารถโหลดหรือประมวลผลข้อมูลได้: " + err.message);
      } finally {
        setLoading(false); // ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด ให้หยุด Loading
      }
    };

    fetchAllData(); // เรียกฟังก์ชันดึงข้อมูลเมื่อ Component โหลดครั้งแรก
  }, []); // Dependency array ว่างเปล่า = รันครั้งเดียวตอน Component โหลด

  // --- ประมวลผลข้อมูลโดยเรียก getTableConfig ---
  // จะเรียก getTableConfig ก็ต่อเมื่อข้อมูลทั้ง baseData และ apiTotalsData ถูกโหลดมาแล้ว
  const { data, columns } = (baseData.length > 0 && apiTotalsData.length > 0)
    ? getTableConfig('tele_med', baseData, apiTotalsData) // ส่งทั้ง baseData และ apiTotalsData เข้าไป
    : { data: [], columns: [] }; // ถ้ายังโหลดไม่เสร็จ ก็ให้เป็น Array ว่างไปก่อน

  // --- ส่วนแสดงผลตามสถานะ Loading/Error/Data ---
  if (loading) return <div>🔄 กำลังโหลดข้อมูล...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>⚠️ เกิดข้อผิดพลาด: {error}</div>;
  if (data.length === 0) return <div>ไม่พบข้อมูลที่ตรงกัน หรือยังไม่มีข้อมูล</div>; // กรณีไม่มีข้อมูลที่ตรงกันเลย

  return (
    <>
      {/* KPITable Component ของคุณ */}
      <KPITable
        data={data}
        columns={columns}
         renderHeader={() => (
        <div
          className="p-6 rounded-2xl border border-green-400 text-xl text-gray-800 bg-cover bg-center rounded-2xl"
          style={{
            backgroundImage: `url('https://pyo.moph.go.th/datahub/strategic-kpi-report-pyo/public/images/periods.png')`,
          }}
        >
          <div className="rounded-xl p-4">
            <span className="block text-sm text-green-600 font-semibold uppercase tracking-wide mb-1">
              หน่วยบริการที่มีบริการการแพทย์ทางไกล
            </span>
            <span className="block text-lg font-bold">
              จังหวัดพะเยา ปีงบประมาณ 2568
            </span>
            {/* หมายเหตุเดิมที่ระบุว่าไม่สามารถแสดงผลแยกรายเดือนได้ */}
            <span className="block text-sm text-red-600 font-semibold uppercase tracking-wide mt-1">
              หมายเหตุ : ผลงานตั้งแต่เดือนมีนาคมเป็นต้นไป ไม่สามารถแสดงผลแยกรายเดือน เนื่องจากไม่สามารถเชื่อมต่อฐานข้อมูล HDC ได้
            </span>
            {/* แสดงวันที่ประมวลผลจาก API หากมี */}
            {date && ( // <-- เช็คว่ามีค่า date ก่อนแสดง
              <span className="block text-sm text-red-600 font-semibold uppercase tracking-wide mt-1">
                ข้อมูลประมวลผลเมื่อวันที่ {date}
              </span>
            )}
          </div>
        </div>
      )}
      />

      {/* KPIChart Component ของคุณ */}
      <KPIChart
        title=""
        labels={data.map(item => item.HOSPCODE_HOSNAME)}
        values={data.map(item => item.Total)}
        customOptions={{
          scales: {
            x: { title: { display: true, text: 'โรงพยาบาล' } },
            y: { title: { display: true, text: 'จำนวนบริการ การแพทย์ทางไกล (ครั้ง)' } },
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