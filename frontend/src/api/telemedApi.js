import axiosClient from './axiosClient';

const telemedApi = {

  getAppointments() {  // get นั้นเเหละ
    return axiosClient.get('/api/tele_med');
  },
  getAppointmentsV2(budgetYear ) {  // get นั้นเเหละ
    return axiosClient.get('/api/tele_med_v2',{ params: { budget_year: budgetYear }});
  },
  postAppointments(payload) {
    return axiosClient.post("/api/post_data_tele_med", payload);
}
};

export default telemedApi;