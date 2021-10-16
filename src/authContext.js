import React, { createContext } from 'react';
import api from './services/api'

const Context = createContext();

async function auth(){
    api.interceptors.request.use(
        config => {
            config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    const resp = await api.get('/verifica-token')
    if(resp.data === 'Token valido!') {
        return true
    } else {
        return false
    }
}  

console.log(auth())

function AuthProvider({ children }) {
    return(
        <Context.Provider value={{ isAuthenticated: true }}>
            { children }
        </Context.Provider>
    )
} 

export { Context, AuthProvider };  