import React, { useMemo, useState, useEffect, Fragment } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../api";

/* =================== CONSTANTS =================== */
const monthNames = {
  "10": "ต.ค.", "11": "พ.ย.", "12": "ธ.ค.",
  "01": "ม.ค.", "02": "ก.พ.", "03": "มี.ค.",
  "04": "เม.ย.", "05": "พ.ค.", "06": "มิ.ย.",
  "07": "ก.ค.", "08": "ส.ค.", "09": "ก.ย.",
};

const fiscalOrder = [
  "ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.",
  "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.",
];

// ลำดับที่ต้องการให้แสดง (เรียงจากบนลงล่างตามนี้)
const priorityHospCodes = [
  '10717', '10718', '11184', '11185', '11186', 
  '11187', '11188', '40744', '40745'
];

/* =================== HELPER FUNCTIONS =================== */

function pivotData(raw) {
  if (!raw || !Array.isArray(raw)) return [];
  const map = {};

  raw.forEach(r => {
    if (!map[r.HOSPCODE]) {
      map[r.HOSPCODE] = {
        HOSPCODE: r.HOSPCODE,
        HOSNAME: r.HOSNAME,
        hospitalDisplay: `${r.HOSPCODE} - ${r.HOSNAME}`,
        months: {},
        total: 0,
      };
    }

    let mKey = null;
    if (r.DATE_SERV) {
      const monthPart = r.DATE_SERV.split("-")[1];
      mKey = monthNames[monthPart];
    }

    const v = Number(r.total_visit) || 0;
    if (mKey) {
      map[r.HOSPCODE].months[mKey] = (map[r.HOSPCODE].months[mKey] || 0) + v;
    }
    map[r.HOSPCODE].total += v;
  });

  return Object.values(map);
}

function pivotClinicData(clinicRaw) {
  if (!clinicRaw || !Array.isArray(clinicRaw)) return [];
  const map = {};

  clinicRaw.forEach(r => {
    const cName = r.clinic_name || "ไม่ระบุชื่อคลินิก";
    if (!map[cName]) {
      map[cName] = { clinicDisplay: cName, months: {}, total: 0 };
    }

    let mKey = null;
    if (r.DATE_SERV) {
      const monthPart = r.DATE_SERV.split("-")[1];
      mKey = monthNames[monthPart];
    }

    const v = Number(r.total_visit) || 0;
    if (mKey) {
      map[cName].months[mKey] = (map[cName].months[mKey] || 0) + v;
    }
    map[cName].total += v;
  });

  return Object.values(map).sort((a, b) => b.total - a.total);
}

/* =================== SUB TABLE COMPONENT =================== */

function ClinicSubTable({ clinics, isLoading, hospitalName }) {
  const sortedClinics = [...clinics].sort((a, b) => {
    const bottomItems = ['ให้บริการ B2B'];
    const aIsBottom = bottomItems.includes(a.clinicDisplay);
    const bIsBottom = bottomItems.includes(b.clinicDisplay);
    if (aIsBottom && bIsBottom) return b.total - a.total;
    if (aIsBottom) return 1;
    if (bIsBottom) return -1;
    return b.total - a.total;
  });

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center items-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-500" size={30} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, maxHeight: 0 }}
      animate={{ opacity: 1, maxHeight: 2000 }}
      exit={{ opacity: 0, maxHeight: 0 }}
      className="overflow-hidden"
    >
      <div className="p-6 bg-gray-50/50 border-y border-blue-100">
        <div className="flex items-center gap-2 mb-4 text-[13px] font-bold text-[#2B59FF]">
          <span className="w-1.5 h-4 bg-[#2B59FF] rounded-full"></span>
          CLINIC : {hospitalName}
        </div>
        <div className="rounded-xl border border-blue-100 overflow-hidden shadow-sm bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-blue-50/50">
              <tr className="border-b border-blue-100">
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-blue-800 w-[30%]">ชื่อคลินิก</th>
                <th className="px-2 py-3 text-center text-[13px] font-semibold text-blue-800 w-[12%] bg-blue-100/30">จำนวนให้บริการ(ครั้ง)</th>
                {fiscalOrder.map(m => (
                  <th key={m} className="px-1 py-3 text-center text-[16px] font-medium text-blue-600">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedClinics.map((c, i) => (
                <tr key={i} className="border-b border-blue-50 hover:bg-blue-100/100 last:border-0 transition-colors">
                  <td className="px-4 py-2.5 text-[15px] text-gray-700 font-medium">{c.clinicDisplay}</td>
                  <td className="px-2 py-2.5 text-center text-[15px] font-bold text-[#2B59FF] bg-blue-100/50">
                    {c.total.toLocaleString()}
                  </td>
                  {fiscalOrder.map(m => (
                    <td key={m} className="px-1 py-2.5 text-center text-[15px] text-gray-500">
                      {c.months[m] ? c.months[m].toLocaleString() : "0"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== MAIN TABLE COMPONENT =================== */

export default function Table({ data, fiscalYear, loading: mainLoading }) {
  const columnHelper = createColumnHelper();
  
  // ตั้งค่า sorting เป็นว่างเพื่อให้ลำดับ Priority ที่เราเขียนไว้ใน mappedData ทำงานก่อน
  const [sorting, setSorting] = useState([]); 
  const [expanded, setExpanded] = useState({});
  const [clinicData, setClinicData] = useState([]);
  const [loadingClinic, setLoadingClinic] = useState(false);

  // 1. จัดการเรียงลำดับข้อมูลดิบ
  const mappedData = useMemo(() => {
    const pivoted = pivotData(data);
    
    return pivoted.sort((a, b) => {
      const aIdx = priorityHospCodes.indexOf(a.HOSPCODE);
      const bIdx = priorityHospCodes.indexOf(b.HOSPCODE);

      // ถ้าทั้งคู่เป็น Priority ให้เรียงตาม Index ใน Array เป๊ะๆ
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      
      // ถ้า a เป็น Priority ให้ขึ้นก่อน
      if (aIdx !== -1) return -1;
      // ถ้า b เป็น Priority ให้ขึ้นก่อน
      if (bIdx !== -1) return 1;
      
      // ถ้าไม่ใช่ทั้งคู่ เรียงตาม total จากมากไปน้อย
      return b.total - a.total;
    });
  }, [data]);
  
  const processedClinics = useMemo(() => pivotClinicData(clinicData), [clinicData]);

  const totals = useMemo(() => {
    const result = { total: 0, months: {} };
    fiscalOrder.forEach(m => { result.months[m] = 0; });
    mappedData.forEach(row => {
      result.total += row.total;
      fiscalOrder.forEach(m => {
        result.months[m] += (row.months[m] || 0);
      });
    });
    return result;
  }, [mappedData]);

  const fetchClinics = async (hospcode) => {
    setLoadingClinic(true);
    setClinicData([]);
    try {
      const res = await API.tele_med.getClinics(hospcode, fiscalYear);
      setClinicData(res.data?.data ?? []);
    } catch (e) {
      console.error("Fetch clinics error:", e);
    } finally {
      setLoadingClinic(false);
    }
  };

  const columns = [
    columnHelper.accessor("hospitalDisplay", {
      header: ({ column }) => (
        <button className="flex items-center gap-2 hover:opacity-80 transition-all" onClick={() => column.toggleSorting()}>
          สถานพยาบาล
          {column.getIsSorted() === "asc" ? <ArrowUp size={14} /> : column.getIsSorted() === "desc" ? <ArrowDown size={14} /> : <ArrowUpDown size={14} />}
        </button>
      ),
      cell: ({ row, getValue }) => {
        const canExpand = priorityHospCodes.includes(row.original.HOSPCODE);
        return (
          <div className="flex items-center gap-3">
            {canExpand ? (
              <motion.span 
                animate={{ rotate: expanded[row.id] ? 0 : -90 }}
                transition={{ duration: 0.5 }}
                className="text-[10px] text-blue-500"
              >
                ▼
              </motion.span>
            ) : (
              <span className="w-[10px]"></span>
            )}
            <span className="font-semibold text-gray-700 text-[17px]">{getValue()}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("total", {
      id: "total",
      header: ({ column }) => (
        <button className="flex items-center justify-center gap-2 w-full hover:opacity-80 transition-all whitespace-nowrap" onClick={() => column.toggleSorting()}>
          จำนวนให้บริการ (ครั้ง)
          {column.getIsSorted() === "asc" ? <ArrowUp size={14} /> : column.getIsSorted() === "desc" ? <ArrowDown size={14} /> : <ArrowUpDown size={14} />}
        </button>
      ),
      cell: i => (
        <div className="text-center">
          <span className="font-bold text-[#2B59FF] px-4 py-1 bg-blue-50 border border-blue-100 rounded-lg inline-block min-w-[80px] text-[17px]">
            {i.getValue().toLocaleString()}
          </span>
        </div>
      ),
    }),
    ...fiscalOrder.map(m =>
      columnHelper.accessor(r => r.months[m] ?? 0, {
        id: m,
        header: ({ column }) => (
          <button className="flex items-center justify-center gap-1 w-full hover:opacity-80 transition-all text-[16px]" onClick={() => column.toggleSorting()}>
            {m}
            {column.getIsSorted() ? (column.getIsSorted() === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} className="opacity-30" />}
          </button>
        ),
        cell: i => (
          <div className="text-center text-gray-600 text-[17px]">
            {i.getValue() > 0 ? i.getValue().toLocaleString() : "0"}
          </div>
        ),
      })
    ),
  ];

  const table = useReactTable({
    data: mappedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // 2. ปรับ Sorting Function ของ Table ให้ Priority ขึ้นก่อนเสมอแม้จะกด Sort หัวตาราง
    sortingFns: {
      auto: (rowA, rowB, columnId) => {
        const aIdx = priorityHospCodes.indexOf(rowA.original.HOSPCODE);
        const bIdx = priorityHospCodes.indexOf(rowB.original.HOSPCODE);

        // ถ้าอยู่ใน List Priority ทั้งคู่ ให้เรียงตาม Index
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        // ถ้าตัวหนึ่งเป็น Priority ให้ลอยขึ้นบน
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;

        // แถวปกติเรียงตามค่าจริง
        const aVal = rowA.getValue(columnId);
        const bVal = rowB.getValue(columnId);
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    }
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
      <table className="w-full border-collapse">
        <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map((h, idx) => (
                <th key={h.id} 
                    style={{ width: idx === 0 ? '30%' : idx === 1 ? '15%' : '4.6%' }}
                    className="px-4 py-5 text-[15px] font-bold text-center first:text-left border-r border-white/10 last:border-0 whitespace-nowrap">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {table.getRowModel().rows.map((row, rowIndex) => {
            const isPriority = priorityHospCodes.includes(row.original.HOSPCODE);
            return (
              <Fragment key={row.id}>
                <tr 
                  className={`group transition-all duration-200 
                    ${isPriority ? 'cursor-pointer hover:bg-blue-100/100' : 'cursor-default'}
                    ${expanded[row.id] ? 'bg-blue-200/60 border-l-4 border-l-blue-600' : rowIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50/20'}
                  `}
                  onClick={() => {
                    if (!isPriority) return;
                    const isExp = !!expanded[row.id];
                    setExpanded({ [row.id]: !isExp });
                    if (!isExp) fetchClinics(row.original.HOSPCODE);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 text-center first:text-left">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                <AnimatePresence>
                  {expanded[row.id] && isPriority && (
                    <tr>
                      <td colSpan={columns.length} className="p-0 border-b border-blue-100">
                        <ClinicSubTable 
                          clinics={processedClinics} 
                          isLoading={loadingClinic} 
                          hospitalName={row.original.HOSNAME}
                        />
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </tbody>
        <tfoot className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white font-bold">
          <tr>
            <td className="px-4 py-5 text-left text-[17px] border-r border-white/10">รวมทั้งหมด</td>
            <td className="px-4 py-5 text-center border-r border-white/10">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-lg text-[17px]">
                {totals.total.toLocaleString()}
              </span>
            </td>
            {fiscalOrder.map(m => (
              <td key={m} className="px-4 py-5 text-center text-[17px] border-r border-white/10 last:border-0">
                {totals.months[m].toLocaleString()}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}