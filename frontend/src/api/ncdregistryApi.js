import axiosClient from "./axiosClient";
const ncdregistryApi = {
  getAppointments () {
    return axiosClient.get("/api/ncd_registry");
  },
  postAppointments(payload) {
    return axiosClient.post("/api/post_data_ncd_registry", payload);
}
};

export default ncdregistryApi;