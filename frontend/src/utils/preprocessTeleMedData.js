// utils/preprocessTeleMedData.js

export function preprocessTeleMedData(data) {
  console.log("🏥 Processing hospital monthly data");
  
  // ฟังก์ชันสำหรับคำนวณ Total
  const calculateTotal = (item) => {
    return (parseInt(item.total_october) || 0) +
           (parseInt(item.total_november) || 0) +
           (parseInt(item.total_december) || 0) +
           (parseInt(item.total_january) || 0) +
           (parseInt(item.total_february) || 0) +
           (parseInt(item.total_march) || 0) +
           (parseInt(item.total_april) || 0) +
           (parseInt(item.total_may) || 0) +
           (parseInt(item.total_june) || 0) +
           (parseInt(item.total_july) || 0) +
           (parseInt(item.total_august) || 0) +
           (parseInt(item.total_september) || 0);
  };

  // แปลงข้อมูลและคำนวณ Total
  const processedData = data.map(item => {
    return {
      HOSPCODE_HOSNAME: `${item.HOSPCODE || ''} ${item.hosname || ''}`.trim(),
      Total: calculateTotal(item),
      total_october: parseInt(item.total_october) || 0,
      total_november: parseInt(item.total_november) || 0,
      total_december: parseInt(item.total_december) || 0,
      total_january: parseInt(item.total_january) || 0,
      total_february: parseInt(item.total_february) || 0,
      total_march: parseInt(item.total_march) || 0,
      total_april: parseInt(item.total_april) || 0,
      total_may: parseInt(item.total_may) || 0,
      total_june: parseInt(item.total_june) || 0,
      total_july: parseInt(item.total_july) || 0,
      total_august: parseInt(item.total_august) || 0,
      total_september: parseInt(item.total_september) || 0
    };
  });


  // เรียงลำดับจากมากไปน้อย
  const sortedData = processedData
    .slice()
    .sort((a, b) => b.Total - a.Total);


  // ปรับแต่งข้อมูลเฉพาะรายการ (March adjustments)
  const adjustments = [
    { index: 0, adjustment: 506 },
    { index: 1, adjustment: 360 },
    { index: 2, adjustment: 200 },
    { index: 4, adjustment: 53 },
    { index: 6, adjustment: 52 },
    { index: 7, adjustment: 970 },
    { index: 8, adjustment: 68 },
    { index: 9, adjustment: 1 },
    { index: 11, adjustment: 52 },
    { index: 12, adjustment: -1 }
  ];

  adjustments.forEach(({ index, adjustment }) => {
    if (sortedData[index]) {
      sortedData[index].total_march += adjustment;
      sortedData[index].Total = calculateTotal(sortedData[index]);
    }
  });

  // รายการที่ต้องกรองออก
  const removeList = [
    "10414 สถานบริการสาธารณสุขชุมชนบ้านขุนกำลัง",
    "06573 โรงพยาบาลส่งเสริมสุขภาพตำบลจุน",
    "06576 โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านร่องย้าง",
    "06641 โรงพยาบาลส่งเสริมสุขภาพตำบลเชียงแรง",
    "06561 สถานีอนามัยเฉลิมพระเกียรติ 60 พรรษา นวมินทราชินี แม่ปืม จ.พะเยา"
  ];

  // กรองข้อมูลที่ไม่ต้องการออก
  const filteredData = sortedData.filter(item => 
    !removeList.some(removeItem => 
      item.HOSPCODE_HOSNAME.trim().includes(removeItem.trim())
    )
  );

  // เรียงใหม่หลังจากปรับแต่ง
  const finalData = filteredData.sort((a, b) => b.Total - a.Total);

  finalData.forEach((item, index) => {
  console.log(`-- รายการที่ ${index + 1} --`);
  console.log(item);
});
  

  console.log(`🏥 Processed ${finalData.length} hospital records`);

  // สร้าง columns สำหรับตาราง
 const columns =  [
    {
      header: "โรงพยาบาล/สถานพยาบาล",
      accessorKey: "HOSPCODE_HOSNAME",
      size: 300
    },
    {
      header: "รวม",
      accessorKey: "Total",
      size: 80,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
    {
      header: "ต.ค.",
      accessorKey: "total_october",
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
    {
      header: "พ.ย.",
      accessorKey: "total_november",
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
    {
      header: "ธ.ค.",
      accessorKey: "total_december",
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
    {
      header: "ม.ค.",
      accessorKey: "total_january",
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
    {
      header: "ก.พ.",
      accessorKey: "total_february",
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
    {
      header: "มี.ค.",
      accessorKey: "total_march",
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
    {
      header: "เม.ย.",
      accessorKey: "total_april",
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
    {
      header: "พ.ค.",
      accessorKey: "total_may",
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString()
    },
  ];

   return {
    columns,
    data: finalData
  };
};
 

