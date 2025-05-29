import { preprocessTeleMedData } from "./preprocessTeleMedData";
import { buildColumnsWithFooter } from "./buildColumnsWithFooter";

export function getTableConfig(type, data) {


  if (type === "tele_med") {
    return preprocessTeleMedData(data); // คำนวณข้อมูล TeleMed เเละ สร้างคอลัมน์
    
  }

  return {
    data,
    columns: buildColumnsWithFooter(data), // คำนวณเเค่คอลัมน์
  };
}
