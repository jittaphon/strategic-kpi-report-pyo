import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"; // ใช้ lucide-react

export default function KPITable({ data, columns, renderHeader }) {
  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4">
      {renderHeader && renderHeader()}

      <table className="min-w-full table-auto border mt-4">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-emerald-500 text-white text-sm">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();

                const SortIcon = () => {
                  if (!canSort) return null;
                  if (sortDirection === "asc") return <ChevronUp size={16} className="ml-1" />;
                  if (sortDirection === "desc") return <ChevronDown size={16} className="ml-1" />;
                  return <ChevronsUpDown size={16} className="ml-1 text-white/60" />;
                };

                return (
                  <th
                    key={header.id}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    className={`border px-4 py-3 text-base text-left font-semibold whitespace-nowrap ${
                      canSort ? "cursor-pointer select-none" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon />
                    </div>
                  </th>
                );
              })}
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
                    cellIndex === 0 ? "text-left" : "text-center"
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id} className="bg-gray-50 font-semibold text-sm">
              {footerGroup.headers.map((header) => (
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
