import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//import Remove from '@material-ui/icons/RemoveRounded';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import api from '../../services/api';
import './styles.css';

export default class Pedido extends Component {

  state = {
    pedido: [], 
    pedidoItens: [],
    situacoes: [{
      cod_situacao: 0,
      titulo: 'Pendente'
    },
    {
      cod_situacao: 1,
      titulo: 'Em andamento'
    },
    {
      cod_situacao: 2,
      titulo: 'Concluído'
    },
    {
      cod_situacao: 3,
      titulo: 'Cancelado'
    }],
    situacao: 0,
  };

  async componentDidMount(){
    const { cod_pedido } = this.props.match.params;
    const pedido = await api.get(`/pedido/${ cod_pedido }`);
    const pedidoItens = await api.get(`/pedido-itens/${ cod_pedido }`);

    //console.log(pedido.data[0])
    //console.log(pedidoItens.data.rows) 

    if(pedido.data[0] === 'Token invalido! Favor fazer login novamente.' || pedido.data[0] === 'Sua sessão inspirou! Favor fazer login novamente.') {
      window.location.replace('/login');
    } else {
      this.setState({ pedido: pedido.data[0], pedidoItens: pedidoItens.data.rows });
    } 
  }
 
  async alteraSituacao(situacao) {
    api.interceptors.request.use(
      config => {
          config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
          return config;
      },
      error => {
          return Promise.reject(error);
      }
    );

    const pedido = await api.put(`/editar-pedido/${ this.state.pedido.cod_pedido }`, { situacao: situacao });
    console.log(pedido.data)
  }

  setSituacao = (event) => {
    this.setState({ situacao: event.target.value });
    this.alteraSituacao(event.target.value)
  }

  voltar = () => {
    window.history.back()
  }

  render(){

    const { pedido, pedidoItens, situacoes, situacao } = this.state;

    return (

      <div>
        <Fab onClick={ this.voltar } style={{ right: '20px' }} size="small" color="primary" aria-label="add">
          <ArrowBack />
        </Fab>

        <br/>
        <br/>
        <Card elevation={4}> 
          <CardContent>
            <Grid container spacing={1}>
              <Grid item sm={3} xs={2}>
                <Typography variant="h6" gutterBottom component="div">
                  { `#${ pedido.cod_pedido }` }
                </Typography>
              </Grid>
              <Grid item sm={4} xs={5}>
                <Typography variant="h6" gutterBottom component="div">
                  { pedido.cliente }
                </Typography>
              </Grid>
              <Grid item sm={5} xs={5}>
                <Typography variant="h6" gutterBottom component="div">
                  { pedido.data_criacao }
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item sm={3} xs={6}>
                <Typography variant="h6" className="vPedido" gutterBottom component="div">
                  { `R$ ${ pedido.valor_total }`}
                </Typography>
              </Grid>
              <Grid item sm={4} xs={6}>
                <Typography variant="h6" className="fPagamento" gutterBottom component="div">
                  { pedido.forma_pagamento }
                </Typography>
              </Grid>
              <Grid item sm={5} xs={12}>
                <FormControl required fullWidth>
                  <Select value={ situacao } onChange={ this.setSituacao } >
                      {situacoes.map(situacoes => (
                          <MenuItem value={ situacoes.cod_situacao } key={ situacoes.cod_situacao }>
                              { situacoes.titulo }
                          </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  { `Obs: ${ pedido.observacao }`}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <List className="list" component="nav"
          subheader={
            <ListSubheader component="div">
              Itens
            </ListSubheader>
          }
        >
          {
            pedidoItens.map(pedidoItens => (
              <div>
                <ListItem button className="itens">
                    <ListItemText 
                      className="titulo"
                      primary={`${ pedidoItens.quantidade }x - ${ pedidoItens.titulo } - Total R$ ${ pedidoItens.valor_total }`}
                      secondary={`Obs: ${ pedidoItens.observacao }`}
                    />
                </ListItem>
                <Divider />
              </div>
            ))
          }
        </List>
      </div>
    )

  }
  
}
