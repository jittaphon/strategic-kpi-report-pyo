// utils/preprocessTeleMedData.js

export function preprocessTeleMedData(data) {
  const calculateTotal = (item) => {
    return (
      (parseInt(item.total_october) || 0) +
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
      (parseInt(item.total_september) || 0)
    );
  };

  const processedData = data.map((item) => ({
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
    total_september: parseInt(item.total_september) || 0,
  }));

  const sortedData = processedData.slice().sort((a, b) => b.Total - a.Total);

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
    { index: 12, adjustment: -1 },
  ];

  adjustments.forEach(({ index, adjustment }) => {
    if (sortedData[index]) {
      sortedData[index].total_march += adjustment;
      sortedData[index].Total = calculateTotal(sortedData[index]);
    }
  });

  const removeList = [
    "10414 สถานบริการสาธารณสุขชุมชนบ้านขุนกำลัง",
    "06573 โรงพยาบาลส่งเสริมสุขภาพตำบลจุน",
    "06576 โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านร่องย้าง",
    "06641 โรงพยาบาลส่งเสริมสุขภาพตำบลเชียงแรง",
    "06561 สถานีอนามัยเฉลิมพระเกียรติ 60 พรรษา นวมินทราชินี แม่ปืม จ.พะเยา",
  ];

  const filteredData = sortedData.filter(
    (item) =>
      !removeList.some((removeItem) =>
        item.HOSPCODE_HOSNAME.trim().includes(removeItem.trim())
      )
  );

  const finalData = filteredData.sort((a, b) => b.Total - a.Total);

  const numericKeys = [
    "Total",
    "total_october",
    "total_november",
    "total_december",
    "total_january",
    "total_february",
    "total_march",
  ];

  const columnHeaderMap = {
    Total: "จำนวนให้บริการ (ครั้ง)",
    total_october: "ต.ค. 2567",
    total_november: "พ.ย. 2567",
    total_december: "ธ.ค. 2567",
    total_january: "ม.ค. 2568",
    total_february: "ก.พ. 2568",
    total_march: "มี.ค. - พ.ค.",
  };

  const columns = [
    {
      header: "โรงพยาบาล/สถานพยาบาล",
      accessorKey: "HOSPCODE_HOSNAME",
      size: 300,
      footer: () => "รวมทั้งหมด",
    },
    ...numericKeys.map((key) => ({
      header: columnHeaderMap[key] || key,
      accessorKey: key,
      size: 70,
      cell: ({ getValue }) => getValue().toLocaleString(),
      footer: (info) => {
        const total = info.table
          .getRowModel()
          .rows.reduce(
            (sum, row) => sum + (Number(row.getValue(key)) || 0),
            0
          );
        return total.toLocaleString();
      },
    })),
  ];

  return {
    columns,
    data: finalData,
  };
}
