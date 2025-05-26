import axiosClient from './axiosClient';

const telemedApi = {
  getAppointments() {  // get นั้นเเหละ
    return axiosClient.get('/tele_med');
  },
 
};

export default telemedApi;