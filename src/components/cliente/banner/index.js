import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import api from '../../../services/api';

export default class Banner extends Component {

  state = {
    parametro: [],
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
    dom: false, 
  }

  async componentDidMount(){

    const result = await api.get('/parametro');
    this.setState({ parametro: result.data[0] });

    if(result.data[0].funcionamento_semana_seg === 1) {
      this.setState({ seg: true });
    }
    if(result.data[0].funcionamento_semana_ter === 1) {
      this.setState({ ter: true });
    }
    if(result.data[0].funcionamento_semana_qua === 1) {
      this.setState({ qua: true });
    }
    if(result.data[0].funcionamento_semana_qui === 1) {
      this.setState({ qui: true });
    }
    if(result.data[0].funcionamento_semana_sex === 1) {
      this.setState({ sex: true });
    }
    if(result.data[0].funcionamento_semana_sab === 1) {
      this.setState({ sab: true });
    }
    if(result.data[0].funcionamento_semana_dom === 1) {
      this.setState({ dom: true });
    }

  }

  render(){

    const { 

      parametro, 
      seg, 
      ter, 
      qua, 
      qui, 
      sex, 
      sab, 
      dom 
    
    } = this.state;

    return (
      
      <Card elevation={3}>
        <CardActionArea>
          <CardMedia
            image={`${ parametro.url_storage+parametro.imagem_02_loja+parametro.url_complet }`}
            style={{ height: 140 }}
          >
            <Avatar 
              src={`${ parametro.url_storage+parametro.imagem_01_loja+parametro.url_complet }`} 
              style={{ width: 80, height: 80, margin: 'auto', top: 50 }}
            />
          </CardMedia>
        </CardActionArea>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Grid container>
              <Grid item sm={6} xs={12}>
                <strong>Pedido mínino: R$ { parametro.pedido_minimo_loja }</strong>
              </Grid>
              <Grid item sm={6} xs={12}>
                <strong>Taxa de entrega: R$ { parametro.frete }</strong>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <strong>Endereço: {`${ parametro.endereco_loja }, ${ parametro.numero_loja }` }</strong>
              </Grid>
              <Grid item xs={12}>
                <strong>Horário: {`${ parametro.horario_ini_funcionamento_loja } a ${ parametro.horario_fim_funcionamento_loja }` }</strong>
              </Grid>
              <Grid item xs={12}>
                <strong>Contato: { parametro.contato_loja }</strong>
              </Grid>
              <Grid item xs={12}>
                <FormLabel component="legend">
                  <strong>Funcionamos</strong>
                </FormLabel>
                <FormControlLabel control={<Checkbox checked={ seg } />} label="Seg" />
                <FormControlLabel control={<Checkbox checked={ ter } />} label="Ter" />
                <FormControlLabel control={<Checkbox checked={ qua } />} label="Qua" />
                <FormControlLabel control={<Checkbox checked={ qui } />} label="Qui" />
                <FormControlLabel control={<Checkbox checked={ sex } />} label="Sex" />
                <FormControlLabel control={<Checkbox checked={ sab } />} label="Sab" />
                <FormControlLabel control={<Checkbox checked={ dom } />} label="Dom" />
              </Grid>
            </Grid> 
          </AccordionDetails>
        </Accordion>
      </Card>
    
    )

  }
  
}
