import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import PedidosPendente from './components/pedidos-pendente';
import ProdutoCadastro from './components/produto-cadastro';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ Dashboard } />
            <Route path="/dashboard" component={ Dashboard } />
            <Route path="/pedidos-pendente" component={ PedidosPendente } />
            <Route path="/produto-cadastro" component={ ProdutoCadastro } />
        </Switch>
    </BrowserRouter>
);

export default Routes;