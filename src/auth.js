import api from './services/api';

export const isAuthenticated = () => {
    api.interceptors.request.use(
        config => {
            config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
    
    api.get('/verifica-token').then(function (res) {
        if(res.data === 'Token invalido! Favor fazer login novamente.' || res.data === 'Sua sessão inspirou! Favor fazer login novamente.') {
            console.log(res)
            return false
        } 
    }).catch(function (error) {
        //console.log(error)
        //return true
    });
} 