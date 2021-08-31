import React, {Component} from 'react';
//import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
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
    situacoes: [{
      cod_situacao: 0,
      descricao: 'Pendente'
    },
    {
      cod_situacao: 1,
      descricao: 'Em andamento'
    },
    {
      cod_situacao: 2,
      descricao: 'Concluído'
    }],
    situacao: 0,
    data_inicial: '',
    data_final: ''
  }

  async componentDidMount(){
    this.pedidos();
    this.pegaData();
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

  pegaData = () => {
    const data = new Date();
    const dia = data.getDate();
    const mes = (data.getMonth()+1).toString();
    const ano = data.getFullYear();
    
    if(mes.length < 2) {
      const data = `${ ano }-0${ mes}-${ dia }`
      this.setState({ data_inicial: data, data_final: data });
    } else {
      const data = `${ ano }-${ mes }-${ dia }`
      this.setState({ data_inicial: data, data_final: data });
    }
  }

  setSituacao = (event) => {
    this.setState({ situacao: event.target.value });
  }

  setDataInicial = (event) => {
    this.setState({ data_inicial: event.target.value });
  }

  setDataFinal = (event) => {
    this.setState({ data_final: event.target.value });
  }
   
  pesquisa = () => {
    console.log(`Data Inicial: ${this.state.data_inicial} Data Final: ${this.state.data_final} situacao: ${this.state.situacao}`)
  } 
  

  render(){

    const { pedidos, situacoes, situacao, data_inicial, data_final } = this.state;

    return (
      
      <div>
        <Grid container spacing={2}>
          <Grid item sm={4} xs={12}>
            <TextField
              id="date"
              label="Data Inicial"
              type="date"
              value={ data_inicial }
              onChange={ this.setDataInicial }
              InputLabelProps={{
                shrink: true,
              }}
            /> 
          </Grid>
          <Grid item sm={4} xs={12}>
            <TextField
              id="date"
              label="Data Final"
              type="date"
              value={ data_final }
              onChange={ this.setDataFinal }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item sm={4} xs={8}>
            <FormControl fullWidth>
              <InputLabel>Situação</InputLabel>
              <Select value={ situacao } onChange={ this.setSituacao } >
                {situacoes.map(situacoes => (
                  <MenuItem value={ situacoes.cod_situacao } key={ situacoes.cod_situacao }>
                    { situacoes.descricao }
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
        </Grid> 

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
