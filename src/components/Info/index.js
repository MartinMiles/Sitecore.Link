import React from "react";
import { RichText } from "@sitecore-jss/sitecore-jss-react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  info: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontSize: 'small'
	}
}));

const Info = (props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.info}>
      <RichText field={props.fields.content} />
    </Paper>
  );
};
export default Info;