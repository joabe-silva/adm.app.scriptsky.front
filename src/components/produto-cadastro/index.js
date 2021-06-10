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
        imagem: '',
        titulo: '',
        descricao: '',
        preco: 0.00,
        desconto: 0.00,
        cod_produto_grupo: 0, 
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
    }

    setSituacao = (event) => {
        this.setState({ situacao: event.target.value });
    }

    titulo = (event) => {
        this.setState({ titulo: event.target.value})
    }

    descricao = (event) => {
        this.setState({ descricao: event.target.value})
    }

    preco = (event) => {
        this.setState({ preco: event.target.value})
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

            //Caso o cliente queira fazer upload de outra imagem o sistema remove a ultima imagem upada no storage
            if(this.state.imagem_name) {
                storage.ref("/").child(this.state.imagem_name).delete();
                //console.log(this.state.imagem_name)
            }
            
            //Realizando upload da imagem no storage
            const uploadTask = storage.ref(`/${ data_format }${ hora_format }${ imagem.name }`).put(imagem);
            uploadTask.on(
                "state_changed",
                snapshot => {},
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref("/")
                    .child(`${ data_format }${ hora_format }${ imagem.name }`)
                    .getDownloadURL()
                    .then(url => {
                        //console.log(url);
                        this.setState({ url_imagem: url, imagem_name: `${ data_format }${ hora_format }${ imagem.name }` })
                    });
                }
            ); 

        }
    }

    render() {

        const { url_imagem, grupos, grupo, situacoes, situacao } = this.state;

        return (

            <div>
                <Card>
                    <CardActionArea>
                        <CardMedia>
                            <img src={ url_imagem } alt="Imagem do Produto" style={{ width: '100%' }} />
                        </CardMedia>
                    </CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Cadastro Produto
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <TextField type="text" id="titulo" label="Titulo" onChange={ this.cadastra } required fullWidth/>
                            </Grid>
                            <Grid item xs={2}>
                                <input type="file"  accept="image/*" style={{ display: 'none' }} id="files" onChange={ this.handleChangeImage }/>
                                <label htmlFor="files">
                                    <IconButton color="primary" aria-label="Upload de Imagem" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="text" id="descricao" label="Descrição" onChange={ this.cadastra } multiline rowsMax={2} fullWidth/>
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