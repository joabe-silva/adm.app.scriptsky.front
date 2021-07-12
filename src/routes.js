import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import PedidosPendente from './components/pedidos-pendente';
import ProdutoCadastro from './components/produto-cadastro';
import ProdutoPesquisa from './components/produto-pesquisa';
import ProdutoEditar from './components/produto-editar';
import GrupoCadastro from './components/grupo-cadastro';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ Dashboard } />
            <Route path="/dashboard" component={ Dashboard } />
            <Route path="/pedidos-pendente" component={ PedidosPendente } />
            <Route path="/produto-cadastro" component={ ProdutoCadastro } />
            <Route path="/produto-pesquisa" component={ ProdutoPesquisa } />
            <Route path="/produto-editar/:cod_produto" component={ ProdutoEditar } />
            <Route path="/grupo-cadastro" component={ GrupoCadastro } />
        </Switch>
    </BrowserRouter>
);

export default Routes;