import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import UsuarioInexistente from '../alertas/usuario-inexistente';
import SenhaIncorreta from '../alertas/senha-incorreta'; 
import api from '../../services/api';

export default class Login extends Component {

    state = {
        email: '',
        senha: '',
        alerta: ''
    }

    setEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    setSenha = (event) => {
        this.setState({ senha: event.target.value });
    }
    
    login = () => {
        const usuario = {
            email: this.state.email,
            senha: this.state.senha
        }

        api.post('/login', usuario).then(res => {

            if(res.data === 'Usuario inexistente!') {
                if(this.state.alerta !== '') {
                    this.setState({ alerta: '' })
                    this.setState({ alerta: <UsuarioInexistente/> })
                } else {
                    this.setState({ alerta: <UsuarioInexistente/> })
                }
            } else {
                if(res.data === 'Senha incorreta!') {
                    if(this.state.alerta !== '') {
                        this.setState({ alerta: '' })
                        this.setState({ alerta: <SenhaIncorreta/> })
                    } else {
                        this.setState({ alerta: <SenhaIncorreta/> })
                    }
                } else {
                    localStorage.setItem('tokenScriptsky', res.data)
                    window.location.replace('/')
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });     
    }

    render() {

        const { alerta } = this.state;

        return (

            <div>
                <Card className="card">
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Login
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField type="email" id="email" label="E-mail" onChange={ this.setEmail } fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="password" id="senha" label="Senha" onChange={ this.setSenha } fullWidth/>
                            </Grid>
                        </Grid>   
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" onClick={ this.login } fullWidth>
                                    Entrar
                                </Button>
                                <br/>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>

                { alerta } 
            </div>
        )
    }

}