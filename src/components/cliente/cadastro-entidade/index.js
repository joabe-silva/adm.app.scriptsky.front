import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AlertErroUsuarioJaCadastrado from '../alert-erro-usuario-ja-cadastrado';
import AlertErroPreenchaTodoFormulario from '../alert-erro-preencha-todo-formulario';
import api from '../../../services/api';

export default class CadastroEntidadeEndereco extends Component {

    state = {
        alerta: ''
    }

    cadastrar = () => {

        const cliente = {
            nome: document.getElementById('nome').value,
            contato: document.getElementById('contato').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        }

        const usuario = {
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        }

        if(cliente.nome === '') {

            if(this.state.alerta !== '') {
                this.setState({ alerta: '' })
            } else {
                this.setState({ alerta: <AlertErroPreenchaTodoFormulario /> })
            }

        } else {
            if(cliente.contato === '') {

                if(this.state.alerta !== '') {
                    this.setState({ alerta: '' })
                } else {
                    this.setState({ alerta: <AlertErroPreenchaTodoFormulario /> })
                }

            } else {
                if(cliente.email === '') {
                
                    if(this.state.alerta !== '') {
                        this.setState({ alerta: '' })
                    } else {
                        this.setState({ alerta: <AlertErroPreenchaTodoFormulario /> })
                    }

                } else {
                    if(cliente.senha === '') {

                        if(this.state.alerta !== '') {
                            this.setState({ alerta: '' })
                        } else {
                            this.setState({ alerta: <AlertErroPreenchaTodoFormulario /> })
                        }

                    } else {
                        
                        api.post('/cadastro-entidade-cliente', cliente).then(res => {
            
                            if(res.data === 'Email inserido já esta em uso por outro usuário. Favor insira um email diferente.') {
                                if(this.state.alerta !== '') {
                                    this.setState({ alerta: '' })
                                    this.setState({ alerta: <AlertErroUsuarioJaCadastrado /> })
                                } else {
                                    this.setState({ alerta: <AlertErroUsuarioJaCadastrado /> })
                                }
                                
                            } else {
                                this.setState({ alerta: '' })

                                api.post('/login', usuario).then(res => {

                                    localStorage.setItem('tokenScriptsky', res.data)
                                    window.location.replace('/cadastro-entidade-endereco')
                                      
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });

                            }
                
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                    }
                }
            }
        }

    }

    render() {

        const { alerta } = this.state;

        return (

            <div>
                <Card className="card">
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Cadastro
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField type="text" id="nome" label="Nome" required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="text" id="contato" label="Contato" placeholder="(99)99999-9999" required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="email" id="email" label="E-mail" required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="password" id="senha" label="Senha" required fullWidth/>
                            </Grid>
                        </Grid>  
                    </CardContent>
                    <br />
                    <CardActions>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button type="buttom" variant="contained" color="primary" onClick={ this.cadastrar } fullWidth>
                                    Cadastrar
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