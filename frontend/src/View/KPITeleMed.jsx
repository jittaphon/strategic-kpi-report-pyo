// src/pages/KPITeleMed.jsx

import React, { useEffect,useRef, useState } from 'react';
import axios from 'axios';
import { API } from '../api'; // สมมติว่านี่คือ API ที่ใช้ดึงข้อมูลจาก Base ของคุณ
import KPITable from '../components/KPITable';
import KPIChart from '../components/KPIChart';
import { getTableConfig } from '../utils/getTableConfig'; // Import getTableConfig ตัวกลางของเรา
import { TrendingUp, Users, Activity, AlertCircle, FileText, CheckCircle2, Calendar, ArrowUp, ArrowDown, Zap } from 'lucide-react';

export default function KPITeleMed() {
  const [baseData, setBaseData] = useState([]); // ข้อมูลรายเดือนจาก Base ของคุณ (total_october, ..., total_march เดิม)
  const [apiTotalsData, setApiTotalsData] = useState([]); // ข้อมูล Total จาก API กระทรวง

  const [date, setDate] = useState(''); // เก็บวันที่ประมวลผลจาก API กระทรวง

  const [saveStatus, setSaveStatus] = useState(''); // สถานะการบันทึกข้อมูลอัตโนมัติ
  const containerRef = useRef();
  const [mounted, setMounted] = useState(false);


  const fetchAllData = async () => {

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
          'Content-Type': 'application/json',
          'domain': 'pyo',
        }
      });
      const apiRawData = apiResponse.data;

      // --- 3. แปลง (Map) ข้อมูล Total จาก API กระทรวง ให้มีรูปแบบ HOSPCODE_HOSNAME เหมือน Base ของคุณ ---
      const mappedApiTotals = apiRawData.rows[0].data
        .filter(item => item.result !== null)
        .map(item => {
          const [a_code, a_name_only] = item.a_name.split(':');
          return {
            HOSPCODE_HOSNAME: `${a_code.trim()} ${a_name_only.trim()}`,
            Total: parseInt(item.result) || 0,
          };
        });

      setApiTotalsData(mappedApiTotals);
      // *** สำคัญ: ตั้งค่า date ที่นี่ หลังจากดึงข้อมูลจาก API กระทรวงสำเร็จ
      setDate(apiRawData.rows[0].datecom); 

    } catch (err) {
      console.error("Error fetching data:", err);
    }
    
   
  };

  // useEffect สำหรับดึงข้อมูลทั้งหมดเมื่อ Component โหลดครั้งแรก
  useEffect(() => {
    fetchAllData();
     setMounted(true);
  }, []); // Dependency array ว่างเปล่า = รันครั้งเดียวตอน Component โหลด

  // --- useEffect สำหรับบันทึกข้อมูลอัตโนมัติเมื่อ 'date' ถูกกำหนดค่า ---
 useEffect(() => {
    if (baseData.length > 0 && apiTotalsData.length > 0 && date) {
      //setSaveStatus('กำลังบันทึกข้อมูลล่าสุดไปยังฐานข้อมูล...');
      const combinedDataForSave = getTableConfig('tele_med', baseData, apiTotalsData, date).data;

      // *** เปลี่ยนเป็นเรียก API.tele_med.postAppointments ตรงนี้ ***
      API.tele_med.postAppointments(combinedDataForSave) // <<< แก้ไขตรงนี้
        .then(res => {
           return res
        })
        .catch(err => {
          console.error("บันทึกข้อมูลอัตโนมัติล้มเหลว:", err.response ? err.response.data : err.message);
          setSaveStatus(`❌ บันทึกข้อมูลอัตโนมัติล้มเหลว: ${err.response && err.response.data ? (err.response.data.error || 'เกิดข้อผิดพลาด') : err.message}`);
        });
    }
  }, [baseData, apiTotalsData, date]); // Dependency array: จะทำงานใหม่เมื่อ baseData, apiTotalsData หรือ date เปลี่ยน

  // --- ประมวลผลข้อมูลโดยเรียก getTableConfig ---
  // จะเรียก getTableConfig ก็ต่อเมื่อข้อมูลทั้ง baseData และ apiTotalsData ถูกโหลดมาแล้ว
  const { data, columns } = (baseData.length > 0 && apiTotalsData.length > 0)
    ? getTableConfig('tele_med', baseData, apiTotalsData, date) // ส่งทั้ง baseData และ apiTotalsData เข้าไป
    : { data: [], columns: [] }; // ถ้ายังโหลดไม่เสร็จ ก็ให้เป็น Array ว่างไปก่อน

  // --- ส่วนแสดงผลตามสถานะ Loading/Error/Data ---
  
  return (
      <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full px-6 py-8">
        {/* Header Section */}
        <div 
          className={`mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              
            </div>
          </div>

      {/* สถานะการบันทึกอัตโนมัติ */}
      {saveStatus && (
        <div className={`p-3 mb-4 rounded-md ${saveStatus.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {saveStatus}
        </div>
      )}

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
              <span className="block text-sm text-red-600 font-semibold uppercase tracking-wide mt-1">
                หมายเหตุ : ผลงานตั้งแต่เดือนมีนาคมเป็นต้นไป ไม่สามารถแสดงผลแยกรายเดือน เนื่องจากไม่สามารถเชื่อมต่อฐานข้อมูล HDC ได้
              </span>
              {date && (
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

        </div>

         
  
    

      
      </div>

  
    </div>
  );
};
  
