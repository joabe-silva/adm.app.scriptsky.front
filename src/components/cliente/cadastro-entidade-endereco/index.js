import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AlertErroPreenchaTodoFormulario from '../alert-erro-preencha-todo-formulario';
import AlertSuccessCadastroEntidade from '../alert-success-cadastro-entidade';
import api from '../../../services/api';
import jwt from 'jwt-decode';

export default class CadastroEntidade extends Component {
    
    state = {
        alerta: ''
    }

    cadastrar = () => {

        const { cod_entidade } = jwt(localStorage.getItem('tokenScriptsky'))

        const endereco = {
            cod_entidade: cod_entidade,
            endereco: document.getElementById('endereco').value,
            numero: document.getElementById('numero').value,
            completo: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            cep: document.getElementById('cep').value,
            cidade:'', 
	        estado:''
        }
        
        if(endereco.endereco === '') {

            if(this.state.alerta !== '') {
                this.setState({ alerta: '' })
            } else {
                this.setState({ alerta: <AlertErroPreenchaTodoFormulario /> })
            }

        } else {
            if(endereco.numero === '') {

                if(this.state.alerta !== '') {
                    this.setState({ alerta: '' })
                } else {
                    this.setState({ alerta: <AlertErroPreenchaTodoFormulario /> })
                }
    
            } else {
                
                if(endereco.bairro === '') {

                    if(this.state.alerta !== '') {
                        this.setState({ alerta: '' })
                    } else {
                        this.setState({ alerta: <AlertErroPreenchaTodoFormulario /> })
                    }
        
                } else {
                    if(endereco.cep === '') {

                        if(this.state.alerta !== '') {
                            this.setState({ alerta: '' })
                        } else {
                            this.setState({ alerta: <AlertErroPreenchaTodoFormulario /> })
                        }

                    } else {
                
                        api.post('/cadastro-endereco-entidade', endereco).then(function (res) {

                            console.log(res)
                            setTimeout(window.location.replace('/'), 1000, 'Redireciona');

                        }).catch(function (error) {
                            console.log(error)
                        });

                        this.setState({ alerta: <AlertSuccessCadastroEntidade /> })
                        
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
                            Endereço
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <TextField type="text" id="endereco" label="Endereço" required fullWidth/>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField type="text" id="numero" label="Nº" required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="text" id="complemento" label="Complemento" fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="text" id="bairro" label="Bairro" required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="text" id="cep" label="Cep" placeholder="99999-999" required fullWidth/>
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