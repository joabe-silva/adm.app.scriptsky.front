import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/AddRounded';
import Remove from '@material-ui/icons/RemoveRounded';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import TextField from '@material-ui/core/TextField';
import api from '../../services/api';
import './styles.css';

export default class Pedido extends Component {

  state = {
    pedido: [], 
    pedidoItens: [],
  };

  async componentDidMount(){
    const { cod_pedido } = this.props.match.params;
    const pedido = await api.get(`/pedido/${ cod_pedido }`);
    const pedidoItens = await api.get(`/pedido-itens/${ cod_pedido }`);

    console.log(pedido.data[0])
    console.log(pedidoItens.data.rows)

    this.setState({ pedido: pedido.data[0], pedidoItens: pedidoItens.data.rows });
  }
 
  voltar = () => {
    window.history.back()
  }

  render(){

    const { pedido, pedidoItens } = this.state;

    return (

      <div>
        <Fab onClick={ this.voltar } style={{ right: '20px' }} size="small" color="primary" aria-label="add">
          <ArrowBack />
        </Fab>
  
        <p>{ `Cod. Pedido: #${ pedido.cod_pedido }` }</p>
        <p>{ `Data Criação: ${ pedido.data_criacao }` }</p>
        <p>{ `Cliente: ${ pedido.cliente }` }</p>
        <p>{ `Observação: ${ pedido.observacao }`}</p>
        <p>{ `Valor Total: R$${ pedido.valor_total }`}</p>
        <p>{ `Forma de Pagamento: ${ pedido.forma_pagamento }`}</p>
        <p>{ `Situação: ${ pedido.situacao }`}</p>

        <p>Itens:</p>
        {
            pedidoItens.map(pedidoItens => (
              <p>{`${ pedidoItens.cod_produto } - ${ pedidoItens.titulo }`}</p>
            ))
        }
      </div>
    )

  }
  
}
