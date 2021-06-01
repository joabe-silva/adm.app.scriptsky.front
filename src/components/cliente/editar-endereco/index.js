import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AlertDadosAtualizados from '../alert-success-dados-atualizados';
import api from '../../../services/api';
import jwt from 'jwt-decode';
import './styles.css';

export default class EditarUsuario extends Component {

  state = {
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
    alerta: '',
  }

  async componentDidMount(){

    //Verifica se o usuario esta logado
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

      const { cod_entidade } = jwt(localStorage.getItem('tokenScriptsky'))

      const result = await api.get('/endereco-entidade/'+cod_entidade);

      //Verifica se o usuario possui pedidos
      if(result.data.length !== 0) {
        //Verifica se o token é valido
        if(result.data === 'Token invalido! Favor fazer login novamente.') {
          window.location.replace('/login')
        } else {
          if(!result.data[0].complemento) {
            this.setState({ endereco: result.data[0].endereco.trim(), numero: result.data[0].numero, complemento: '', bairro: result.data[0].bairro.trim(), cep: result.data[0].cep.trim() });
          } else {
            this.setState({ endereco: result.data[0].endereco.trim(), numero: result.data[0].numero, complemento: result.data[0].complemento.trim(), bairro: result.data[0].bairro.trim(), cep: result.data[0].cep.trim() });
          }
          
        } 
      } 
      
    }

  }

  onChangeEndereco = () => {

    const endereco = document.getElementById('endereco').value
    this.setState({ endereco: endereco });

  }
  onChangeNumero = () => {

    const numero = document.getElementById('numero').value
    this.setState({ numero: numero });

  }
  onChangeComplemento = () => {

    const complemento = document.getElementById('complemento').value
    this.setState({ complemento: complemento });

  }
  onChangeBairro = () => {

    const bairro = document.getElementById('bairro').value
    this.setState({ bairro: bairro });

  }
  onChangeCEP = () => {

    const cep = document.getElementById('cep').value
    this.setState({ cep: cep });

  }

  onClickAtualizar = () => {

    this.setState({ alerta: '' })

    const endereco    = document.getElementById('endereco').value
    const numero      = document.getElementById('numero').value
    const complemento = document.getElementById('complemento').value
    const bairro      = document.getElementById('bairro').value
    const cep         = document.getElementById('cep').value

    const entidade_end = {
      endereco: endereco,
      numero: numero,
      complemento: complemento,
      bairro: bairro,
      cep: cep,
      cidade: this.state.cidade,
      estado: this.state.estado,
    }

    api.interceptors.request.use(
      config => {
          config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
          return config;
      },
      error => {
          return Promise.reject(error);
      }
    );
    
    const { cod_entidade } = jwt(localStorage.getItem('tokenScriptsky'))

    api.put('/editar-endereco-entidade/'+cod_entidade, entidade_end).then(function (res) {
      
      if(res.data === 'Token invalido! Favor fazer login novamente.') {
        window.location.replace('/login')
      } else {
        console.log(res.data)
      } 

    });

    if(this.state.alerta !== '') {
      this.setState({ alerta: '' })
    } else {
      this.setState({ alerta: <AlertDadosAtualizados /> })
    }
    
  }

  render(){

    const { endereco, numero, complemento, bairro, cep, alerta } = this.state;

    return (
      
      <div>

          <Link to={'/meu-perfil'}>
            <Fab size="small" color="primary" aria-label="add">
              <ArrowBack />
            </Fab>
          </Link>

          <Card className="card">
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Endereço
              </Typography>
              <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField id="endereco" label="Endereco" value={ endereco } onChange={ this.onChangeEndereco } required fullWidth/>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField id="numero" label="Numero" value={ numero } onChange={ this.onChangeNumero } required fullWidth/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField id="complemento" label="Complemento" value={ complemento } onChange={ this.onChangeComplemento } fullWidth/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField id="bairro" label="Bairro" value={ bairro } onChange={ this.onChangeBairro } required fullWidth/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField id="cep" label="CEP" value={ cep } onChange={ this.onChangeCEP } required fullWidth/>
                  </Grid>
              </Grid>  
            </CardContent>
            <br />
            <CardActions>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button type="buttom" variant="contained" color="primary" onClick={ this.onClickAtualizar } fullWidth>
                      Atualizar
                    </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card> 
          
          { alerta }

      </div>
    
    )

  }
  
}
