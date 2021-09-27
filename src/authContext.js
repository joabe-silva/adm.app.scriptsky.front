import React, { createContext } from 'react';
import api from './services/api'

const Context = createContext();

async function auth(){
    if(localStorage.getItem('tokenScriptsky') === null) {
        return false
    } else {
        api.interceptors.request.use(
            config => {
                config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        const res = await api.get('/verifica-token')
        if(res.data === 'Token valido!') {
            return true
        } else {
            return false
        }
    } 
}

function AuthProvider({ children }) {
    return(
        <Context.Provider value={{ isAuthenticated: auth() }}>
            { children }
        </Context.Provider>
    )
}

export { Context, AuthProvider };