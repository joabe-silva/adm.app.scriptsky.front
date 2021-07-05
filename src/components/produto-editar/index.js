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
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import AlertaPreechaTodoFurmulario from '../alertas/preencha-todo-formulario';
import storage from '../../services/firebase';
import api from '../../services/api';


export default class ProdutoEditar extends Component {

    state = {
        grupos: [],
        parametro: [],
        situacoes: [{
            cod_situacao: 0,
            titulo: 'Ativo'
        },
        {
            cod_situacao: 1,
            titulo: 'Inativo'
        }],
        cod_produto: 0,
        imagem: 'img_default.png',
        titulo: '',
        descricao: '',
        preco: 0,
        cod_produto_grupo: 0, 
        grupo: '',
        situacao: '',
        alerta: '',
    }

    componentDidMount(){
        this.grupos();
        this.produto();
        this.parametro();
    }

    async produto() {
        const { cod_produto } = this.props.match.params;
        const produto = await api.get(`/produto/${ cod_produto }`);

        if(produto.data[0].situacao === 'Ativo') {
            this.setState({ 
                cod_produto: produto.data[0].cod_produto,
                imagem: produto.data[0].imagem, 
                titulo: produto.data[0].titulo, 
                descricao: produto.data[0].descricao, 
                preco: produto.data[0].preco,
                grupo: produto.data[0].cod_produto_grupo,
                situacao: 0,
            });
        } else {
            this.setState({ 
                cod_produto: produto.data[0].cod_produto,
                imagem: produto.data[0].imagem, 
                titulo: produto.data[0].titulo, 
                descricao: produto.data[0].descricao, 
                preco: produto.data[0].preco,
                grupo: produto.data[0].cod_produto_grupo,
                situacao: 1,
            });
        } 
    }

    async grupos() {
        const grupos = await api.get('/grupos');
        this.setState({ grupos: grupos.data.rows });
    }

    async parametro() {
        const parametro = await api.get('/parametro');
        this.setState({ parametro: parametro.data[0] });
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
        if(this.state.imagem !== 'img_default.png') {
            storage.ref("/").child(this.state.imagem).delete();
            this.setState({  
                imagem: 'img_default.png' 
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
            if(this.state.imagem !== 'img_default.png') {
                storage.ref("/").child(this.state.imagem).delete();
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
                        this.setState({ imagem: `${ codificacao }${ imagem.name }` })
                    });
                }
            ); 
        }
    }

    voltar = () => {
        window.history.back();
    }

    deletar = () => {

        if(this.state.imagem !== 'img_default.png') {
            storage.ref("/").child(this.state.imagem).delete();
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

        api.delete(`/deleta-produto/${ this.state.cod_produto }`).then(function (res) {
          if(res.data === 'Token invalido! Favor fazer login novamente.') {
            window.location.replace('/login');
          } else {
            window.location.replace('/produto-pesquisa');
          }
        });
    }

    salvar = () => {
        const produto = {
            cod_produto_grupo: this.state.grupo,
            imagem: this.state.imagem,
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

            api.put(`/editar-produto/${ this.state.cod_produto }`, produto).then(function (res) {
              if(res.data === 'Token invalido! Favor fazer login novamente.') {
                window.location.replace('/login');
              } else {
                window.location.replace('/produto-pesquisa');
              }
            });

        } else {
            if(this.state.alerta !== '') {
                this.setState({ alerta: '' });
            } else {
                this.setState({ alerta: <AlertaPreechaTodoFurmulario /> });
            } 
        }    
    }

    render() {

        const { parametro, imagem, titulo, descricao, preco, grupos, grupo, situacoes, situacao, alerta } = this.state;

        return (

            <div> 
                <Fab size="small" color="primary" aria-label="add" onClick={ this.voltar }>
                    <ArrowBack />
                </Fab>
                <br/><br/>

                <Card elevation={3}> 
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Edição do Produto
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item sm={4} xs={12}>
                                <CardActionArea>
                                    <CardMedia>
                                        <img src={`${ parametro.url_storage }${ imagem }${ parametro.url_complet }`} alt="Imagem do Produto" style={{ width: '100%' }} />
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
                                        <TextField type="text" id="titulo" label="Titulo" value={ titulo } onChange={ this.setTitulo } required fullWidth/>
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
                                        <TextField type="text" id="descricao" label="Descrição" value={ descricao } onChange={ this.setDescricao } rowsMax={ 2 } multiline fullWidth/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField type="text" id="preco" label="Preço" placeholder="0.00" value={ preco } onChange={ this.setPreco } required fullWidth/>
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
                        <div  style={{ marginLeft: 'auto' }} >
                            <Button 
                                type="buttom" 
                                variant="contained" 
                                color="secondary"  
                                onClick={ this.deletar }
                                style={{ margin: '10px' }}
                            >
                                Deletar
                            </Button> 
                            <Button 
                                type="buttom" 
                                variant="contained" 
                                color="primary" 
                                onClick={ this.salvar }
                                style={{ margin: '10px' }}
                            >
                                Salvar
                            </Button>
                        </div>
                           
                    </CardActions>
                </Card> 
                
                { alerta }
            </div>

        )
    }

}