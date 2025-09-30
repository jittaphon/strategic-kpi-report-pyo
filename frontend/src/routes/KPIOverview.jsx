// KPIOverview.jsx
import { useParams } from '@tanstack/react-router'; // เปลี่ยนจาก react-router-dom
import KPITeleMed from '../View/KPITeleMed';
import KPINcdRegistry from '../View/KPINcdRegistry';
import React from 'react';

export default function KPIOverview() {
  const { type } = useParams({ from: '/kpi/$type' });
  
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
        return <div>🚑 Emergency Service (Coming Soon)</div>;
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
    <div className=" ">
      {renderContent()}
    </div>
  );
}