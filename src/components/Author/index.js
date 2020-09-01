import React from "react";
import { Text, RichText, Image } from '@sitecore-jss/sitecore-jss-react';

import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

const useStyles = makeStyles(theme => ({
	author: {
    width: '100%',
    minHeight: '550px',
    padding: theme.spacing(4),
    textAlign: 'center',
    fontSize: "small"
  },
  image: {
    width: '50%',
    height: '50%',
    borderRadius: '50%'
  },
  authorName : {
    fontSize: '2rem',
    fontWeight: '500'
  },
  icon: {
    fontSize: '3rem',
    borderRadius: '10%',
    color: '#686e71'
  },
  column: {
    display: 'inline-block',
    verticalAlign: 'top',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    marginBottom: theme.spacing(1)
  }
}));

const renderSocialMediaIcon = (link, icon) => {
  
  const classes = useStyles();

  if(link.href !== "") {
    switch (icon) {
      case "linkedIn":
        return (
          <a href={link.href} target={link.target} rel="noopener noreferrer">
            <LinkedInIcon className={classes.icon} />
          </a>
        );
      case "twitter":
        return (
          <a href={link.href} target={link.target} rel="noopener noreferrer">
            <TwitterIcon className={classes.icon} />
          </a>
        );
      case "blog":
        return (
          <a href={link.href} target={link.target} rel="noopener noreferrer">
            <AccountBoxIcon className={classes.icon} />
          </a>
        );
      default :
        break;
    }
  }
}

const Author = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.column + " col-lg-6 col-md-6 col-sm-12 col-xs-12"}>
      <Paper className={classes.author}>
        <Image media={props.fields.image} className={classes.image} />
        <div className={classes.authorName}><Text field={props.fields.name} className={classes.authorName} /></div>
        <p>
          { renderSocialMediaIcon(props.fields.linkedInUrl.value, "linkedIn") }
          { renderSocialMediaIcon(props.fields.twitterUrl.value, "twitter") }
          { renderSocialMediaIcon(props.fields.blogUrl.value, "blog") }
        </p>
        <RichText field={props.fields.description} />
      </Paper>
    </div>
  );
};
export default Author;