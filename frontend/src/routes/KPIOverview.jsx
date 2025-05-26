import { useParams } from 'react-router-dom';

import React from "react";
export default function KPIOverview() {
 const { type } = useParams(); // 'tele_med' หรือ 'region'
 console.log("KPI Overview Type:", type); // สำหรับดีบัก

  return (
     <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <h1>ประเภท: {type}</h1>
    </div>
  );
}
