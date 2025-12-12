import axiosClient from "./axiosClient";
const hdccheckAPI = {
getAppointments(budgetYear) {
  return axiosClient.get("/api/hdc_check/get_data", { params: { budget_year: budgetYear } });
}
,
  postAppointments(payload) {
    return axiosClient.post("/api/hdc_check/insert_data", payload);
},
getReportS_OPD(params) {
  return axiosClient.post("/api/hdc_check/report_data",  params );
}
};

export default hdccheckAPI;