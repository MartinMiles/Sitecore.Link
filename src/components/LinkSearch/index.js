import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Paper, Button, TextField, makeStyles } from '@material-ui/core';

import { updateSearchText, runSearch, showLoading } from '../../global/actions';
import { globalStateContext } from '../../AppRoot';

const useStyles = makeStyles(theme => ({
	root: {
		marginBottom: theme.spacing(1),
	},
	paper: {
		padding: theme.spacing(2)
	},
	navLink: {
		fontWeight: 500
	},
  container: {
    display: 'flex',
		flexWrap: 'wrap',
		marginTop: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(0),
		marginRight: theme.spacing(1),
		width: theme.spacing(40)
	},
	searchButton: {
		color: "gray",
		marginTop: theme.spacing(1),
		height: theme.spacing(5)
	}
}));

const LinkSearch = (props) => {

	const [state, dispatch] = useContext(globalStateContext);
	if(state === undefined) {
		return null;
	}

	const { searchText, isLoading } = state;
	const [textInput, setTextInput] = useState(searchText);
	const classes = useStyles();

	const handleChange = (e) => {
		setTextInput(e.target.value);
	};

	const handleKeyUp = (e) => {
		if(e.keyCode === 13 && !isLoading && textInput.length >= 3) {
			dispatch(updateSearchText(textInput));
			dispatch(showLoading());
			dispatch(runSearch([state, dispatch], false));
		}
	};

	const handleClick = (e) => {
		if(textInput.length >= 3) {
			dispatch(updateSearchText(textInput));
			dispatch(showLoading());
			dispatch(runSearch([state, dispatch], false));
		}
	};

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<div>
					Browse by&nbsp;
					<NavLink to="/categories" 
									 className={classes.navLink}>
						Categories
					</NavLink>
					&nbsp;or
				</div>
				<div className={classes.container}>
					<TextField id="outlined-basic"
										 label={props.fields.placeholderText.value}
										 helperText={props.fields.helperText.value}
										 onChange={handleChange}
										 onKeyUp={handleKeyUp}
										 disabled={isLoading}
										 className={classes.textField}
										 margin="dense"
										 variant="outlined"
										 value={textInput}/>
					<Button variant="outlined"
									size="large"
									className={classes.searchButton}
									onClick={handleClick}
									disabled={isLoading}>
						{props.fields.buttonText.value}
					</Button>
				</div>
			</Paper>
		</div>
	);
}
export default LinkSearch;