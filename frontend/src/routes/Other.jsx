import React, { useState, useRef, useEffect } from 'react';
import { FileText, Earth,BookOpen, Download, ExternalLink, ChevronDown, ChevronRight, Database ,Folder, File, Search } from 'lucide-react';

const Others = () => {
  const containerRef = useRef();
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Quick Access Items
  const quickAccessItems = [
    {
      id: 1,
      title: 'คู่มือหลักทั้งหมด',
      description: 'เข้าถึงคู่มือ 43 แฟ้มข้อมูลสุขภาพแบบครบชุด',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      link: 'https://drive.google.com/drive/folders/1ZgUDRkoEnNS7C5tcinndNi58NAsR47s5',
      stats: 'ทั้งหมด'
    },
    {
      id: 2,
      title: 'HDC คืออะไร',
      description: 'วิดิโอแนะนำระบบ HDC ',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      link: 'https://www.youtube.com/watch?v=bUYNOvE1i1E',
      stats: 'แนะนำ'
    },
    {
      id: 3,
      title: 'HDC จังหวัด',
      description: 'เว็บไซต์ HDC ของจังหวัดพะเยา',
      icon: Earth,
      color: 'from-purple-500 to-pink-500',
      link: 'https://hdc.moph.go.th/pyo/public/main',
      stats: 'แนะนำ'
    }
  ];

  // Manual Categories with nested structure
  const manualCategories = [
    {
      id: 'basic',
      title: 'คู่มือการลงทะเบียนและการใช้งานระบบ HDC',
      icon: BookOpen,
      items: [
        { name: '1.การสมัครเข้าใช้งานระบบ HDC ระบบใหม่ (2025)', type: 'pdf', link: 'https://drive.google.com/file/d/1l2RdZ7Uu6RyXNg0CgYwVM32v4THQWkEw/view' },
        { name: '2.วิธีการ login เข้าสู่ระบบ HDC ระบบใหม่ (2025)', type: 'MP4', link: 'https://drive.google.com/file/d/1GyYlDhHspyo2Bjec2Ti4_SNll6Qp6J0R/view' },
        { name: '3.วิธีการส่งออกข้อมูล 43 เเฟ้ม เข้าสู่ระบบ HDC ระบบใหม่ (2025)', type: 'pdf', link: 'https://drive.google.com/file/d/16QIrT4zsQRcf5S8Bu4vfC7H1zL76ZKJR/view' },
        { name: '4.วิธีการดูข้อมูลรายบุคคล DataExchange HDC ระบบใหม่ (2025)', type: 'pdf', link: 'https://drive.google.com/file/d/1sDDiRlUD5UwNPnN2QCuzCqSwNGzGjUaR/view' },
        { name: '5.วิธีตรวจสอบข้อมูล 43 เเฟ้ม ก่อนส่งเข้าสู่ระบบ HDC ระบบใหม่ (2025)', type: 'MP4', link: 'https://drive.google.com/file/d/1x_yif-6Go5ZaKosQOjxIHlDrcW53fXc_/view' },
        { name: '6.วิธีการขอสิทธิ์ใช้ Home BP 43 ', type: 'pdf', link: 'https://drive.google.com/file/d/1k57_6aTsEApLyj2gV5s6r4RLv6J2fS7I/view' }
      ]
    },
    {
      id: 'data',
      title: 'คู่มือโครงสร้างข้อมูล 43 แฟ้ม',
      icon: Folder,
      items: [
        { name: 'โครงสร้างข้อมูล 43 เเฟ้ม', type: 'pdf', link: 'https://drive.google.com/file/d/1dA3spvhGYqitzqbAhJg7iTGL4sTURHZF/view' },
      ]
    },
     {
      id: 'data-correct',
      title: 'คู่มือการใช้งานโปรเเกรมลบข้อมูล DataCorrect หรือ HuntCorrect',
      icon: Database,
      items: [
        { name: 'โปรเเกรม HuntCorrect', type: 'xlsx', link: 'https://drive.google.com/file/d/1txU54rrlL198Lg5MwtZx-7ZEe3CMS-Bu/view' },
        { name: 'คู่มือวิธีการใช้งานโปรเเกรม HuntCorrect / DataCorrect', type: 'pdf', link: 'https://drive.google.com/open?id=1hS_c0DshAAS4jIozQTJBC4nFRKXjC8oB&authuser=0' },
      ]
    },
        {
      id: 'other',
      title: 'เอกสารการประชุมและอบรมต่างๆ',
      icon: FileText,
      items: [
        { name: 'เอกสารการประชุม HDC 7 กพ 2568', type: 'GoogleDrive', link: 'https://drive.google.com/drive/folders/1MFeQWLrR7BKPiJa6uOmpNPheiJjTkX-5' },
        { name: 'เอกสารประกอบการประชุม-ติดตามคัดกรองพัฒนาการเด็ก 15 กย 2568', type: 'GoogleDrive', link: 'https://drive.google.com/drive/folders/1fMf1gzHUooWXvmaAnryMA45HWBjAh2le' },
      ]
    },
   
  ];

  const filteredCategories = manualCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

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
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                คู่มือ 43 แฟ้มข้อมูลสุขภาพ
              </h1>
              <p className="text-gray-600 text-lg">เอกสารและคู่มือการใช้งานระบบข้อมูลสุขภาพ</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหาคู่มือ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Quick Access Cards */}
        <div 
          className={`mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></span>
            เข้าถึงด่วน (Quick Access)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${item.color} text-white`}>
                        {item.stats}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Manual Categories - Accordion List */}
        <div 
          className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '600ms' }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
            คู่มือทั้งหมด
          </h2>

          <div className="space-y-4">
            {filteredCategories.map((category, catIndex) => {
              const Icon = category.icon;
              const isExpanded = expandedItems[category.id];

              return (
                <div
                  key={category.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${700 + catIndex * 100}ms` }}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleItem(category.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-500">{category.items.length} ไฟล์</p>
                      </div>
                    </div>
                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    </div>
                  </button>

                  {/* Category Items */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="px-6 pb-4 space-y-2 border-t border-gray-100 pt-4">
                      {category.items.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          <File className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          <span className="text-gray-700 group-hover:text-blue-600 transition-colors flex-1">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 uppercase">{item.type}</span>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && searchTerm && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">ไม่พบคู่มือที่ค้นหา "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>

 
    </div>
  );
};

export default Others;