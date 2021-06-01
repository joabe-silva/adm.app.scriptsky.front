import React, { useEffect } from 'react';
import styles from './styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Link from '@material-ui/core/Link';
import api from '../../../services/api'

export default function Header() {

  const classes = styles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [parametro, setParametro] = React.useState({});

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {

    const parametro = api.get('/parametro');

    var p = Promise.resolve(parametro);
    p.then(function(v) {
      setParametro(v.data[0]);
    });
  
  }, []);
  
  const sair = () => {

    //Configura token no cabecalho da requisicao
    api.interceptors.request.use(
      config => {
          config.headers['x-access-token'] = localStorage.getItem('tokenScriptsky');
          return config;
      },
      error => {
          return Promise.reject(error);
      }
    );
    //Inserindo token na blacklist
    api.post('/logoff', localStorage.getItem('tokenScriptsky')).then(function (res) {
      console.log(res)

      localStorage.removeItem('tokenScriptsky')
      handleMenuClose()
      window.location.replace('/')

    }).catch(function (error) {
      console.log(error)
    });

  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={ mobileMoreAnchorEl }
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={ mobileMenuId }
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={ isMobileMenuOpen }
      onClose={ handleMobileMenuClose }
    >
      <Link href="/login" color="inherit" style={{ textDecoration: 'none' }}>
        <MenuItem onClick={ handleMenuClose }>
          <Typography color="primary" component="p">
            Entrar
          </Typography>
        </MenuItem>
      </Link>
      <Link href="/meu-perfil" color="inherit" style={{ textDecoration: 'none' }}>
        <MenuItem onClick={ handleMenuClose }>
          <Typography color="primary" component="p">
            Meu Perfil
          </Typography>
        </MenuItem>
      </Link>
      <Link href="/meus-pedidos" color="inherit" style={{ textDecoration: 'none' }}>
        <MenuItem>
          <Typography color="primary" component="p">
            Meus Pedidos
          </Typography>        
        </MenuItem>
      </Link>
      <MenuItem onClick={ sair }>
        <Typography color="primary" component="p">
          Sair
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            <Link href={'/'} color="inherit" style={{ textDecoration: 'none' }}> 
              { parametro.titulo_loja }
            </Link>
          </Typography>
          <div className={ classes.grow } />
          <IconButton
            aria-label="show more"
            aria-controls={ mobileMenuId }
            aria-haspopup="true"
            onClick={ handleMobileMenuOpen }
            color="inherit"
          >
            <AccountCircle fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
      { renderMobileMenu }
    </div>
  );
}
