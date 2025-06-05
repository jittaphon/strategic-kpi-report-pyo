import React, { useState } from "react";
import { API } from '../api';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const hospitals = [
  { id: 10717, name: "โรงพยาบาล พะเยา" },
  { id: 11184, name: "โรงพยาบาล จุน" },
  { id: 11187, name: "โรงพยาบาล ปง" },
  { id: 40744, name: "โรงพยาบาล ภูซาง" },
  { id: 10718, name: "โรงพยาบาล เชียงคำ" },
  { id: 11186, name: "โรงพยาบาล ดอกคำใต้" },
  { id: 11188, name: "โรงพยาบาล แม่ใจ" },
  { id: 11185, name: "โรงพยาบาล เชียงม่วน" },
  { id: 40745, name: "โรงพยาบาล ภูกามยาว" },
];

const diseases = [
  { id: 1, name: "โรคเบาหวาน (DM)" },
  { id: 2, name: "ความดันโลหิตสูง (HT)" },
  { id: 3, name: "หลอดเลือดสมอง (STROKE)" },
  { id: 4, name: "หัวใจขาดเลือด (IHD)" },
  { id: 5, name: "ปอดอุดกั้นเรื้อรัง (COPD)" },
  { id: 6, name: "ไขมันในเลือดสูง (HPL)" },
  { id: 7, name: "อ้วนลงพุง (OB)" },
];

export default function NcdInputButtonForm({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hospitalId, setHospitalId] = useState(hospitals[0]?.id || 0);
  const [cases, setCases] = useState(
  Object.fromEntries(diseases.map(d => [d.id, "0"]))
);

const handleChange = (id, value) => {
  // ให้พิมพ์เลขหรือค่าว่างได้
  if (/^\d*$/.test(value)) {
    setCases(prev => ({ ...prev, [id]: value }));
  }
};
const handleBlur = (id) => {
  if (cases[id] === "") {
    setCases(prev => ({ ...prev, [id]: "0" }));
  }
};
const resetForm = () => {
  setHospitalId(hospitals[0]?.id || 0);
  setCases(Object.fromEntries(diseases.map(d => [d.id, "0"])));
};

const handleConfirmSubmit = async () => {
  const formattedCases = Object.entries(cases).map(([diseaseId, count]) => ({
    disease_id: parseInt(diseaseId, 10),
    case_count: Number(count) || 0,
  }));

  const payload = {
    hospital_id: hospitalId,
    cases: formattedCases,
  };

  try {
    await API.ncd_registry.postAppointments(payload);
    if (onSuccess) {
     await onSuccess(); // ดึงข้อมูลใหม่จากตาราง
     }

    // แสดงข้อความสำเร็จ
    setIsSuccess(true);

    // Reset หลังจาก 2 วิ
    setTimeout(() => {
      setIsSuccess(false);
      setIsConfirmOpen(false);
      setIsOpen(false);
      resetForm();
    }, 2000);

  } catch (error) {
    console.error("❌ ส่งข้อมูลไม่สำเร็จ:", error);
    toast.error("❌ บันทึกล้มเหลว กรุณาลองใหม่", { icon: "⚠️" });
    // คุณอาจจะแสดง error message ให้ user ก็ได้ เช่น setError(error.message)
  }
};



  return (
    <>
    <ToastContainer position="top-right" autoClose={2000} />
<button
  onClick={() => setIsOpen(true)}
  className="relative px-5 py-2 mt-2 font-medium text-white bg-blue-600 rounded-lg overflow-hidden group hover:text-white"
>
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
  <span className="relative z-10">ส่งรายงานข้อมูล NCD Registry</span>
</button>


 <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40 p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-2xl w-full space-y-6 transition-all">
              <Dialog.Title className="text-xl font-semibold text-gray-800">
                📋 แบบฟอร์มรายงาน NCD Registry
              </Dialog.Title>

              {/* Row 1: เลือกโรงพยาบาล */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">🏥 เลือกโรงพยาบาล</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={hospitalId}
                  onChange={(e) => setHospitalId(Number(e.target.value))}
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              {/* Row 2: แบ่ง 2 คอลัมน์ */}
              <div className="grid grid-cols-2 gap-6">
                {/* Col 1: 4 โรค */}
                <div className="space-y-4">
                  {diseases.slice(0, 4).map(d => (
                    <div key={d.id}>
                      <label className="block text-sm text-gray-700 mb-1">{d.name}</label>
                     <input
  type="number"
  value={cases[d.id]}
  onChange={(e) => handleChange(d.id, e.target.value)}
  onBlur={() => handleBlur(d.id)}
  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
  min="0"
/>
                    </div>
                  ))}
                </div>

                {/* Col 2: 3 โรค */}
                <div className="space-y-4">
                  {diseases.slice(4, 7).map(d => (
                    <div key={d.id}>
                      <label className="block text-sm text-gray-700 mb-1">{d.name}</label>
                      <input
  type="number"
  value={cases[d.id]}
  onChange={(e) => handleChange(d.id, e.target.value)}
  onBlur={() => handleBlur(d.id)}
  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
  min="0"
/>
                    </div>
                  ))}
                </div>
              </div>

              {/* ปุ่ม */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  ❌ ยกเลิก
                </button>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:scale-105 transition-transform shadow-md"
                >
                  ✅ ส่งข้อมูล
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
<Transition show={isConfirmOpen} as={Fragment}>
  <Dialog onClose={() => setIsConfirmOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40 p-4">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-2xl max-w-xl w-full space-y-6">
          {isSuccess ? (
            <Transition.Child
              as={Fragment}
              enter="transform transition duration-500"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="transform transition duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <div className="text-center text-green-600 font-semibold text-lg py-8">
                ✅ ส่งข้อมูลเรียบร้อยแล้ว
              </div>
            </Transition.Child>
          ) : (
            <>
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                🧐 ยืนยันข้อมูลก่อนส่ง
              </Dialog.Title>

              <div>
                <p className="font-medium text-gray-700 mb-2">
                  🏥 โรงพยาบาล: {hospitals.find(h => h.id === hospitalId)?.name}
                </p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {diseases.map(d => (
                    <li key={d.id}>
                      - {d.name}: <strong>{cases[d.id]}</strong> ราย
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  🔙 กลับไปแก้ไข
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  ✅ ยืนยันการส่ง
                </button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </Transition.Child>
    </div>
  </Dialog>
</Transition>

    </>
  );
}
