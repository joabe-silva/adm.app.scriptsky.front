import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import AlertPedidoMinino from '../alertas/pedido-minino'
import api from '../../services/api'
import jwt from 'jwt-decode';
import './styles.css';

export default class Carrinho extends Component {

  state = {
    itens: [],
    formasPagamento: [],
    parametros: [],
    url_storage: '',
    url_complet: '',
    alerta: '',
    displayItens: 'none',
    retiradaLocal: false,
    pagamento: 1,
    pedidoMinimo: 0,
    frete: 0,
    total: 0,
    observacao: '',
  }

  componentDidMount(){
    this.carrinho()
    this.formasPagamento()
  }

  async carrinho() {
    const parametros = await api.get('/parametro');
    this.setState({ url_storage: parametros.data[0].url_storage.trim(), url_complet: parametros.data[0].url_complet.trim(), frete: parametros.data[0].frete, parametros: parametros.data[0], pedidoMinimo: parametros.data[0].pedido_minimo_loja });
    
    //Verificar se existe itens no carrinho no LocalStorage
    const itens = JSON.parse(localStorage.getItem('CarrinhoScriptsky'))
    if(itens !== null) {
      if(itens.length !== 0) {

        let totalItens = 0
        //Soma valor total de todos os itens 
        itens.map(itens => (
          totalItens = parseFloat(totalItens) + parseFloat(itens.valor_total) 
        ))
        //Insere valor total + valor do frete no state
        this.setState({ itens: itens, total: (totalItens + parseFloat(this.state.frete)).toFixed(2), displayItens: '' });
       
      } else {
        this.setState({ displayItens: 'none' });
        window.location.replace('/criar-pedido')
      }
    } else {
      this.setState({ displayItens: 'none' });
      window.location.replace('/criar-pedido')
    }

  }

  async formasPagamento() {
    const formasPagamento = await api.get('/parametro-formas-pagamento');
    this.setState({ formasPagamento: formasPagamento.data }); 
  }

  setFormaPagamento = (event) => {
    this.setState({ pagamento: event.target.value });
  };

  removerItemCarrinho = (cod_produto) => {
    const { itens } = this.state;
    let indice = 0
    let array = [] 
    array = itens

    //Criamos um novo array com base nos valores do array itens, para removermos somente os itens que serao excluidos desse novo array.
    for (indice; indice < itens.length; indice++) {
      if(array[indice].cod_produto === cod_produto){

        array.splice(indice, 1);
        this.setState({ itens: array })
        
        //Carregamos o novo array no LocalStorage
        localStorage.removeItem('CarrinhoScriptsky')
        localStorage.setItem('CarrinhoScriptsky', JSON.stringify(array))
        //Chamamos o componentDidMount para atualizar o state
        this.componentDidMount()
        
      }
    }
  }

  retiradaLocal = () => {
    if(this.state.retiradaLocal === true) {
      let total = parseFloat((this.state.total + this.state.parametros.frete).toFixed(2))
      this.setState({ retiradaLocal: false, frete: this.state.parametros.frete, total: total }) 
    } 
    if(this.state.retiradaLocal === false) { 
      if(this.state.total <= this.state.frete) {
        this.setState({ retiradaLocal: true, frete: 0})
      } else {
        let total = parseFloat((this.state.total - this.state.parametros.frete).toFixed(2))
        this.setState({ retiradaLocal: true, frete: 0, total: total })    
      }
    }    
  }

  limpaCarrinho = () => {
    //Remove todos os itens do carrinho 
    localStorage.removeItem('CarrinhoScriptsky')
    this.carrinho()
    this.setState({ itens: [], displayItens: 'none' })
  }

  setObservacao = (event) => {
    this.setState({ observacao: event.target.value });
  }

  finalizarPedido = () => {
    //Verifica se o valor total do pedido é maior ou igual ao pedido minimo da aplicacao
    if(this.state.total >= this.state.pedidoMinimo) {
      //Verifica se o usuario esta logado
      if(localStorage.getItem('tokenScriptsky') === null) {
        window.location.replace('/login')
      } else {
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
        //Configura o objeto pedido
        const { cod_entidade } = jwt(localStorage.getItem('tokenScriptsky'))
        const { total, pagamento, retiradaLocal, observacao } = this.state

        const pedido = {
          cod_entidade: cod_entidade, 
          valor_total: total, 
          desconto: 0, 
          valor_liquido: total, 
          troco: 0, 
          cod_parametro_forma_pagamento: pagamento,
          retirada_local: retiradaLocal,
          observacao: observacao,
          situacao: 0
        }
        //Insere pedido na base de dados
        api.post('/criar-pedido', pedido).then(function (res) {

          const { currval } = res.data[1].rows[0]

          const itens = JSON.parse(localStorage.getItem('CarrinhoScriptsky'))

          let item = {}

          itens.forEach(itens => {

            item = {
              cod_pedido: currval, 
              cod_produto: itens.cod_produto, 
              preco: itens.preco, 
              desconto: 0, 
              quantidade: itens.quantidade, 
              valor_total: itens.valor_total, 
              valor_liquido: itens.valor_total, 
              observacao: itens.observacao
            }

            //Insere itens na base de dados
            api.post('/criar-pedido-item', item).then(function (res) {
              console.log(res)
            }).catch(function (error) {
              console.log(error)
            });

          });

        }).catch(function (error) {

          console.log(error)
          window.location.replace('/login')
      
        });

      }

      setTimeout(this.limpaCarrinho, 1000, 'limpaCarrinho');

    } else {
      if(this.state.alerta === '') {
        this.setState({ alerta: <AlertPedidoMinino /> })
      } else {
        if(this.state.alerta !== '') {
          this.setState({ alerta: '' })
        }
      }
    }
    

  }

  render(){

    const { 
      itens, 
      url_storage, 
      url_complet, 
      alerta, 
      displayItens, 
      retiradaLocal, 
      formasPagamento, 
      pagamento, 
      frete, 
      total,
      observacao
    } = this.state;

    return (
      
      <div style={{ display: displayItens }} className="margin-top-itens"> 
        <Link to={'/criar-pedido'}>
          <Fab size="small" color="primary" aria-label="add">
            <ArrowBack />
          </Fab>
        </Link>
  
        <List className="list-itens"
          component="nav"
          aria-labelledby="list-subheader"
          subheader={
            <ListSubheader component="div" id="list-subheader">
              Itens do Carrinho
            </ListSubheader>
          }
        >
          {
            itens.map(itens => (
              <div key={ itens.cod_produto }>
                <ListItem button className="itens">
                  <ListItemIcon className="imagemspc">
                    <img src={`${ url_storage }${ itens.imagem }${ url_complet }`} alt={ itens.titulo } className="imagem" />
                  </ListItemIcon>
                  <ListItemText 
                    className="titulo"
                    primary={ itens.titulo }
                    secondary={`${ itens.quantidade }X Total R$ ${ itens.valor_total }`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => this.removerItemCarrinho(itens.cod_produto) }>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider/>
              </div>
            ))
          }
        </List>
        
        <br/>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              id="observacao"
              label="Observação"
              className="observacao" 
              multiline
              rowsMax={2}
              value={ observacao }
              onChange={ this.setObservacao }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Forma de pagamento</InputLabel>
              <Select
                value={ pagamento }
                onChange={ this.setFormaPagamento }
              >
                {
                  formasPagamento.map(formasPagamento => (
                    <MenuItem value={ formasPagamento.cod_parametro_forma_pagamento } key={ formasPagamento.cod_parametro_forma_pagamento }>
                      { formasPagamento.descricao }
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={ retiradaLocal }
                  onChange={ this.retiradaLocal }
                  color="primary"
                />
              }
              label="Retirada no local"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" > Taxa de entrega: R$ { frete } </Typography>
            <Typography variant="h6" > Total: R$ { total } </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={ this.finalizarPedido }>
              Finalizar Pedido
            </Button>
          </Grid>
        </Grid>
        
        { alerta }
      </div>
    )

  }
  
}
