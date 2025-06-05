import axiosClient from "./axiosClient";
const ncdregistryApi = {
  getAppointments () {
    return axiosClient.get("/ncd_registry");
  },
  postAppointments(payload) {
    return axiosClient.post("/post_data_ncd_registry", payload);
}
};

export default ncdregistryApi;