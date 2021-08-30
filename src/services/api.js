import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    baseURLOld: 'https://scriptsky-back.scriptsky.com.br/api/'
});

export default api;
