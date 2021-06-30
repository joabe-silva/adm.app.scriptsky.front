import axios from 'axios';

const api = axios.create({
    baseURLOld: 'http://localhost:8080/api/',
    baseURL: 'https://scriptsky-back.scriptsky.com.br/api/'
});

export default api;
