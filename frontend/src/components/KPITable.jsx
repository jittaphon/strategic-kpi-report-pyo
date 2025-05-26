import React from "react";

export default function KPITable({type,data}) {

  console.log("KPITable data:", data);

  return (
    <div className="p-4">
      <h1 className="bg-blue-100 p-4 text-xl text-black">ประเภท:{type}</h1>
    </div>
  );
}
