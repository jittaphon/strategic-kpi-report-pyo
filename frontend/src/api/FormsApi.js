import axiosClient from "./axiosClient";
const FormsApi = {

  postAppointments(payload) {
    return axiosClient.post("/api/forms/insert", payload);
}
};

export default FormsApi;