import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './authContext';
import { Context } from './authContext';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Carrinho from './components/carrinho';
import CriarPedido from './components/criar-pedido';
import Item from './components/item';
import Pedidos from './components/pedidos';
import ProdutoCadastro from './components/produto-cadastro';
import ProdutoPesquisa from './components/produto-pesquisa';
import ProdutoEditar from './components/produto-editar';
import GrupoCadastro from './components/grupo-cadastro';
import GrupoPesquisa from './components/grupo-pesquisa';
import GrupoEditar from './components/grupo-editar';

const PrivateRoute = ({component: Component, ...rest}) => {
    const { isAuthenticated } = useContext(Context);

    return (
        <Route {...rest} render={props => (
            isAuthenticated ?
                <Component {...props} />
            : <Redirect to="/login" />
        )} />
    );
};

const Routes = () => (
    <BrowserRouter>
        <Switch> 
            <AuthProvider>
                <Route path="/login" component={ Login } /> 
                <Route exact path="/" component={ Login } />
                <PrivateRoute path="/dashboard" component={ Dashboard } />
                <PrivateRoute path="/carrinho" component={ Carrinho } />
                <PrivateRoute path="/criar-pedido" component={ CriarPedido } />
                <PrivateRoute path="/item/:cod_produto" component={ Item } />
                <PrivateRoute path="/pedidos" component={ Pedidos } />
                <PrivateRoute path="/produto-cadastro" component={ ProdutoCadastro } />
                <PrivateRoute path="/produto-pesquisa" component={ ProdutoPesquisa } />
                <PrivateRoute path="/produto-editar/:cod_produto" component={ ProdutoEditar } />
                <PrivateRoute path="/grupo-cadastro" component={ GrupoCadastro } />
                <PrivateRoute path="/grupo-pesquisa" component={ GrupoPesquisa } />
                <PrivateRoute path="/grupo-editar/:cod_grupo" component={ GrupoEditar } /> 
            </AuthProvider>
        </Switch>
    </BrowserRouter>
);

export default Routes;