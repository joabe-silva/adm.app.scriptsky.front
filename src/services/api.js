import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.0.105:8080/api/',
    baseURLOld: 'https://scriptsky-back.scriptsky.com.br/api/'
});

export default api;
