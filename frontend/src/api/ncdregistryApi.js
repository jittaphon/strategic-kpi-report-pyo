import axiosClient from "./axiosClient";
const ncdregistryApi = {
  getAppointments () {
    return axiosClient.get("/ncd_registry");
  },
};

export default ncdregistryApi;