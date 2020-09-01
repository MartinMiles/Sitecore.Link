import React, { useEffect, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { loader as gqlLoader } from 'graphql.macro';

import { Fade, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TreeView, TreeItem } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { globalStateContext } from '../../AppRoot';
import GraphQLData from '../../lib/GraphQLData';
import CategoryLinks from '../CategoryLinks';
import { LoadingResults, SearchError } from '../../global/searchComponents';

const useStyles = makeStyles(theme => ({
	leftColumn: {
		paddingLeft: 0,
		paddingRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
		
		float: 'left',
		verticalAlign: 'top'
	},
	rightColumn: {
		paddingLeft: 0,
		paddingRight: 0,

    display: 'inline-block',
    verticalAlign: 'top'
	},
	paper: {
		width: '100%',
		padding: theme.spacing(2)
	},
	navLink: {
		fontWeight: 500
  },
	title: {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	column: {
		paddingLeft: 0,
		marginBottom: theme.spacing(2),

		display: 'inline-block',
		verticalAlign: 'top'
	},
	topicLabel: {
		fontWeight: "bolder",
		fontSize: "medium"
	},
	categoryLabel: {
		display: "flex"
	},
	categoryLinksCount: {
		marginLeft: "auto",
		color: "gray"
	}
}));

const CategoriesQuery = gqlLoader('./categoriesQuery.graphql');

const Categories = (props) => {

	const [state, dispatch] = useContext(globalStateContext);
	if(state === undefined) {
		return null;
	}
	const { results } = state;

	const classes = useStyles();
	const [categoryId, setCategoryId] = useState("");
	const [expanded, setExpanded] = useState([]);

	const graphQLResult = props.categoriesQuery;
	const { searchResults, loading, error } = graphQLResult;

	// Expand all categories on component loac
	useEffect(() => {
		if(searchResults !== undefined) {
			const topicsIds = searchResults.topics.map(topic => { return topic.id; });
			setExpanded(topicsIds);
		}
	}, [searchResults]);

	const handleChange = (event, nodes) => {
		setExpanded(nodes);
	};

	if(props.sitecoreContext.route.name === "home" && results.length > 0 ) {
		return ("");
	}
	else if(loading) {
		return (
			<LoadingResults />
		);
	}
	else if(error) {
		return (
			<SearchError />
		);
	}
	else {
		return (
			<div>
				<div className={classes.leftColumn + " col-lg-4 col-md-5 col-xs-12"}>
					<Fade in={true} {...{ timeout: 500 }}>
						<Paper className={classes.paper}>
							<NavLink to="/search" className={classes.navLink}>
								Search
							</NavLink>
							&nbsp;for links or
							<Typography variant="h6" 
													className={classes.title}>
								{props.fields.heading.value}
							</Typography>
							<TreeView	className={classes.treeView}
												defaultCollapseIcon={<ExpandMoreIcon />}
												defaultExpandIcon={<ChevronRightIcon />}
												expanded={expanded}
												onNodeToggle={handleChange}>
								{searchResults.topics.sort((a, b) => a.categoryId.value - b.categoryId.value)
																		.map((topic) => (
									<TreeItem nodeId={topic.id} 
														key={topic.id} 
														label={<div className={classes.topicLabel + " text-truncate"}>{topic.title.value}</div>}>
										{topic.categories.sort((a, b) => b.title.value - a.title.value)
																		.map((category) => (
											<TreeItem nodeId={category.id}
																key={category.id}
																label={ <div className={classes.categoryLabel}>
																					<div className="text-truncate">{category.title.value}</div>
																					<div className={classes.categoryLinksCount}>{" (" + category.links.count + ")"}</div>
																				</div>}
																onClick={(e) => {setCategoryId(category.id)}} />
										))}
									</TreeItem>
								))}
							</TreeView>
						</Paper>
					</Fade>
				</div>
				<div className={classes.rightColumn + " col-lg-8 col-md-7 col-xs-12"}>
					<CategoryLinks categoryId={categoryId}/>
				</div>
			</div>
		);
	}
}
export default GraphQLData(CategoriesQuery, { name: 'categoriesQuery' })(Categories);