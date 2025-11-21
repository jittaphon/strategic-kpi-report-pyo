import React, { useEffect, useState } from "react";
import { Building2, GraduationCap, Save, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { API } from "../../api";

// Mock API for demo


export default function FormB() {
  const [loading, setLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [formData, setFormData] = useState({
      title: "",
      first_name: "",
      last_name: "",
      health_unit: "",
      affiliation: "",
      interest_topic: "",
      training_format: "",
      note: "",
      type: "survey-tele-2569"
    });

  

;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.health_unit) newErrors.health_unit = "กรุณาเลือกหน่วยบริการสุขภาพ";
    if (!formData.interest_topic.trim()) newErrors.interest_topic = "กรุณาระบุเรื่องที่ต้องการอบรม";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
   const targetCodes = ['10717','10718','11184','11185','11186','11187','11188','40744','40745'];
const hospitalResponse = await API.utilsAPI.getHospitalAppointments();
setHospitalData(
  hospitalResponse.data.data.filter(h => targetCodes.includes(h.Hcode))
);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
 
   if (!validateForm()) {
     window.scrollTo({ top: 0, behavior: 'smooth' });
     return;
   }
 
   setIsSubmitting(true);
 try {
  console.log("🚀 Submitting form data:", formData);
   const res = await API.FormsApi.postAppointments(formData);

 
   if (res.status === 200 || res.status === 201) {
     // หน่วงสักครู่ให้ผู้ใช้รู้ว่ามีการประมวลผล
     await new Promise((resolve) => setTimeout(resolve, 800));
 
     setSubmitted(true);
     window.scrollTo({ top: 0, behavior: 'smooth' });
   } else {
     console.error("❌ Unexpected response:", res);
     alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
   }
 }
  catch (error) {
     console.error("🚨 Error submitting form:", error);
     alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
 
   } finally {
     setIsSubmitting(false);
   }
 };
 

  const handleSubmitAnother = () => {
    setSubmitted(false);
    setFormData({
      health_unit: "",
      interest_topic: "",
      note: ""
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              บันทึกคำตอบของคุณแล้ว
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              ขอบคุณสำหรับการกรอกแบบฟอร์ม!
            </p>

            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full mb-8"></div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-100">
              <p className="text-sm text-gray-600 mb-3">สรุปข้อมูลที่ส่ง:</p>
              <div className="space-y-2 text-left">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">หน่วยบริการสุขภาพ:</span> {formData.health_unit}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">คลินิก / แผนกที่จะเปิดนัด Online</span> {formData.interest_topic}
                </p>
                {formData.note && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">หมายเหตุ:</span> {formData.note}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmitAnother}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              ส่งคำตอบอื่น
            </button>

            <p className="text-xs text-gray-500 mt-8">
              หากต้องการแก้ไขคำตอบ กรุณาติดต่อเจ้าหน้าที่
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      

      <div className="max-w-5xl mx-auto">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
     
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-t-4 border-blue-500">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                แผนการเปิดคลินิกบริการนัดหมาย Online ผ่าน "หมอพร้อม" <br /> ของเเต่ละโรงพยาบาล จ.พะเยา 
                 (อย่างน้อย 4 คลินิกตามนโยบายปี 2569 หมอไม่ล้า ประชาชนไม่รอ เชื่อมต่อบริการผ่านเทคโนโลยี)
                
              </h1>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">📋 คำแนะนำ:</span> กรุณากรอกข้อมูลให้ครบถ้วนและตรวจสอบความถูกต้องก่อนส่งแบบฟอร์ม
            </p>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">กรุณากรอกข้อมูลให้ครบถ้วน</p>
              <p className="text-sm text-red-700">มีช่องที่จำเป็นต้องกรอกที่ยังไม่ได้กรอกข้อมูล</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-500" />
                ข้อมูลหน่วยงาน
              </h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ชื่อโรงพยาบาล<span className="text-red-500">*</span>
              </label>
              <select
                name="health_unit"
                value={formData.health_unit}
                onChange={handleChange}
                className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                  errors.health_unit ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                } ${!formData.health_unit && 'text-gray-400'}`}
              >
                <option value="" disabled hidden className="text-gray-400">ค้นหารหัสหน่วยบริการของท่าน</option>
                {hospitalData.map((hospital, index) => (
                  <option key={index} value={hospital.HmainOP_FULL} className="text-gray-900">
                    {hospital.HmainOP_FULL}
                  </option>
                ))}
              </select>
              {errors.health_unit && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.health_unit}
                </p>
              )}
            </div>

            <div className="border-l-4 border-purple-500 pl-4 mb-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                ระบุชื่อคลินิกแผนกที่จะเปิดนัด Online ในช่องด้านล่าง (อย่างน้อย 4 คลินิก) <span className="text-red-500">* ห้ามว่าง</span>
              </h2>
            </div>

            <div>
  <textarea
    name="interest_topic"
    value={formData.interest_topic}
    onChange={handleChange}
    rows={6}
    placeholder={`- กายภาพ
- ทันตกรรม
- แพทย์แผนไทย
- Telemedicine (ระบุคลินิก เช่น NCD, ANC ฯลฯ)`}
    className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none ${
      errors.interest_topic
        ? 'border-red-500 focus:border-red-500'
        : 'border-gray-200 focus:border-blue-500'
    }`}
  />
  {errors.interest_topic && (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {errors.interest_topic}
    </p>
  )}
 
            </div>


            <div className="border-l-4 border-gray-400 pl-4 mb-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800">
                หมายเหตุ <span className="text-gray-400 text-sm font-normal">(ไม่บังคับ)</span>
              </h2>
            </div>

            <div>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
              />
            </div>

            <div className=" border-gray-400 pl-4 mb-6 mt-8">
              <h2 className="text-xl text-gray-800">
               กลุ่มงานสุขภาพดิจิทัล สสจ.พะเยา ขอขอบคุณไอทีทุกท่านในความร่วมมือ 
              </h2>
            </div>


            <div className="pt-6 border-t-2 border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>กำลังส่งข้อมูล...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>บันทึกและส่งข้อมูล</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}