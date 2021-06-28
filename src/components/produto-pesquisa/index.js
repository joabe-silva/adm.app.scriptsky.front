import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import api from '../../services/api';
import './styles.css';

export default class Itens extends Component {

  state = {
    produtos: [],
    parametro: [],
    grupos: [],
    grupo: '',
    titulo: '',
  }

  async componentDidMount(){
    this.parametro();
    this.grupos();
  }

  async parametro() {
    const parametro = await api.get('/parametro');
    this.setState({ parametro: parametro.data[0] });
  }

  async grupos() {
    const grupos = await api.get('/grupos');
    this.setState({ grupos: grupos.data.rows });
  }

  setGrupo = (event) => {
    this.setState({ grupo: event.target.value });
  }

  setTitulo = (event) => {
    this.setState({ titulo: event.target.value });
  }

  pesquisa = () => {
    if(this.state.titulo !== '' & this.state.grupo === '') { 
      this.pesquisaPorTitulo() 
    } else {
      if(this.state.grupo !== '' & this.state.titulo === '') {
        this.pesquisaPorGrupo()
      } else {
        if(this.state.grupo !== '' & this.state.titulo !== '') {
          this.pesquisaPorTitulo() 
        }
      }
    }
  }

  pesquisaPorTitulo = () => {
    if(this.state.titulo !== '') {
      const produto = {
        titulo: this.state.titulo
      }
      api.post('/produto-pesquisa-por-titulo', produto).then(produtos => {
        this.setState({ produtos: produtos.data.rows });
      });
    }
  }

  pesquisaPorGrupo = () => {
    if(this.state.grupo !== '') {
      api.get(`/produtos-grupo/${ this.state.grupo }`).then(produtos => {
        this.setState({ produtos: produtos.data.rows });
      });
    } 
  }

  render(){

    const { produtos, grupos, grupo, titulo, parametro } = this.state;

    return (
      
      <div>
        <Grid container spacing={2}>
          <Grid item sm={5} xs={12}>
            <TextField type="text" id="pesquisa" label="Pesquisa..." value={ titulo } onChange={ this.setTitulo } fullWidth/>
          </Grid>
          <Grid item sm={5} xs={8}>
            <FormControl fullWidth>
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
          <Grid item sm={2} xs={4}>
            <Button 
              type="buttom" 
              variant="contained" 
              color="primary" 
              onClick={ this.pesquisa }
            >
              Pesquisa
            </Button>
          </Grid>
        </Grid>

        <List className="list">
          {
            produtos.map(produtos => (
              <div>
                <ListItem button className="itens">
                  <ListItemIcon className="imagemspc">
                    <img src={`${ parametro.url_storage }${ produtos.imagem }${ parametro.url_complet }`} alt={ produtos.titulo } className="imagem" />
                  </ListItemIcon>
                  <ListItemText 
                    className="titulo"
                    primary={ produtos.titulo }
                    secondary={`R$ ${ produtos.preco }`}
                  />
                  <ListItemIcon>
                    <Link 
                      to={`/produto-editar/${ produtos.cod_produto }`} 
                      key={ produtos.cod_produto } 
                      style={{ textDecoration: 'none', color: 'black', }}
                    >
                      <Button 
                        type="buttom" 
                        variant="contained" 
                        color="secondary" 
                      >
                        Editar
                      </Button>
                    </Link>
                  </ListItemIcon>
                </ListItem>
                <Divider />
              </div>
            ))
          }
        </List>
      </div>
    
    )

  }
  
}
