import axiosClient from './axiosClient';

const telemedApi = {

  getAppointments() {  // get นั้นเเหละ
    return axiosClient.get('/api/tele_med');
  },
 
};

export default telemedApi;