import React, { useEffect, useState } from "react";
import { User, Building2, Briefcase, Heart, BookOpen, GraduationCap, Save, CheckCircle2, Loader2, AlertCircle, PartyPopper } from "lucide-react";
import { API } from "../../api";

export default function FormA() {
  const [loading, setLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(() => {
    // เช็คว่าเคยปิด popup ไปแล้วหรือยัง
    const hasSeenPopup = localStorage.getItem('hasSeenFormPopup');
    return !hasSeenPopup;
  });
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    first_name: "",
    last_name: "",
    health_unit: "",
    affiliation: "",
    interest_topic: "",
    training_format: "",
    type: "survey-hdc-2569"
  });

  const handleClosePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      localStorage.setItem('hasSeenFormPopup', 'true');
      setIsClosing(false);
    }, 300);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // ลบ error เมื่อผู้ใช้เริ่มกรอกข้อมูล
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "กรุณาเลือกคำนำหน้า";
    if (!formData.first_name.trim()) newErrors.first_name = "กรุณากรอกชื่อ";
    if (!formData.last_name.trim()) newErrors.last_name = "กรุณากรอกนามสกุล";
    if (!formData.health_unit) newErrors.health_unit = "กรุณาเลือกหน่วยบริการสุขภาพ";
    if (!formData.affiliation) newErrors.affiliation = "กรุณาเลือกสังกัด";
    if (!formData.training_format) newErrors.training_format = "กรุณาเลือกรูปแบบการอบรม";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const hospitalResponse = await API.utilsAPI.getHospitalAppointments();
  

      setHospitalData(hospitalResponse.data.data);
   

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
      title: "",
      first_name: "",
      last_name: "",
      health_unit: "",
      affiliation: "",
      interest_topic: "",
      training_format: ""
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

  // Success Page
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              บันทึกคำตอบของคุณแล้ว
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              ขอบคุณสำหรับการกรอกแบบฟอร์ม!
            </p>

            {/* Decorative Line */}
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full mb-8"></div>

            {/* Response Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-100">
              <p className="text-sm text-gray-600 mb-3">สรุปข้อมูลที่ส่ง:</p>
              <div className="space-y-2 text-left">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">ชื่อ:</span> {formData.title}{formData.first_name} {formData.last_name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">หน่วยบริการสุขภาพ:</span> {formData.health_unit}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">สังกัด:</span> {formData.affiliation}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">รูปแบบการอบรม:</span> {formData.training_format === "onsite" ? "อบรม ณ สถานที่จริง (Onsite)" : "อบรมออนไลน์ (Online)"}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSubmitAnother}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              ส่งคำตอบอื่น
            </button>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 mt-8">
              หากต้องการแก้ไขคำตอบ กรุณาติดต่อเจ้าหน้าที่
            </p>
          </div>

          {/* Decorative Elements */}
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
      {/* Popup Modal - แสดงครั้งแรกที่เข้าหน้า */}
      {showPopup && (
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div 
            className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
              isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-t-2xl">
              <div className="flex items-center gap-3 text-white">
                <AlertCircle className="w-8 h-8 flex-shrink-0" />
                <h2 className="text-2xl font-bold">วัตถุประสงค์การลงทะเบียน</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                <p className="text-gray-700 leading-relaxed text-base">
                  <span className="font-bold text-amber-700 text-lg">📌 วัตถุประสงค์ครั้งนี้เพื่อ:</span>
                  <br /><br />
                  สสจ.จะนับยอดจำนวนผู้ต้องการเข้าร่วมอบรมแบบ Onsite เพื่อเตรียมแผนในการขออนุมัติงบประมาณในการจัดอบรม 
                  <br /><br />
                  ดังนั้นท่านที่ลงทะเบียนว่าต้องการมาอบรม ณ ห้องประชุม สสจ.พะเยา (Onsite) 
                  หากท่านไม่ได้มาร่วมอบรมในวันจัดอบรม 43 เเฟ้ม เเละ HDC ปีงบ 2569{" "}
                  <span className="font-semibold text-amber-700">ขอให้ท่านส่งตัวแทนเข้าร่วมอบรมด้วยนะคะ</span>
                  <br /><br />
                  โดยจะจัดอบรมประมาณเดือน{" "}
                  <span className="font-bold text-amber-700 text-lg">ธันวาคม 2568</span>
                </p>
              </div>

              {/* Button */}
              <button
                onClick={handleClosePopup}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>รับทราบและดำเนินการต่อ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
         <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
     
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-t-4 border-blue-500">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
        ลงทะเบียนสำรวจประเภทความต้องการเข้าร่วมประชุม <br />HDC  และ 43 แฟ้ม ปี 2569
      </h1>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">📋 คำแนะนำ:</span> กรุณากรอกข้อมูลให้ครบถ้วนและตรวจสอบความถูกต้องก่อนส่งแบบฟอร์ม
            </p>
          </div>
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">กรุณากรอกข้อมูลให้ครบถ้วน</p>
              <p className="text-sm text-red-700">มีช่องที่จำเป็นต้องกรอกที่ยังไม่ได้กรอกข้อมูล</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* ข้อมูลส่วนตัว */}
            <div className="border-l-4 border-blue-500 pl-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                ข้อมูลส่วนตัว
              </h2>
            </div>

            {/* คำนำหน้า, ชื่อ, นามสกุล */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำนำหน้า <span className="text-red-500">*</span>
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                >
                  <option value="">เลือกคำนำหน้า</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                </select>
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="กรอกชื่อ"
                  className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.first_name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="กรอกนามสกุล"
                  className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                    errors.last_name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* หน่วยงาน */}
            <div className="border-l-4 border-indigo-500 pl-4 mb-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-500" />
                ข้อมูลหน่วยงาน
              </h2>
            </div>

            {/* หน่วยบริการสุขภาพ (Dropdown) */}
            <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    หน่วยบริการสุขภาพที่ท่านปฏิบัติงาน <span className="text-red-500">*</span>
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
         {/* สังกัด (Dropdown) */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    สังกัด <span className="text-red-500">*</span>
  </label>
  <select
    name="affiliation"
    value={formData.affiliation === 'อื่นๆ' ? 'อื่นๆ' : (formData.affiliation && !['กระทรวงสาธารณสุข', 'องค์การบริหารส่วนจังหวัดพะเยา', 'เทศบาล', 'รพ.ค่ายขุนเจืองฯ', 'รพ.มหาวิทยาลัยพะเยา'].includes(formData.affiliation) ? 'อื่นๆ' : formData.affiliation)}
    onChange={handleChange}
    className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
      errors.affiliation ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
    } ${!formData.affiliation && 'text-gray-400'}`}
  >
    <option value="" disabled hidden className="text-gray-400">เลือกสังกัด</option>
    <option value="กระทรวงสาธารณสุข" className="text-gray-900">กระทรวงสาธารณสุข</option>
    <option value="องค์การบริหารส่วนจังหวัดพะเยา" className="text-gray-900">องค์การบริหารส่วนจังหวัดพะเยา</option>
    <option value="เทศบาล" className="text-gray-900">เทศบาล</option>
    <option value="รพ.ค่ายขุนเจืองฯ" className="text-gray-900">รพ.ค่ายขุนเจืองฯ</option>
    <option value="รพ.มหาวิทยาลัยพะเยา" className="text-gray-900">รพ.มหาวิทยาลัยพะเยา</option>
    <option value="อื่นๆ" className="text-gray-900">อื่นๆ</option>
  </select>
  
  {(formData.affiliation === 'อื่นๆ' || (formData.affiliation && !['กระทรวงสาธารณสุข', 'องค์การบริหารส่วนจังหวัดพะเยา', 'เทศบาล', 'รพ.ค่ายขุนเจืองฯ', 'รพ.มหาวิทยาลัยพะเยา', ''].includes(formData.affiliation))) && (
    <input
      type="text"
      name="affiliation"
      value={formData.affiliation === 'อื่นๆ' ? '' : formData.affiliation}
      onChange={handleChange}
      placeholder="กรุณาระบุสังกัด"
      className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 transition-all outline-none border-gray-200 focus:border-blue-500 mt-3"
    />
  )}
  
  {errors.affiliation && (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {errors.affiliation}
    </p>
  )}
</div>

            {/* ความสนใจ */}
            <div className="border-l-4 border-purple-500 pl-4 mb-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                
             ท่านต้องการให้อบรมเรื่องอะไร ( เรื่องอะไรที่ต้องการทราบเพิ่มเติม ) <span className="text-gray-400 text-xs"></span> <span className="text-red-500">* ห้ามว่าง</span>
              </h2>
            </div>

            {/* เรื่องที่สนใจ (Text Area) - ไม่บังคับ */}
            <div>
             
              <textarea
                name="interest_topic"
                value={formData.interest_topic}
                onChange={handleChange}
                rows={4}
                placeholder="กรุณาระบุเรื่องที่ท่านสนใจในการอบรม เช่น การจัดการข้อมูล 43 แฟ้ม, คุณภาพข้อมูล HDC, การวิเคราะห์ข้อมูลสุขภาพ ฯลฯ"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                สามารถระบุหลายหัวข้อหรือรายละเอียดเพิ่มเติมได้
              </p>
            </div>

           {/* รูปแบบการอบรม */}
<div>
  <div className="border-l-4 border-purple-500 pl-4 mb-6 mt-8">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      ปีงบ 2569 นี้ สสจ.พะเยาจะจัดอบรมเกี่ยวกับ HDC และ 43 แฟ้ม ท่านต้องการเข้าร่วมอบรมในรูปแบบใด<span className="text-red-500">*</span>
    </h2>
  </div>
  
  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 mb-4">
    <p className="text-sm text-gray-700 leading-relaxed">
      <span className="font-semibold text-amber-700">📌 หมายเหตุ:</span> สสจ.จะนับยอดจำนวนผู้ต้องการเข้าร่วมอบรมแบบ Onsite เพื่อเตรียมแผนในการขออนุมัติงบประมาณในการจัดอบรม ดังนั้นท่านที่ลงทะเบียนว่าต้องการมาอบรม ณ ห้องประชุม สสจ.พะเยา (Onsite) หากท่านไม่ได้มาร่วมอบรมในวันจัดอบรม ขอให้ท่านส่งตัวแทนเข้าร่วมอบรมด้วยนะค่ะ โดยจะจัดอบรมประมาณเดือน ธันวาคม 2568
    </p>
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group ${
      errors.training_format ? 'border-red-500' : 'border-gray-200'
    }`}>
      <input
        type="radio"
        name="training_format"
        value="onsite"
        checked={formData.training_format === "onsite"}
        onChange={handleChange}
        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-600">
        ฉันต้องการ อบรม ณ ห้องประชุม สสจ.พะเยา (Onsite)
      </span>
    </label>

    <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group ${
      errors.training_format ? 'border-red-500' : 'border-gray-200'
    }`}>
      <input
        type="radio"
        name="training_format"
        value="online"
        checked={formData.training_format === "online"}
        onChange={handleChange}
        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-600">
       ฉันต้องการ อบรมออนไลน์ ทาง ZOOM (Online)
      </span>
    </label>
  </div>
  {errors.training_format && (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {errors.training_format}
    </p>
  )}
</div>
            {/* Submit Button */}
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