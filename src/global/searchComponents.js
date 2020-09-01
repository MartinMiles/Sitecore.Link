import React from 'react';

import { Fade, Paper, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	paper: {
		width: '100%',
		padding: theme.spacing(2),
		marginBottom: theme.spacing(1),
	},
	noResults: {
		textAlign: 'center'
	},
	progress: {
		padding: theme.spacing(1)
	},
  colorPrimary: {
		backgroundColor: '#f2f5f7',
	},
	barColorPrimary: {
		backgroundColor: '#adb5bd',
	}
}));

export const NoResults = () => {
	const classes = useStyles();

	return (
		<Paper className={classes.paper}>
			<div className={classes.noResults}>
				No results
			</div>
		</Paper>
	);
}

export const SearchError = () => {

	return (
		<div className="alert alert-danger">
			Oops. Something gone wrong.
		</div>
	);
}

export const LoadingResults = () => {
	const classes = useStyles();

	return (
		<Fade in={true} {...{ timeout: 500 }}>
			<Paper className={classes.paper}>
				<p>Loading results...</p>
				<LinearProgress variant="indeterminate"
												className={classes.progress}
												classes={{colorPrimary: classes.colorPrimary, 
																	barColorPrimary:classes.barColorPrimary}} />
			</Paper>
		</Fade>
	)
}