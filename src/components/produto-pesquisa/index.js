import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import api from '../../services/api';
import './styles.css';

export default class Itens extends Component {

  state = {
    itens: [],
    parametro: [],
  }

  async grupos() {
    const grupos = await api.get('/grupos');
    this.setState({ grupos: grupos.data.rows });
  }

  async componentDidMount(){

    /*const produtos = await api.get('/produtos-grupo/'+cod_produto_grupo);*/
    const produtos = await api.get('/produtos');

    const parametro = await api.get('/parametro');

    this.setState({ itens: produtos.data.rows, parametro: parametro.data[0] });

  }

  render(){

    const { itens, grupos, parametro } = this.state;

    return (
      
      <div>
        <Grid container spacing={2}>
          <Grid item xs={6}>
              <TextField type="text" id="pesquisa" label="Pesquisa..." onChange={ 0 } fullWidth/>
          </Grid>
          <Grid item xs={6}>
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

        <List className="list">
          {
            itens.map(itens => (

              <Link 
                to={`/item/${ itens.cod_produto }`} 
                key={ itens.cod_produto } 
                style={{ textDecoration: 'none', color: 'black', }}
              >
                <ListItem button className="itens">
                  <ListItemIcon className="imagemspc">
                    <img src={`${ parametro.url_storage }${ itens.imagem }${ parametro.url_complet }`} alt={ itens.titulo } className="imagem" />
                  </ListItemIcon>
                  <ListItemText 
                      className="titulo"
                      primary={ itens.titulo }
                      secondary={`R$ ${ itens.preco }`}
                  />
                </ListItem>
                <Divider />
              </Link>

            ))
          }
        </List>
      </div>
    
    )

  }
  
}
