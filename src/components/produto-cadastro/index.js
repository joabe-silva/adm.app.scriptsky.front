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
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import RemoveIcon from '@material-ui/icons/RemoveCircleRounded';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import AlertaPreechaTodoFurmulario from '../alertas/preencha-todo-formulario';
import storage from '../../services/firebase';
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
        url_imagem: 'https://firebasestorage.googleapis.com/v0/b/app-scriptsky-com-br.appspot.com/o/img_default.png?alt=media',
        imagem_name: 'img_default.png',
        titulo: '',
        descricao: '',
        preco: 0,
        cod_produto_grupo: 0, 
        grupo: '',
        situacao: '',
        alerta: '',
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
    }

    setSituacao = (event) => {
        this.setState({ situacao: event.target.value });
    }

    setTitulo = (event) => {
        this.setState({ titulo: event.target.value });
    }

    setDescricao = (event) => {
        this.setState({ descricao: event.target.value });
    }

    setPreco = (event) => {
        const preco = event.target.value
        const newPreco = preco.replace(',', '.');

        this.setState({ preco: newPreco });
    }

    removeImagem = () => {
        if(this.state.imagem_name !== 'img_default.png') {
            storage.ref("/").child(this.state.imagem_name).delete();
            this.setState({ 
                url_imagem: 'https://firebasestorage.googleapis.com/v0/b/app-scriptsky-com-br.appspot.com/o/img_default.png?alt=media', 
                imagem_name: 'img_default.png' 
            });
        }
    }

    handleChangeImage = (event) => {
        const imagem = event.target.files[0]
        
        if(imagem){
            //Transformando data
            const data = new Date();
            const dia  = data.getDate().toString().padStart(2, '0');
            const mes  = (data.getMonth()+1).toString().padStart(2, '0');
            const ano  = data.getFullYear();
            const data_format = `${ dia }${ mes }${ ano }`;

            //Transformando hora, min e segundos
            const hora    = data.getHours();          
            const min     = data.getMinutes();        
            const seg     = data.getSeconds();        
            const mseg    = data.getMilliseconds();
            const hora_format = `${ hora }${ min }${ seg }${ mseg }`;

            //Codificacao
            const codificacao = data_format+hora_format;

            //Caso o cliente queira fazer upload de outra imagem o sistema remove a ultima imagem upada no storage
            if(this.state.imagem_name !== 'img_default.png') {
                storage.ref("/").child(this.state.imagem_name).delete();
            }
            
            //Realizando upload da imagem no storage
            const uploadTask = storage.ref(`/${ codificacao }${ imagem.name }`).put(imagem);
            uploadTask.on(
                "state_changed",
                snapshot => {},
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref("/")
                    .child(`${ codificacao }${ imagem.name }`)
                    .getDownloadURL()
                    .then(url => {
                        this.setState({ url_imagem: url, imagem_name: `${ codificacao }${ imagem.name }` })
                    });
                }
            ); 
        }
    }

    salvar = () => {
        const produto = {
            cod_produto_grupo: this.state.grupo,
            imagem: this.state.imagem_name,
            titulo: this.state.titulo,
            descricao: this.state.descricao,
            preco: this.state.preco,
            desconto: 0,
            situacao: this.state.situacao
        }

        if(produto.cod_produto_grupo !== '' & 
           produto.titulo !== '' &  
           produto.preco !== '' & 
           produto.situacao !== ''
        ) {
            api.interceptors.request.use(
                config => {
                    config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
                    return config;
                },
                error => {
                    return Promise.reject(error);
                }
            );

            api.post('/cadastro-produto', produto).then(function (res) {
              if(res.data === 'Token invalido! Favor fazer login novamente.') {
                window.location.replace('/login')
              } else {
                window.location.replace('/')  
              }
            });

        } else {
            if(this.state.alerta !== '') {
                this.setState({ alerta: '' })
            } else {
                this.setState({ alerta: <AlertaPreechaTodoFurmulario /> });
            } 
        }    
    }

    render() {

        const { url_imagem, grupos, grupo, situacoes, situacao, alerta } = this.state;

        return (

            <div>
                <Card elevation={3}> 
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Cadastro Produto
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item sm={4} xs={12}>
                                <CardActionArea>
                                    <CardMedia>
                                        <img src={ url_imagem } alt="Imagem do Produto" style={{ width: '100%' }} />
                                    </CardMedia>
                                </CardActionArea>
                                <input  
                                       type="file"
                                       id="files" 
                                       accept="image/*" 
                                       style={{ display: 'none' }} 
                                       onChange={ this.handleChangeImage } 
                                />
                                <label htmlFor="files">
                                    <IconButton color="primary" aria-label="Upload de Imagem" component="span">
                                        <PhotoCameraIcon />
                                    </IconButton>
                                </label> 
                                <IconButton color="primary" onClick={ this.removeImagem } aria-label="Remove Imagem" component="span">
                                    <RemoveIcon />
                                </IconButton>
                            </Grid>
                            <Grid item sm={8} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <TextField type="text" id="titulo" label="Titulo" onChange={ this.setTitulo } required fullWidth/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl required fullWidth>
                                            <InputLabel>Situação</InputLabel>
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
                                        <TextField type="text" id="descricao" label="Descrição" onChange={ this.setDescricao } rowsMax={ 2 } multiline fullWidth/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField type="text" id="preco" label="Preço" placeholder="0.00" onChange={ this.setPreco } required fullWidth/>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <FormControl required fullWidth>
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
                                </Grid>
                            </Grid>
                        </Grid>  
                    </CardContent>
                    <CardActions>
                        <Button 
                            type="buttom" 
                            variant="contained" 
                            color="primary" 
                            style={{ marginLeft: 'auto' }} 
                            onClick={ this.salvar }
                        >
                            Salvar
                        </Button>   
                    </CardActions>
                </Card> 
                
                { alerta }
            </div>

        )
    }

}