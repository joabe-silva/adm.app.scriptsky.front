import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AlertErroUsuarioSenha from '../alert-erro-usuario-senha';
import AlertErroSenha from '../alert-erro-senha';
import api from '../../../services/api';

export default class Login extends Component {

    state = {
        alerta: ''
    }
    
    login = () => {

        const usuario = {
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        }
    
        api.post('/login', usuario).then(res => {

            if(res.data === 'Usuario inexistente!') {
                if(this.state.alerta !== '') {
                    this.setState({ alerta: '' })
                    this.setState({ alerta: <AlertErroUsuarioSenha/> })
                } else {
                    this.setState({ alerta: <AlertErroUsuarioSenha/> })
                }
            } else {
                if(res.data === 'Senha incorreta!') {
                    if(this.state.alerta !== '') {
                        this.setState({ alerta: '' })
                        this.setState({ alerta: <AlertErroSenha/> })
                    } else {
                        this.setState({ alerta: <AlertErroSenha/> })
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
                                <TextField type="email" id="email" label="E-mail" fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="password" id="senha" label="Senha" fullWidth/>
                            </Grid>
                        </Grid>   
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" onClick={ this.login } fullWidth>
                                    Entrar
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Link to={'/cadastro-entidade'} style={{ textDecoration: 'none', color: 'black', }}>
                                    <Button variant="contained" color="primary" fullWidth>
                                        Cadastro
                                    </Button>
                                </Link>  
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>

                { alerta }
                
            </div>

        )
    }

}