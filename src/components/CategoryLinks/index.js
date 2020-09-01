import React, { useState } from 'react';
import { Link } from '@sitecore-jss/sitecore-jss-react';
import { graphql } from 'react-apollo';
import { loader as gqlLoader } from 'graphql.macro';
import moment from 'moment';

import { Fade, Paper, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { EnhancedTableHead, stableSort, getSorting } from '../../global/tableComponents';
import { LoadingResults, SearchError } from '../../global/searchComponents';

const categoryLinksQuery = gqlLoader('./categoryLinksQuery.graphql');

const useStyles = makeStyles(theme => ({
	paper: {
		width: '100%',
		padding: theme.spacing(2)
	},
	table: {
	},
	tableRow: {
	},
	tableCell: {
		fontSize: "small",
		padding: theme.spacing(0.5)
	},
  link: {
    fontSize: "small"
  }
}));

const CategoryLinks = (props) => {

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('link');

  const { searchResults, loading, error } = props.data;

	const handleRequestSort = (e, property) => {
		const isDesc = orderBy === property && order === 'desc';
		setOrder(isDesc ? 'asc' : 'desc');
		setOrderBy(property);
	};

  if(loading) {
		return (
			<LoadingResults />
		);
	}
	else if(error) {
		return (
      <SearchError />
		);
	}
  else if (searchResults !== undefined && props.categoryId !== '' && !loading) {
    return (
      <Fade in={true} {...{ timeout: 500 }}>
        <Paper className={classes.paper}>
          <Table className={classes.table}
                aria-labelledby="tableTitle"
                size="small"
                aria-label="enhanced table">
            <EnhancedTableHead classes={classes}
                              order={order}
                              orderBy={orderBy}
                              onRequestSort={handleRequestSort}
                              rowCount={searchResults.length}/>
            <TableBody>
              {stableSort(searchResults.links.targetItems.map(link => {
                return { id: link.id, 
                        link: link.linkUrl.jss, 
                        date: link.date.value }}), 
                getSorting(order, orderBy))
                .map((row, index) => {
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
                })}
            </TableBody>
          </Table>
        </Paper>
      </Fade>
    );
  }
  else {
    // No results yet, hide search results
    return ("");
  }
}
export default graphql(categoryLinksQuery, {
  skip: (props) => props === undefined || props.categoryId === undefined,
  options: (props) => {
    return {
      variables: {
        categoryId: props.categoryId
      }
    }
  }
})(CategoryLinks);