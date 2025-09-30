import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Users, Activity, AlertCircle, FileText, CheckCircle2, Calendar, ArrowUp, ArrowDown, Zap } from 'lucide-react';

const HomePage = () => {
  const containerRef = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const kpiData = [
    { 
      id: 1,
      label: 'ผู้ป่วยสะสมทั้งหมด', 
      value: '12,847', 
      subtext: 'ราย',
      change: '+5.2%', 
      changeValue: '+652 ราย',
      trend: 'up', 
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'bg-blue-500/20',
      delay: 0.1
    },
    { 
      id: 2,
      label: 'อัตราส่งข้อมูล HDC', 
      value: '96.8', 
      subtext: '%',
      change: '+2.1%', 
      changeValue: 'เพิ่มขึ้น',
      trend: 'up', 
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgGlow: 'bg-green-500/20',
      delay: 0.2
    },
    { 
      id: 3,
      label: 'การใช้บริการเฉลี่ย', 
      value: '1,234', 
      subtext: 'ครั้ง/วัน',
      change: '-1.5%', 
      changeValue: '-19 ครั้ง',
      trend: 'down', 
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/20',
      delay: 0.3
    },
    { 
      id: 4,
      label: 'รายงานค้างส่ง', 
      value: '3', 
      subtext: 'รายการ',
      change: '-40%', 
      changeValue: '-2 รายการ',
      trend: 'up', 
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      bgGlow: 'bg-orange-500/20',
      delay: 0.4
    }
  ];



  const quickStats = [
    { label: 'อำเภอ', value: '9', icon: '🚩' },
    { label: 'รพ.สต. ทั้งหมด', value: '124', icon: '🏥' },
   
  ];

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
                Overview Dashboard
              </h1>
              <p className="text-gray-600 text-lg">ภาพรวมข้อมูลและตัวชี้วัด - สำนักงานสาธารณสุขจังหวัดพะเยา</p>
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

        {/* Quick Stats Bar */}
        <div 
          className={`mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickStats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            ตัวชี้วัดหลัก (Key Performance Indicators)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div 
                  key={kpi.id}
                  className={`group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${300 + kpi.delay * 1000}ms` }}
                >
                  {/* Glow Effect on Hover */}
                  <div className={`absolute inset-0 ${kpi.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                  
                  {/* Gradient Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                  
                  <div className="relative z-10">
                    {/* Icon and Change Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                        kpi.trend === 'up' 
                          ? kpi.label.includes('ค้างส่ง') 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {kpi.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {kpi.change}
                      </div>
                    </div>

                    {/* Value */}
                    <div className="mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-300">
                          {kpi.value}
                        </span>
                        <span className="text-lg text-gray-500">{kpi.subtext}</span>
                      </div>
                    </div>

                    {/* Label and Details */}
                    <p className="text-gray-600 font-medium mb-2">{kpi.label}</p>
                    <p className="text-sm text-gray-500">{kpi.changeValue}</p>

                    {/* Progress Bar */}
                    <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${kpi.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ 
                          width: mounted ? `${kpi.id === 2 ? 96.8 : (kpi.id * 20 + 20)}%` : '0%',
                          transitionDelay: `${500 + kpi.delay * 1000}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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

export default HomePage;