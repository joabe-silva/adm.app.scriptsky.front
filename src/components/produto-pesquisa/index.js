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
    pesquisa: '',
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
    this.setState({ grupos: grupos.data.rows, grupo: grupos.data.rows[0].cod_produto_grupo });

    const produtos = await api.get(`/produtos-grupo/${ grupos.data.rows[0].cod_produto_grupo }`);
    this.setState({ produtos: produtos.data.rows });
  }
  
  pesquisa = () => {
    const produtos = api.get(`/produtos-grupo/${ this.state.grupo }`);
    //this.setState({ produtos: produtos.data.rows });
    console.log(produtos)
  }
  
  setGrupo = (event) => {
    this.setState({ grupo: event.target.value });
  }

  render(){

    const { produtos, grupos, grupo, parametro } = this.state;

    return (
      
      <div>
        <Grid container spacing={2}>
          <Grid item xs={5}>
              <TextField type="text" id="pesquisa" label="Pesquisa..." onChange={ 0 } fullWidth/>
          </Grid>
          <Grid item xs={5}>
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
          <Grid item xs={2}>
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
                        color="primary" 
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
