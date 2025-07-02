import { preprocessTeleMedData } from "./preprocessTeleMedData";
import { buildColumnsWithFooter } from "./buildColumnsWithFooter";

export function getTableConfig(type, data,apiTotals,date) {


  if (type === "tele_med") {
    return preprocessTeleMedData(data,apiTotals,date); // คำนวณข้อมูล TeleMed เเละ สร้างคอลัมน์
    
  }

  return {
    data,
    columns: buildColumnsWithFooter(data), // คำนวณเเค่คอลัมน์
  };
}
