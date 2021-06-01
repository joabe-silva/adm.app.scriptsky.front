import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Arrow from '@material-ui/icons/ArrowForwardIosRounded';
import api from '../../../services/api';
import './styles.css';

export default class Grupos extends Component {

  state = {
    grupos: [],
    parametro: [],
  }

  async componentDidMount(){

    const result = await api.get('/grupos');

    const parametro = await api.get('/parametro');

    this.setState({ grupos: result.data.rows, parametro: parametro.data[0] });

  }

  render(){

    const { grupos, parametro } = this.state;

    return (

      <List
        className="list" 
        subheader={
          <ListSubheader component="div">
            Categorias
          </ListSubheader>
        }
      >
        {
          grupos.map(grupos => (

            <Link 
              to={`/itens/${ grupos.cod_produto_grupo }`} 
              key={ grupos.cod_produto_grupo } 
              style={{ textDecoration: 'none', color: 'black' }}
            >
                <ListItem button className="itens">
                  <ListItemIcon className="imagemspc">
                    <img src={`${ parametro.url_storage }${ grupos.imagem }${ parametro.url_complet }`} alt={ grupos.titulo } className="imagem" />
                  </ListItemIcon>
                  <ListItemText 
                    className="titulo"
                    primary={ grupos.titulo }
                    secondary={ grupos.descricao }
                  />
                  <ListItemIcon>
                    <Arrow />
                  </ListItemIcon>
                </ListItem>
                <Divider />
            </Link>

          ))
        }
      </List>
    )

  }
  
}
