import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import firebase from '../../services/firebase';
import api from '../../services/api';


export default class ProdutoCadastro extends Component {

    state = {
        grupos: [],
        situacoes: [{
            cod_situacao: 0,
            titulo: 'Ativo'
        },
        {
            cod_situacao: 1,
            titulo: 'Inativo'
        }],
        grupo: '',
        situacao: '',
    }

    componentDidMount(){
        this.grupos() 
    }

    async grupos() {
        const grupos = await api.get('/grupos');
        this.setState({ grupos: grupos.data.rows });
    }

    setGrupo = (event) => {
        this.setState({ grupo: event.target.value });
    };

    setSituacao = (event) => {
        this.setState({ situacao: event.target.value });
    };

    cadastra = () => {

        const produto = {
            
            imagem: 'imagem',
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            preco: document.getElementById('preco').value,
            desconto: 0.00,
            cod_produto_grupo: this.state.grupo,
            situacao: this.state.situacao
            
        }

        console.log(produto)

    }

    upload = () => {
        console.log('Upload realizado com sucesso!')
    }

    render() {

        const { grupos, grupo, situacoes, situacao } = this.state;

        return (

            <div>
                <Card>
                    <CardActionArea>
                        <CardMedia>
                            <img src="" alt="Imagem do Produto" style={{ width: '100%' }} />
                        </CardMedia>
                    </CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Cadastro Produto
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <TextField type="text" id="titulo" label="Titulo" required fullWidth/>
                            </Grid>
                            <Grid item xs={2}>
                                <input accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" />
                                <label htmlFor="icon-button-file">
                                    <IconButton color="primary" aria-label="Upload de Imagem" component="span" onChange={ this.upload }>
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="text" id="descricao" label="Descrição" multiline rowsMax={2} fullWidth/>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField type="text" id="preco" label="Preço" placeholder="0.00" required fullWidth/>
                            </Grid>
                            <Grid item xs={8}>
                                <FormControl required fullWidth>
                                    <InputLabel>Grupo de Produtos</InputLabel>
                                    <Select value={ grupo } onChange={ this.setGrupo } >
                                        {
                                            grupos.map(grupos => (
                                                <MenuItem value={ grupos.cod_produto_grupo } key={ grupos.cod_produto_grupo }>
                                                    { grupos.titulo }
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl required fullWidth>
                                    <InputLabel>Situação</InputLabel>
                                    <Select value={ situacao } onChange={ this.setSituacao } >
                                        {
                                            situacoes.map(situacoes => (
                                                <MenuItem value={ situacoes.cod_situacao } key={ situacoes.cod_situacao }>
                                                    { situacoes.titulo }
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>  
                    </CardContent>
                    <br />
                    <CardActions>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button type="buttom" variant="contained" color="primary" onClick={ this.cadastra } fullWidth>
                                    Cadastrar
                                </Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card> 

            </div>

        )
    }

}