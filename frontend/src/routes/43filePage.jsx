import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Users, Activity, AlertCircle, FileText, CheckCircle2, Calendar, ArrowUp, ArrowDown, Zap } from 'lucide-react';

const FilePage = () => {
  const containerRef = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



 

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div 
          className={`mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                ภาพรวม 43 แฟ้มข้อมูลสุขภาพ 
              </h1>
              <p className="text-gray-600 text-lg">จำนวนข้อมูลการให้บริการ (อ้างอิงตามข้อมูลในแฟ้ม service)</p>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-lg border border-gray-100">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="text-right">
                <p className="text-xs text-gray-500">วันที่</p>
                <p className="font-semibold text-gray-800">29 กันยายน 2568</p>
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