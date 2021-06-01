import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import PreCarrinho from '../pre-carrinho';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import Fab from '@material-ui/core/Fab';
import api from '../../../services/api';
import './styles.css';

export default class Itens extends Component {

  state = {
    itens: [],
    parametro: [],
  }

  async componentDidMount(){

    const { cod_produto_grupo } = this.props.match.params;

    const produtos = await api.get('/produtos-grupo/'+cod_produto_grupo);

    const parametro = await api.get('/parametro');

    this.setState({ itens: produtos.data.rows, parametro: parametro.data[0] });

  }

  render(){

    const { itens, parametro } = this.state;

    return (
      
      <div>
        <Link to={'/'}>
          <Fab size="small" color="primary" aria-label="add">
            <ArrowBack />
          </Fab>
        </Link>

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

        <PreCarrinho />
      </div>
    
    )

  }
  
}
