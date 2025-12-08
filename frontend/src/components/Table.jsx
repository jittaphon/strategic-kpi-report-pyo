import React, { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Info, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// ชื่อเดือนแบบปีงบไทย
const monthNames = {
  "10": "ต.ค.",
  "11": "พ.ย.",
  "12": "ธ.ค.",
  "01": "ม.ค.",
  "02": "ก.พ.",
  "03": "มี.ค.",
  "04": "เม.ย.",
  "05": "พ.ค.",
  "06": "มิ.ย.",
  "07": "ก.ค.",
  "08": "ส.ค.",
  "09": "ก.ย.",
};

// ลำดับเรียงตามปีงบ
const fiscalOrder = [
  "ต.ค.", "พ.ย.", "ธ.ค.",
  "ม.ค.", "ก.พ.", "มี.ค.",
  "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย."
];

// PIVOT: แปลงแถวละเดือน → แถวเดียวรวมทั้งปี
function pivotData(raw) {
  const map = {};

  raw.forEach(row => {
    const hosp = row.HOSPCODE;
    const month = row.month.padStart(2, "0");
    const mName = monthNames[month];

    if (!map[hosp]) {
      map[hosp] = {
        HOSPCODE: row.HOSPCODE,
        HOSNAME: row.HOSNAME,
        hospitalDisplay: `${row.HOSPCODE} - ${row.HOSNAME}`,
        months: {},
        total: 0
      };
    }

    const value = parseInt(String(row.cnt).trim(), 10) || 0;
    map[hosp].months[mName] = value;
    map[hosp].total += value;
  });

  return Object.values(map);
}

export default function Table({ data }) {
  const columnHelper = createColumnHelper();
  const [sorting, setSorting] = useState([]);


  const mappedData = useMemo(() => {
    if (!data) return [];
    return pivotData(data);
  }, [data]);

  // คำนวณผลรวมแต่ละคอลัมน์
  const columnTotals = useMemo(() => {
    const totals = { total: 0 };
    fiscalOrder.forEach(month => {
      totals[month] = 0;
    });

    mappedData.forEach(row => {
      Object.entries(row.months).forEach(([month, value]) => {
        totals[month] = (totals[month] || 0) + value;
        totals.total += value;
      });
    });

    return totals;
  }, [mappedData]);

  // dynamic column ตามปีงบ
  const monthColumns = fiscalOrder.map((m) =>
    columnHelper.accessor(
      (row) => row.months[m] ?? 0,
      {
        id: m,
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center justify-center gap-1 w-full hover:text-blue-100 transition-colors"
          >
            {m}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="w-4 h-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="w-4 h-4" />
            ) : (
              <ArrowUpDown className="w-4 h-4 opacity-50" />
            )}
          </button>
        ),
        cell: (info) => {
          const val = info.getValue();
          return (
            <div className="text-center font-medium text-base">
              {val === 0 ? (
                <span className="text-gray-700">0</span>
              ) : (
                <span className="text-gray-700">{val.toLocaleString()}</span>
              )}
            </div>
          );
        },
        enableSorting: true,
      }
    )
  );

  const defaultColumns = [
    columnHelper.accessor("hospitalDisplay", {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-blue-100 transition-colors"
        >
          สถานพยาบาล
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="w-4 h-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="w-4 h-4" />
          ) : (
            <ArrowUpDown className="w-4 h-4 opacity-50" />
          )}
        </button>
      ),
      cell: (info) => (
        <div className="text-left whitespace-nowrap font-medium text-gray-800 text-base">
          {info.getValue()}
        </div>
      ),
      enableSorting: true,
    }),

    columnHelper.accessor("total", {
      id: "total",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center gap-1 w-full hover:text-blue-100 transition-colors"
        >
          จำนวนให้บริการ (ครั้ง)
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="w-4 h-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="w-4 h-4" />
          ) : (
            <ArrowUpDown className="w-4 h-4 opacity-50" />
          )}
        </button>
      ),
      cell: (info) => {
        const total = info.getValue();
        return (
          <div className="text-center font-bold text-blue-700  text-base">
            {total.toLocaleString()}
          </div>
        );
      },
      enableSorting: true,
    }),

    ...monthColumns,
  ];

  const table = useReactTable({
    data: mappedData,
    columns: defaultColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-xl">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-xl border border-blue-200/50 shadow-lg">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 border-r border-blue-400/30 last:border-r-0 font-semibold text-white text-center shadow-sm text-base"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white/80 backdrop-blur-sm">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={defaultColumns.length}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                        <Info className="w-8 h-8 text-blue-400" />
                      </div>
                      <p className="text-base font-medium">ไม่มีข้อมูล</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {table.getRowModel().rows.map((row, idx) => (
                    <tr 
                      key={row.id}
                      className={`
                        border-b border-blue-100/50 
                        hover:bg-blue-200/60
                        transition-colors duration-200
                        ${idx % 2 === 0 ? 'bg-white/60' : 'bg-blue-50/30'}
                      `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td 
                          key={cell.id} 
                          className="px-4 py-3 border-r border-blue-100/50 last:border-r-0"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* แถวสรุปรวม */}
                  <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-white sticky bottom-0">
                    <td className="px-4 py-4 text-left border-r border-blue-400/30 text-base">
                      รวมทั้งหมด
                    </td>
                    <td className="px-4 py-4 text-center border-r border-blue-400/30 text-base">
                      {columnTotals.total.toLocaleString()}
                    </td>
                    {fiscalOrder.map((month) => (
                      <td 
                        key={month} 
                        className="px-4 py-4 text-center border-r border-blue-400/30 last:border-r-0 text-base"
                      >
                        {(columnTotals[month] || 0).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}