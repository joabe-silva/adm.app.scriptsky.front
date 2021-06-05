import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import PedidosPendente from './components/pedidos-pendente';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ Dashboard } />
            <Route path="/dashboard" component={ Dashboard } />
            <Route path="/pedidos-pendente" component={ PedidosPendente } />
        </Switch>
    </BrowserRouter>
);

export default Routes;