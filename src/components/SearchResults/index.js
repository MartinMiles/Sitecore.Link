import React, { useContext, useState } from 'react';
import { Link } from '@sitecore-jss/sitecore-jss-react';
import moment from 'moment';

import { Fade, Paper, Table, TableBody, TableRow, TableCell, TablePagination, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { globalStateContext } from '../../AppRoot';
import { runSearch, showLoading, updatePageNum, updatePageSize } from '../../global/actions';
import { EnhancedTableHead, stableSort, getSorting } from '../../global/tableComponents';
import { LoadingResults, SearchError, NoResults } from '../../global/searchComponents';
//import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
	root: {
		paddingLeft: 0,
		paddingRight: 0,
		verticalAlign: 'top',
		display: 'inline-block',
		width: '100%',
		[theme.breakpoints.up('768')]: {
			display: 'flex',
			width: 'auto'
		}
	},
	paper: {
		width: '100%',
		padding: theme.spacing(2),
		marginBottom: theme.spacing(1)
	},
	table: {
	},
	tableRow: {
	},
	tableCell: {
		fontSize: "small",
		padding: theme.spacing(0.5)
	},
	noResults: {
		textAlign: 'center'
	},
	searchText: {
		fontWeight: 'bold'
	}
}));

const SearchResults = (props) => {

	const [state, dispatch] = useContext(globalStateContext);
	if(state === undefined) {
		return null;
	}
	const { results, isLoading, error, facets, pageNum, pageSize, totalCount } = state;

	const classes = useStyles();
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('link');

	const handleRequestSort = (e, property) => {
		const isDesc = orderBy === property && order === 'desc';
		setOrder(isDesc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	const handleChangePageNum = (e, pageNum) => {
		dispatch(updatePageNum(pageNum));
		dispatch(showLoading());
		dispatch(runSearch([state, dispatch], true));
	};

	const handleChangePageSize = e => {
		var pageSize = parseInt(e.target.value, 10);
		dispatch(updatePageSize(pageSize));
		dispatch(showLoading());
		dispatch(runSearch([state, dispatch], true));
	};

	if (isLoading) {
		return (
			<div className={classes.root}>
				<LoadingResults />
			</div>
		);
	}
	else if(error) {
		return (
			<SearchError />
		);
	}
	else if(results.length === 0 && facets.length === 0) {
		// No results yet, hide search results
		return ("")
	}
	else if(results.length === 0 && facets.find(x => x.name === "category").values.length === 0) {
		// No results returned
		return (
			<NoResults />
		);
	}
	else {
		return (
			<Fade in={true} {...{ timeout: 500 }}>
				<div className={classes.root + " col-md-8 col-xs-12"}>
					<Paper className={classes.paper}>
						<FormLabel>Results</FormLabel>
						<Table className={classes.table}
									aria-labelledby="tableTitle"
									size="small"
									aria-label="enhanced table">
							<EnhancedTableHead classes={classes}
																order={order}
																orderBy={orderBy}
																onRequestSort={handleRequestSort}
																rowCount={results.length}/>
							<TableBody>
								{stableSort(results.map(result => {
									return { id: result.id, 
													link: result.linkUrl.jss, 
													date: result.date.value }}), 
									getSorting(order, orderBy))
									.map(row => {
										return (
											<TableRow	tabIndex={-1}
																key={row.id}
																className={classes.tableRow}>
												<TableCell scope="row" 
																	padding="default" 
																	className={classes.tableCell}>
													<Link field={row.link} 
																target="_blank" 
																rel="noopener noreferrer" />
												</TableCell>
												<TableCell align="right" 
																	className={classes.tableCell}>
													{moment(row.date).format('DD MMM YY')}
												</TableCell>
											</TableRow>
										);
									})
								}
							</TableBody>
						</Table>
						<TablePagination rowsPerPageOptions={[10, 50, 100, 200]}
														component="div"
														count={totalCount}
														rowsPerPage={pageSize}
														page={pageNum}
														onChangePage={handleChangePageNum}
														onChangeRowsPerPage={handleChangePageSize}/>
					</Paper>
				</div>
			</Fade>
		);
	}
}
export default SearchResults;