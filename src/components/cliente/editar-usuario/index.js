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
    nome: '',
    contato: '',
    email: '',
    senha: '',
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

      const result = await api.get('/entidade/'+cod_entidade);

      //Verifica se o usuario possui pedidos
      if(result.data.length !== 0) {
        //Verifica se o token é valido
        if(result.data === 'Token invalido! Favor fazer login novamente.') {
          window.location.replace('/login')
        } else {
          this.setState({ nome: result.data[0].nome.trim(), contato: result.data[0].contato.trim(), email: result.data[0].email.trim(), senha: result.data[0].senha.trim() });
        } 
      } 
      
    }

  }

  onChangeNome = () => {

    const nome = document.getElementById('nome').value
    this.setState({ nome: nome });

  }
  onChangeContato = () => {

    const contato = document.getElementById('contato').value
    this.setState({ contato: contato });

  }
  onChangeEmail = () => {

    const email = document.getElementById('email').value
    this.setState({ email: email });

  }
  onChangeSenha = () => {

    const senha = document.getElementById('senha').value
    this.setState({ senha: senha });

  }

  onClickAtualizar = () => {

    this.setState({ alerta: '' })

    const nome    = document.getElementById('nome').value
    const contato = document.getElementById('contato').value
    const email   = document.getElementById('email').value
    const senha   = document.getElementById('senha').value

    const usuario = {
      nome: nome,
      contato: contato,
      email: email,
      senha: senha
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

    api.put('/editar-entidade-cliente/'+cod_entidade, usuario).then(function (res) {
      console.log(res.data)
    });

    if(this.state.alerta !== '') {
      this.setState({ alerta: '' })
    } else {
      this.setState({ alerta: <AlertDadosAtualizados /> })
    }
    
  }

  render(){

    const { nome, contato, email, senha, alerta } = this.state;

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
                Usuário
              </Typography>
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField id="nome" label="Nome" value={ nome } onChange={ this.onChangeNome } required fullWidth/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField id="contato" label="Contato" value={ contato } onChange={ this.onChangeContato } required fullWidth/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField type="email" id="email" label="E-mail" value={ email } onChange={ this.onChangeEmail } required fullWidth/>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField type="password" id="senha" label="Senha" value={ senha } onChange={ this.onChangeSenha } required fullWidth/>
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
