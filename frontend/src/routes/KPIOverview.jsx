// KPIOverview.jsx  
import { useParams } from 'react-router-dom';
import KPITeleMed from '../View/KPITeleMed';
import KPINcdRegistry from '../View/KPINcdRegistry';
import React from 'react';

export default function KPIOverview() {

 const { type } = useParams();

  if (!type) {
    return <div>❌ ไม่พบ KPI ที่ระบุ</div>;
  }

  // ตรวจสอบว่า type เป็นค่าใดบ้าง
 switch (type) {
    case 'tele_med': return <KPITeleMed />;
    case 'ncd_registry': return <KPINcdRegistry />;
    //case 'ncd_registry': return <KPINcdRegister />;
    default: return <div>❌ ไม่พบ KPI ที่ระบุ</div>;
  }
}
