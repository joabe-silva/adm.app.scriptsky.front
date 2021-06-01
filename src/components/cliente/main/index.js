import React, {Component} from 'react';
import PreCarrinho from '../pre-carrinho';
import Grupos from '../grupos';
import Banner from '../banner';

export default class Main extends Component {

  render(){
    return (
      
      <div>
        <Banner />
        <Grupos />
        <PreCarrinho />
      </div>
    
    )
  }
  
}
