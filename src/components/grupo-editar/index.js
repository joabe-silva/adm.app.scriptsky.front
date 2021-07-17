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


export default class GrupoEditar extends Component {

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
        cod_produto_grupo: 0,
        imagem: 'img_default.png',
        titulo: '',
        descricao: '', 
        situacao: '',
        sequencia: '',
        alerta: '',
    }

    componentDidMount(){
        this.grupo();
        this.parametro();
    }

    async grupo() {
        const { cod_grupo } = this.props.match.params;
        const grupo = await api.get(`/grupo/${ cod_grupo }`);

        if(grupo.data[0].situacao === 'Ativo') {
            this.setState({ 
                cod_produto_grupo: grupo.data[0].cod_produto_grupo,
                imagem: grupo.data[0].imagem, 
                titulo: grupo.data[0].titulo, 
                descricao: grupo.data[0].descricao, 
                sequencia: grupo.data[0].sequencia,
                situacao: 0,
            });
        } else {
            this.setState({ 
                cod_produto_grupo: grupo.data[0].cod_produto_grupo,
                imagem: grupo.data[0].imagem, 
                titulo: grupo.data[0].titulo, 
                descricao: grupo.data[0].descricao, 
                sequencia: grupo.data[0].sequencia,
                situacao: 1,
            });
        } 
    }

    async parametro() {
        const parametro = await api.get('/parametro');
        this.setState({ parametro: parametro.data[0] });
    }

    setTitulo = (event) => {
        this.setState({ titulo: event.target.value });
    }

    setDescricao = (event) => {
        this.setState({ descricao: event.target.value });
    }

    setSequencia = (event) => {
        this.setState({ sequencia: event.target.value });
    }

    setSituacao = (event) => {
        this.setState({ situacao: event.target.value });
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

        api.delete(`/deleta-produto-grupo/${ this.state.cod_produto_grupo }`).then(function (res) {
          if(res.data === 'Token invalido! Favor fazer login novamente.') {
            window.location.replace('/login');
          } else {
            window.location.replace('/grupo-pesquisa');
          }
        });
    }

    salvar = () => {
        const grupo = {
            cod_produto_grupo: this.state.cod_produto_grupo,
            imagem: this.state.imagem, 
            titulo: this.state.titulo, 
            descricao: this.state.descricao, 
            sequencia: this.state.sequencia,
            situacao: this.state.situacao,
        }

        if(grupo.cod_produto_grupo !== '' & 
           grupo.titulo !== '' &  
           grupo.sequencia !== '' & 
           grupo.situacao !== ''
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

            api.put(`/editar-produto-grupo/${ this.state.cod_produto_grupo }`, grupo).then(function (res) {
              if(res.data === 'Token invalido! Favor fazer login novamente.') {
                window.location.replace('/login');
              } else {
                window.location.replace('/grupo-pesquisa');
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

        const { parametro, imagem, titulo, descricao, sequencia, situacoes, situacao, alerta } = this.state;

        return (

            <div> 
                <Fab size="small" color="primary" aria-label="add" onClick={ this.voltar }>
                    <ArrowBack />
                </Fab>
                <br/><br/>

                <Card elevation={3}> 
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Edição do Grupo de Produtos
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
                                        <TextField type="text" id="sequencia" label="Sequencia de Exibição" placeholder="0" value={ sequencia } onChange={ this.setSequencia } required fullWidth/>
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