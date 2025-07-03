import axiosClient from './axiosClient';

const telemedApi = {

  getAppointments() {  // get นั้นเเหละ
    return axiosClient.get('/api/tele_med');
  },
  postAppointments(payload) {
    return axiosClient.post("/api/post_data_tele_med", payload);
}
};

export default telemedApi;