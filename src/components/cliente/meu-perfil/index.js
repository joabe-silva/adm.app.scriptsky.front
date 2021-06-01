import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import Divider from '@material-ui/core/Divider';
import Account from '@material-ui/icons/AccountCircleRounded';
import Location from '@material-ui/icons/LocationOnRounded';
import Fab from '@material-ui/core/Fab';  
import './styles.css';

export default class MeuPerfil extends Component {

  render(){

    return (
      
      <div>
          <Link to={'/'}>
            <Fab size="small" color="primary" aria-label="add">
              <ArrowBack />
            </Fab>
          </Link>

          <List>
            <Link to={`/editar-usuario`} style={{ textDecoration: 'none', color: 'black', }}>
              <ListItem button>
                <ListItemIcon>
                  <Account color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Usuário"
                />
              </ListItem>
            </Link>
            <Divider />
            <Link to={`/editar-endereco`} style={{ textDecoration: 'none', color: 'black', }}>
              <ListItem button>
                <ListItemIcon>
                  <Location color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Endereço"
                />
              </ListItem>
            </Link>
          </List>  
      </div>
    
    )

  }
  
}
