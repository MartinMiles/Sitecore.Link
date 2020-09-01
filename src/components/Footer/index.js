import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	footer: {
    padding: theme.spacing(0.5),
    position: 'fixed',
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTop: '1px solid #dee2e6'
	}
}));

const Footer = (props) => {

  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <small>
        {props.fields.content.value}
      </small>
    </div>
  );
}
export default Footer;