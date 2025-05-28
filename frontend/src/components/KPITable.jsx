import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { buildColumnsWithFooter } from "../utils/buildColumnsWithFooter";
import { preprocessTeleMedData } from "../utils/preprocessTeleMedData";
export default function KPITable({ type, data }) {

/*------------------------------Case พิเศษ จะเข้าก็ต่อเมื่อ type == "tele_med" --------------------------------------------------*/
 const teleMedResult = React.useMemo(() => {
  if (type === "tele_med" && data && data.length > 0) {
    return preprocessTeleMedData(data);
  }
  return null;
}, [data, type]);


/*----------------------------------------------------------------*/


  const columns = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    if (type === "tele_med" && teleMedResult) {
      return teleMedResult.columns;
    }

    return buildColumnsWithFooter(data);
  }, [data, type, teleMedResult]);
/*----------------------------------------------------------------*/
const table = useReactTable({
  data: type === "tele_med" && teleMedResult ? teleMedResult.data : data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});




/*----------------------------------------------------------------*/

  return (
    <div className="p-4">
<h1 className="rounded-2xl border border-green-400 bg-white p-6 text-xl text-gray-800 shadow-sm">
  <span className="block text-sm text-green-600 font-semibold uppercase tracking-wide mb-1">หน่วยบริการที่มีบริการการแพทย์ทางไกล</span>
  <span className="block text-lg font-bold">จังหวัดพะเยา ปีงบประมาณ 2568 {type}</span>
</h1>


  <table className="min-w-full table-auto border mt-4">
    <thead>
      {table.getHeaderGroups().map((headerGroup, ) => (
        <tr key={headerGroup.id} className="bg-emerald-500 text-white text-sm">
          {headerGroup.headers.map((header) => (
            <th key={header.id}  className="border px-4 py-3 text-base text-left font-semibold whitespace-nowrap">
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>

<tbody>
  {table.getRowModel().rows.map((row) => (
    <tr key={row.id} className="hover:bg-green-100">
      {row.getVisibleCells().map((cell, cellIndex) => (
        <td
          key={cell.id}
          className={`border px-4 py-3 align-middle ${
            cellIndex === 0 ? 'text-left' : 'text-center'
          }`}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  ))}
  
</tbody>
<tfoot>
  {table.getFooterGroups().map(footerGroup => (
    <tr key={footerGroup.id} className="bg-gray-50 font-semibold text-sm">
      {footerGroup.headers.map(header => (
        <td key={header.id} className="border px-4 py-2 text-center">
          {flexRender(header.column.columnDef.footer, header.getContext())}
        </td>
      ))}
    </tr>
  ))}
</tfoot>


  </table>
</div>

  );
}
