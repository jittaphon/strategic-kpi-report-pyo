export function buildColumnsWithFooter(data) {
  if (!data || data.length === 0) return [];

  return Object.keys(data[0]).map((key) => {
    // ใช้ Number() + isNaN เช็คว่า “รวมได้ไหม”
    const isNumeric = data.every((row) => !isNaN(Number(row[key])));
    console.log(`Is "${key}" numeric? ${isNumeric}`); // Debugging log

    return {
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue(),
      footer: isNumeric
        ? (info) => {
            const total = info.table.getRowModel().rows.reduce(
              (sum, row) => sum + (Number(row.getValue(key)) || 0),
              0
            );
            return total.toLocaleString();
          }
        : () => "รวมทั้งหมด", // หรือไม่ต้องใส่อะไรเลย
    };
  });
}
