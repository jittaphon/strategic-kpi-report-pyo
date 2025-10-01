import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Users, Activity, AlertCircle, FileText, CheckCircle2, Calendar, ArrowUp, ArrowDown, Zap, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API } from '../api';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Select } from 'antd';
import {  HashLoader
} from 'react-spinners';
import 'antd/dist/reset.css';

const FilePage = () => {

  const containerRef = useRef();
  const [mounted, setMounted] = useState(false);
  const [fiscalYear, setFiscalYear] = React.useState('ปีงบ 2568');
  const [data, setData] = useState([]); 
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  

  useEffect(() => {
    setMounted(true);
    FetchDataPost();
    FetchDataGet(fiscalYear);
  }, [fiscalYear]);

  const getCurrentMonthString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const FetchDataPost = async () => {
    const monthStr = getCurrentMonthString();
    try {
      const response = await axios.get(
        `https://api-center-hdc.moph.go.th/v1/member-upload/summary-data-daily?month=${monthStr}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );

      const rows = response.data.rows || [];
      const cleanedData = rows.map(row => ({
        yymm: row.yymm,
        name: row.name,
        total: row.total,
      }));

      await API.hdccheckAPI.postAppointments(cleanedData);
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("❌ Token หมดอายุแล้ว ต้องขอใหม่ครับ");
      } else {
        console.error("Error fetching or posting data:", error);
      }
    }
  };

const FetchDataGet = async (year) => {
  if (year === 'ปีงบ 2568') {
    year = 2025;
  }

  setIsLoading(true);

  // delay 500ms (0.5 วินาที)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const res = await API.hdccheckAPI.getAppointments(year);
    if (res.data && res.data.data) {
      setData(res.data.data);
    } else {
      setData(res.data || []);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("❌ Token หมดอายุแล้ว ต้องขอใหม่ครับ");
    } else {
      console.error("Error fetching or posting data:", error);
    }
  } finally {
    setIsLoading(false);
  }
};


  const columnHelper = createColumnHelper();

  const monthColumns = [
    { key: 'Oct_24', label: 'ต.ค.' },
    { key: 'Nov_24', label: 'พ.ย.' },
    { key: 'Dec_24', label: 'ธ.ค.' },
    { key: 'Jan_25', label: 'ม.ค.' },
    { key: 'Feb_25', label: 'ก.พ.' },
    { key: 'Mar_25', label: 'มี.ค.' },
    { key: 'Apr_25', label: 'เม.ย.' },
    { key: 'May_25', label: 'พ.ค.' },
    { key: 'Jun_25', label: 'มิ.ย.' },
    { key: 'Jul_25', label: 'ก.ค.' },
    { key: 'Aug_25', label: 'ส.ค.' },
    { key: 'Sep_25', label: 'ก.ย.' },
  ];

  const columns = [
    columnHelper.accessor('hosp_code', {
      header: 'รหัสหน่วยบริการ',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('hosp_name', {
      header: 'ชื่อหน่วยบริการ',
      cell: info => info.getValue(),
    }),
    ...monthColumns.map(month =>
      columnHelper.accessor(month.key, {
        header: month.label,
        cell: info => info.getValue()?.toLocaleString() || '0',
      })
    ),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className={`mb-8 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
  <div>
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
      ภาพรวม 43 แฟ้มข้อมูลสุขภาพ
    </h1>
    <p className="text-gray-600 text-lg">
      จำนวนข้อมูลการให้บริการ (อ้างอิงตามข้อมูลในแฟ้ม service)
    </p>
    <p
  className="mt-3 text-md md:text-md font-semibold text-red-600 
             bg-red-100/30 backdrop-blur-sm border border-red-300 rounded-md 
             px-3 py-1 inline-block"
>
  ℹ️ ข้อมูลจะประมวลผลทุกวันที่ 15 และ 30 ของแต่ละเดือน
</p>

  </div>
</div>

        </div>

        {/* Search Bar */}
        <div 
          className={`mb-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="flex items-center gap-4 rounded-2xl px-6 py-4">
            {/* Fiscal Year Select */}
            <Select
              value={fiscalYear}
              onChange={(val) => setFiscalYear(val)}
              size="large"
              style={{
                width: 160,
                height: 56,
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                fontSize: "18px",
                fontWeight: 600,
              }}
              dropdownStyle={{
                backdropFilter: "blur(12px)",
                background: "rgba(255, 255, 255, 0.85)",
                borderRadius: "12px",
                fontSize: "18px",
              }}
            >
              <Select.Option value="2025">ปีงบ 2568</Select.Option>
              <Select.Option value="2026">ปีงบ 2569</Select.Option>
            </Select>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="ค้นหารหัสหรือชื่อหน่วยบริการ..."
                className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                           shadow-lg text-gray-700 placeholder-gray-400 transition-all duration-300 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div 
          className={`relative transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
                <div className="flex flex-col items-center gap-4">
                  <HashLoader color="#3B82F6" size={30} />
                  <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="border-b border-white/50">
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 backdrop-blur-sm cursor-pointer hover:bg-blue-100/50 transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() && (
                              <span className="text-blue-600">
                                {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                 {table.getRowModel().rows.map((row) => (
                    <tr 
                      key={row.id}
                      className="border-b border-white/30 hover:bg-blue-100/70 transition-all duration-200 backdrop-blur-sm cursor-pointer"
                    >
                      {row.getVisibleCells().map(cell => {
                        const value = cell.getValue();
                        const isNumericColumn = cell.column.id !== 'hcode' && cell.column.id !== 'hname';
                        
                        return (
                          <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                            {isNumericColumn && typeof value === 'number' ? (
                              <div className="flex items-center justify-center">
                                {value > 0 ? (
                                   <FaCheckCircle size={24} color="green" /> 

                                ) : (
                                     <FaTimesCircle size={24} color="red" />
                                )}
                              </div>
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 backdrop-blur-sm border-t border-white/50">
              <div className="flex flex-col gap-1">
  <span className="text-sm text-gray-600">
    แสดง {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} ถึง{' '}
    {Math.min(
      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
      table.getFilteredRowModel().rows.length
    )}{' '}
    จาก {table.getFilteredRowModel().rows.length} รายการ
  </span>
  
  <span className="text-sm text-gray-600 py-3">
    วันที่ประมวลผล :: 30 กันยายน 2568
  </span>
</div>

              
              <div className="flex items-center gap-2">
                
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg 
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50/50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <span className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg text-sm font-medium text-gray-700">
                  หน้า {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </span>
                
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg 
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50/50 transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              
            </div>
            
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FilePage;