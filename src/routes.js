import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from './components/cliente/main';
import Item from './components/cliente/item';
import Itens from './components/cliente/itens';
import Carrinho from './components/cliente/carrinho';
import MeuPerfil from './components/cliente/meu-perfil';
import MeusPedidos from './components/cliente/meus-pedidos';
import PedidoItens from './components/cliente/pedido-itens';
import CadastroEntidade from './components/cliente/cadastro-entidade';
import CadastroEntidadeEndereco from './components/cliente/cadastro-entidade-endereco';
import EditarUsuario from './components/cliente/editar-usuario';
import EditarEndereco from './components/cliente/editar-endereco';
import Login from './components/cliente/login';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ Main } />
            <Route path="/item/:cod_produto" component={ Item } />
            <Route path="/itens/:cod_produto_grupo" component={ Itens } />
            <Route path="/carrinho" component={ Carrinho } />
            <Route path="/meu-perfil" component={ MeuPerfil } />
            <Route path="/meus-pedidos" component={ MeusPedidos } />
            <Route path="/pedido-itens/:cod_pedido" component={ PedidoItens } />
            <Route path="/cadastro-entidade" component={ CadastroEntidade } />
            <Route path="/cadastro-entidade-endereco" component={ CadastroEntidadeEndereco } />
            <Route path="/editar-usuario" component={ EditarUsuario } />
            <Route path="/editar-endereco" component={ EditarEndereco } />
            <Route path="/login" component={ Login } />
        </Switch>
    </BrowserRouter>
);

export default Routes;