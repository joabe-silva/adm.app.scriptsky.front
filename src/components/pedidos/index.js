import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import api from '../../services/api';
import './styles.css';

export default class Pedidos extends Component {

  state = {
    pedidos: [],
    situacao: 0,
  }

  async componentDidMount(){
    this.pedidos();
  }

  async pedidos() {
    api.interceptors.request.use(
      config => {
          config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
          return config;
      },
      error => {
          return Promise.reject(error);
      }
    );
    
    const pedidos = await api.get(`/pedidos/${ this.state.situacao }`);

    if(pedidos.data === 'Token invalido! Favor fazer login novamente.') {
      window.location.replace('/login');
    } else {
      this.setState({ pedidos: pedidos.data });
    }
  }

  /* 
  pesquisaPorSituacao = () => {
    if(this.state.grupo !== '') {
      api.get(`/pedidos/${ this.state.situacao }`).then(produtos => {
        this.setState({ produtos: produtos.data.rows });
      });
    } 
  } 
  */

  render(){

    const { pedidos } = this.state;

    return (
      
      <div>
        {/* <Grid container spacing={2}>
          <Grid item sm={5} xs={12}>
            <TextField type="text" id="pesquisa" label="Pesquisa..." value={ titulo } onChange={ this.setTitulo } fullWidth/>
          </Grid>
          <Grid item sm={5} xs={8}>
            <FormControl fullWidth>
              <InputLabel>Grupo de Produtos</InputLabel>
              <Select value={ grupo } onChange={ this.setGrupo } >
                {grupos.map(grupos => (
                  <MenuItem value={ grupos.cod_produto_grupo } key={ grupos.cod_produto_grupo }>
                    { grupos.titulo }
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={2} xs={4}>
            <Button 
              type="buttom" 
              variant="contained" 
              color="primary" 
              onClick={ this.pesquisa }
            >
              Pesquisa
            </Button>
          </Grid>
        </Grid> */}

        <List className="list"
          subheader={
            <ListSubheader component="div">
              Pedidos
            </ListSubheader>
          }
        >
          {
            pedidos.map(pedidos => (
              <div>
                <Card className="pedidos" elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Joabe Silva
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body1" gutterBottom>
                          {`R$ ${ pedidos.valor_total}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={8} sm={4}>
                        <Typography variant="body1" gutterBottom>
                          { pedidos.data_criacao }
                        </Typography>
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <Typography variant="body1" className="pedido-situacao" gutterBottom>
                          { pedidos.situacao }
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={2} className="cor">
                        <ArrowIcon className="pedido-icon"/>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            ))
          }
        </List>
      </div>
    
    )

  }
  
}
