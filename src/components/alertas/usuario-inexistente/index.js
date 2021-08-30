import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AlertaUsuarioInexistente() {

  const classes = useStyles();
  const [state, setState] = React.useState({
    open: true,
    vertical: 'bottom',
    horizontal: 'right',
  });

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const { open, vertical, horizontal } = state;

  return (
    <div className={classes.root}>
      <Snackbar 
        open={open} 
        onClose={handleClose}
        autoHideDuration={6000} 
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity="warning">
          Usuario inexistente!
        </Alert>
      </Snackbar>
    </div>
  );
}
