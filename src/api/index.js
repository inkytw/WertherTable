import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore',
    timeout: 30 * 1000
});

export default instance;