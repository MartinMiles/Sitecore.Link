import React from 'react';
import { Image } from '@sitecore-jss/sitecore-jss-react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  header: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: 'white',
    borderBottom: '1px solid #dee2e6'
  },
  headerInner: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('768')]: {
      flexDirection: 'row',
    }
  },
  logoImage: {
    height: "40px",
    width: "auto",
    marginRight: theme.spacing(1)
  },
  titleImage: {
    height: "40px",
    width: "auto",
    marginBottom: "5px"
  },
  bannerWrapper: {
    [theme.breakpoints.up('768')]: {
      marginRight: 'auto'
    }
  },
  nav: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  navLink: {
    padding: theme.spacing(1),
    color: '#343a40'
  }
}));

const Header = (props) => {

  const classes = useStyles();

  return(
    <div className={classes.header}>
      <div className={classes.headerInner + " container"}>
        <div className={classes.bannerWrapper}>
          <NavLink to="/" className={classes.navLink}>
            <Image media={props.fields.logoImage} className={classes.logoImage} />
            <Image media={props.fields.titleImage} className={classes.titleImage} />
          </NavLink>
        </div>
        <nav className={classes.nav}>
          <NavLink to="/" className={classes.navLink}>
            Home
          </NavLink>
          <NavLink to="/categories" className={classes.navLink}>
            Categories
          </NavLink>
          <NavLink to="/search" className={classes.navLink}>
            Search
          </NavLink>
          <NavLink to="/about" className={classes.navLink}>
            About
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
export default Header;