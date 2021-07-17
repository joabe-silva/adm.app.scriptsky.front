import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import api from '../../services/api';
import './styles.css';

export default class GrupoPesquisa extends Component {

  state = {
    grupos: [],
    titulo: 'Todos',
  }

  async grupos() {
    const grupos = await api.get('/grupos');
    this.setState({ grupos: grupos.data.rows });
  }

  setTitulo = (event) => {
    this.setState({ titulo: event.target.value });
  }

  pesquisa = () => {
    if(this.state.titulo !== '') {
      api.get(`/grupo-pesquisa-por-titulo/${ this.state.titulo }`).then(grupos => {
        this.setState({ grupos: grupos.data.rows });
      });
    } else {
      this.grupos();
    }
  }

  render(){

    const { grupos, titulo } = this.state;

    return (
      
      <div>
        <Grid container spacing={2}>
          <Grid item sm={9} xs={9}>
            <TextField type="text" id="pesquisa" label="Pesquisa..." value={ titulo } onChange={ this.setTitulo } fullWidth/>
          </Grid>
          <Grid item sm={3} xs={3}>
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

        <List className="list"
          subheader={
            <ListSubheader component="div">
              Grupos de Produtos
            </ListSubheader>
          }
        >
          {
            grupos.map(grupos => (
              <div>
                <ListItem button className="itens">
                  <ListItemText 
                    className="titulo"
                    primary={ grupos.titulo }
                    secondary={`Sequencia: ${ grupos.sequencia } Situação: ${ grupos.situacao }`}
                  />
                  <ListItemIcon>
                    <Link 
                      to={`/grupo-editar/${ grupos.cod_produto_grupo }`} 
                      key={ grupos.cod_produto_grupo } 
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
