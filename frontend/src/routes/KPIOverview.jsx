// KPIOverview.jsx
import { useParams } from 'react-router-dom'; // เปลี่ยนเป็น react-router-dom
import KPITeleMed from '../View/KPITeleMed';
import KPINcdRegistry from '../View/KPINcdRegistry';
import React from 'react';

export default function KPIOverview() {
  const { type } = useParams(); // ใช้แบบง่ายๆ ไม่ต้องส่ง config
  
  // ฟังก์ชันแยกเพื่อ render content
  const renderContent = () => {
    if (!type) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">❌ ไม่พบ KPI ที่ระบุ</h2>
            <p className="text-gray-500 mt-2">กรุณาเลือก KPI จากเมนู</p>
          </div>
        </div>
      );
    }
    
    switch (type) {
      case 'tele_med': 
        return <KPITeleMed />;
      case 'ncd_registry': 
        return <KPINcdRegistry />;
      case 'emergency': 
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-2xl">
              🚑 Emergency Service (Coming Soon)
            </div>
          </div>
        );
      default: 
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500">❌ ไม่พบ KPI ที่ระบุ</h2>
              <p className="text-gray-500 mt-2">Type: {type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="">
      {renderContent()}
    </div>
  );
}