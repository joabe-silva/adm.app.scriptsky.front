import React, {Component} from 'react';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import api from '../../../services/api'

export default class Carrinho extends Component {

  state = {
    parametros: [],
    displayCarrinho: 'none',
    total: 0,
    contItens: 0,
  }

  componentDidMount(){
    this.carrinho() 
  }

  async carrinho() {

    const parametros = await api.get('/parametro');
    this.setState({ frete: parametros.data[0].frete, parametros: parametros.data[0], pedidoMinimo: parametros.data[0].pedido_minimo_loja });
  
    //Verificar se existe itens no carrinho no LocalStorage
    const itens = JSON.parse(localStorage.getItem('CarrinhoScriptsky'))

    if(itens !== null) {
      if(itens.length !== 0) {

        let totalItens = 0
        let contItens = 0

        //Soma valor total de todos os itens 
        itens.map(itens => (
          totalItens = parseFloat(totalItens) + parseFloat(itens.valor_total) 
        ))
        //Soma todos os itens do pedido
        itens.map(itens => (
          contItens = contItens + parseInt(itens.quantidade)
        ))

        //Insere valor total + valor do frete e quantidade de itens do pedido no state
        this.setState({ total: (totalItens + parseFloat(this.state.frete)).toFixed(2), contItens: contItens, displayCarrinho: '' });
       
      } else {
        this.setState({ displayCarrinho: 'none' });
      }
    } else {
      this.setState({ displayCarrinho: 'none' });
    }

  }

  render(){

    const { displayCarrinho, total, contItens } = this.state;

    return (

      <div style={{ display: displayCarrinho }}>

        <AppBar position="fixed" style={{ top: 'auto', bottom: 0 }}>
          <Link href={'/carrinho'} color="inherit" style={{ textDecoration: 'none' }}> 
            <Toolbar>
              <Grid container spacing={2}>
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                { contItens }x
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  Carrinho
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  R$ { total }
                </Grid>
              </Grid>
            </Toolbar>
          </Link>
        </AppBar>

      </div>

    );
  }
  
}
