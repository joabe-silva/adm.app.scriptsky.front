import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DashboardIcon from '@material-ui/icons/DashboardRounded';
import AttachMoneyIcon from '@material-ui/icons/AttachMoneyRounded';
import AddIcon from '@material-ui/icons/AddRounded';
import SearchIcon from '@material-ui/icons/SearchRounded';
import CheckIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmptyRounded';
import AccessTimeIcon from '@material-ui/icons/AccessTimeRounded';
import CategoryIcon from '@material-ui/icons/CategoryRounded';
import AccountTreeIcon from '@material-ui/icons/AccountTreeRounded';
import PostIcon from '@material-ui/icons/PostAddRounded';
import GroupIcon from '@material-ui/icons/GroupRounded';
import StoreIcon from '@material-ui/icons/StorefrontRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import AccountCircledIcon from '@material-ui/icons/AccountCircleRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToAppRounded';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Routes from '../../routes';
import styles from './styles';

function Main(props) {

  const { window } = props;
  const classes = styles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openPedidos, setOpenPedidos] = React.useState(true);
  const [openProduto, setOpenProduto] = React.useState(false);
  const [openGrupoProdutos, setOpenGrupoProdutos] = React.useState(false);
  const [openUsuarios, setOpenUsuarios] = React.useState(false);
  const [openConfig, setOpenConfig] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleClickPedidos = () => {
    setOpenPedidos(!openPedidos);
  };
  const handleClickProduto = () => {
    setOpenProduto(!openProduto);
  };
  const handleClickGrupoProdutos = () => {
    setOpenGrupoProdutos(!openGrupoProdutos);
  };
  const handleClickUsuarios = () => {
    setOpenUsuarios(!openUsuarios);
  };
  const handleClickConfig = () => {
    setOpenConfig(!openConfig);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
          <Link href={'/dashboard'} style={{ textDecoration: 'none', color: 'black', }}>
            <ListItem button>
              <ListItemIcon>
                  <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItem>
          </Link>
          <ListItem button onClick={handleClickPedidos}>
            <ListItemIcon>
              <PostIcon />
            </ListItemIcon>
            <ListItemText primary="Pedidos" />
            {openPedidos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={openPedidos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link href={'/pedidos-pendente'} style={{ textDecoration: 'none', color: 'black', }}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <HourglassEmptyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Criar Pedido" />
                </ListItem>
              </Link>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText primary="Pesquisa" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleClickProduto}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Produto" />
            {openProduto ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={openProduto} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link href={'/produto-cadastro'} style={{ textDecoration: 'none', color: 'black', }}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cadastro" />
                </ListItem>
              </Link>
              <Link href={'/produto-pesquisa'} style={{ textDecoration: 'none', color: 'black', }}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Pesquisa" />
                </ListItem>
              </Link>
            </List>
          </Collapse>

          <ListItem button onClick={handleClickGrupoProdutos}>
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary="Grupo de Produtos" />
            {openGrupoProdutos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={openGrupoProdutos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link href={'/grupo-cadastro'} style={{ textDecoration: 'none', color: 'black', }}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cadastro" />
                </ListItem>
              </Link>
              <Link href={'/grupo-pesquisa'} style={{ textDecoration: 'none', color: 'black', }}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Pesquisa" />
                </ListItem>
              </Link>
            </List>
          </Collapse>

          <ListItem button onClick={handleClickUsuarios}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Usuários" />
            {openUsuarios ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={openUsuarios} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Funcionários" />
              </ListItem>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Clientes" />
              </ListItem>
            </List>
          </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleClickConfig}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
          {openConfig ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={openConfig} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StoreIcon />
              </ListItemIcon>
              <ListItemText primary="Loja" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText primary="Formas de Pagamento" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button>
          <ListItemIcon>
            <AccountCircledIcon />
          </ListItemIcon>
          <ListItemText primary='Meu Perfil' />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary='Sair' />
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            App Scriptsky
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="menu">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, 
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Container maxWidth="sm">
          <Routes /> 
        </Container>

      </main>
    </div>
  );
}

 Main.propTypes = {
  window: PropTypes.func,
};

export default Main;
