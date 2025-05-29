export function buildColumnsWithFooter(data) {



  if (!data || data.length === 0) return [];

  const columns = Object.keys(data[0]).map((key) => {
    const isNumericColumn = data.every((row) => !isNaN(Number(row[key])));

    const getFooter = (info) => {
      if (!isNumericColumn) return "รวมทั้งหมด";
      
      const total = info.table.getRowModel().rows.reduce((sum, row) => sum + (Number(row.getValue(key)) || 0), 0);
      console.log(total); // Debugging line

      return total.toLocaleString();
    };

    return {
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue(),
      footer: getFooter,
    };
  });

  return columns;
}
