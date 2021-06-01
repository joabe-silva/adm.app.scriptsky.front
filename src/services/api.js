import axios from 'axios';

const api = axios.create({
    baseURL: 'https://scriptsky-back.scriptsky.com.br/api/'
});

export default api;
