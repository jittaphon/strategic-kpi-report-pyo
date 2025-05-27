import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { preprocessTeleMedData } from "../utils/preprocessTeleMedData";
export default function KPITable({ type, data }) {

/*----------------------------------------------------------------*/
 const teleMedResult = React.useMemo(() => {
  if (type === "tele_med" && data && data.length > 0) {
    return preprocessTeleMedData(data);
  }
  return null;
}, [data, type]);
/*----------------------------------------------------------------*/



const columns = React.useMemo(() => {
  if (!data || data.length === 0 || !data[0]) return [];

  console.log("✅ คำนวณ columns ใหม่");

  if (type === "tele_med" && teleMedResult) {
    return teleMedResult.columns;
  }

  return Object.keys(data[0]).map((key) => ({
    header: key,
    accessorKey: key,
  }));
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
      <h1 className="bg-blue-100 p-4 text-xl text-black">ประเภท: {type}</h1>

      <table className="min-w-full table-auto border mt-4">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
