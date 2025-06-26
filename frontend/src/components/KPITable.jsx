import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export default function KPITable({ data, columns, renderHeader , extraContent }) {


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
    <div className="overflow-x-auto">
      {renderHeader && renderHeader()}
       
     {extraContent && <div className=" grid justify-items-end">{extraContent}</div>}

      <table className="min-w-full table-auto border mt-3">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-emerald-500 text-white text-sm sticky top-0 z-10"
            >
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
          {table.getRowModel().rows.map((row, rowIndex) => (
            <motion.tr
              key={row.id}
              className="hover:bg-green-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: rowIndex * 0.05 }}
            >
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={cell.id}
                  className={`border px-4 py-3 align-middle ${
                    cellIndex === 0
                      ? "text-left"
                      : cellIndex === 1
                      ? "bg-green-100 text-center"
                      : "text-center"
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </motion.tr>
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
