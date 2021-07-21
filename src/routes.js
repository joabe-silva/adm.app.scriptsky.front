import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import CriarPedido from './components/criar-pedido';
import Item from './components/item';
import Pedidos from './components/pedidos';
import ProdutoCadastro from './components/produto-cadastro';
import ProdutoPesquisa from './components/produto-pesquisa';
import ProdutoEditar from './components/produto-editar';
import GrupoCadastro from './components/grupo-cadastro';
import GrupoPesquisa from './components/grupo-pesquisa';
import GrupoEditar from './components/grupo-editar';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ Dashboard } />
            <Route path="/dashboard" component={ Dashboard } />
            <Route path="/criar-pedido" component={ CriarPedido } />
            <Route path="/item/:cod_produto" component={ Item } />
            <Route path="/pedidos" component={ Pedidos } />
            <Route path="/produto-cadastro" component={ ProdutoCadastro } />
            <Route path="/produto-pesquisa" component={ ProdutoPesquisa } />
            <Route path="/produto-editar/:cod_produto" component={ ProdutoEditar } />
            <Route path="/grupo-cadastro" component={ GrupoCadastro } />
            <Route path="/grupo-pesquisa" component={ GrupoPesquisa } />
            <Route path="/grupo-editar/:cod_grupo" component={ GrupoEditar } />
        </Switch>
    </BrowserRouter>
);

export default Routes;