import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import Divider from '@material-ui/core/Divider';
import api from '../../../services/api';
import jwt from 'jwt-decode';
import './styles.css';

export default class PedidoItens extends Component {

  state = {
    itens: [],
    url_storage: '',
    url_complet: '',
  }

  async componentDidMount(){

    const { cod_pedido } = this.props.match.params;

    if(localStorage.getItem('tokenScriptsky') === null) {
      window.location.replace('/login')
    } else {
      //Configura token no cabecalho da requisicao
      api.interceptors.request.use(
        config => {
            config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
            return config;
        },
        error => {
            return Promise.reject(error);
        }
      );
    }

    const { cod_entidade } = jwt(localStorage.getItem('tokenScriptsky'))

    const getPedido = await api.get(`/pedido/${ cod_pedido }`);

    if(getPedido.data !== 'Token invalido! Favor fazer login novamente.') {
      if(getPedido.data[0].cod_entidade === cod_entidade) {

        const result = await api.get(`/pedido-itens/${ cod_pedido }`);

        const parametro = await api.get('/parametro');
  
        if(result.data === 'Token invalido! Favor fazer login novamente.') {
          window.location.replace('/login')
        } else {
          this.setState({ itens: result.data.rows, url_storage: parametro.data[0].url_storage.trim(), url_complet: parametro.data[0].url_complet.trim() });
        }
  
      } else {
        window.location.replace('/meus-pedidos')
      }
    } else {
      window.location.replace('/login')
    }

  }

  render(){

    const { itens, url_storage, url_complet } = this.state;

    return (
      <div>
        <Link to={'/meus-pedidos'}>
          <Fab size="small" color="primary" aria-label="add">
            <ArrowBack />
          </Fab>
        </Link>
        
        <List className="list">
            {
              itens.map(itens => (

                <Link to={`/item/${ itens.cod_produto }`} key={ itens.cod_produto } style={{ textDecoration: 'none', color: 'black', }}>
                    <ListItem button className="itens">
                      <ListItemIcon className="imagemspc">
                          <img src={`${ url_storage }${ itens.imagem.trim() }${ url_complet }`} alt={ itens.titulo } className="imagem" />
                      </ListItemIcon>
                      <ListItemText 
                          className="titulo"
                          primary={ itens.titulo }
                          secondary={`${ itens.quantidade }X Total R$ ${ itens.valor_total }`}
                      />
                      <ListItemText 
                        className="titulo"
                        primary={`Obs: ${ itens.observacao }`}
                      />
                    </ListItem>
                    <Divider />
                </Link>

              ))
            }
          </List>
      </div>
      
    )

  }
  
}
