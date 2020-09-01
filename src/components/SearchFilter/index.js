import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, FormGroup, FormLabel, FormControl, FormControlLabel, Fade } from '@material-ui/core';

import SearchFilterValue from '../SearchFilterValue';
import { registerFilter } from '../../global/actions';
import { globalStateContext } from '../../AppRoot';

const useStyles = makeStyles(theme => ({
	root: {
		paddingLeft: 0,
		paddingRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
		verticalAlign: 'top',
		float: 'left'
	},
	paper: {
		width: '100%',
		padding: theme.spacing(2)
	},
	filterName: {
		fontWeight: 'bold'
	}
}));

const SearchFilter = (props) => {

	const [state, dispatch] = useContext(globalStateContext);
	if(state === undefined) {
		return null;
	}

	const { filters, isLoading } = state;

	const classes = useStyles();
	const filterName = props.fields.filterName.value.toLowerCase();
	const filter = filters.find(x => x.name === filterName);

	if(filter === undefined) {
		dispatch(registerFilter(filterName));
	}

	if(filter !== undefined && filter.values.length === 0) {
		return ("");
	}
	else {
		return (
			<Fade in={true} {...{ timeout: 500 }}>
				<div className={classes.root + " col-md-4 col-xs-12"}>
					<Paper className={classes.paper}>
						<FormLabel>
							Filter by <span className={classes.filterName}>{filterName}</span>
						</FormLabel>
						<FormControl component="fieldset" 
												className={classes.formControl}>
							<FormGroup>
								{filter && filter.values.map((filterValue) => 
									<FormControlLabel	control={<SearchFilterValue key={filterValue.value}
																																filterValue={filterValue.value} 
																																filterName={filter.name}
																																isChecked={filterValue.isChecked}
																																disabled={isLoading} />}
																		label={<div className="text-truncate">
																						{filterValue.name + " (" + filterValue.count + ")"}
																					</div>}
									/>
								)}
							</FormGroup>
						</FormControl>
					</Paper>
				</div>
			</Fade>
		);
	}
};
export default SearchFilter;