import React from 'react';

import { TableHead, TableRow, TableCell, TableSortLabel } from '@material-ui/core';

export const stableSort = (array, cmp) => {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

export const desc = (a, b, orderBy) => {
	var valA = orderBy === "link" ? a[orderBy].value.text : a[orderBy];
	var valB = orderBy === "link" ? b[orderBy].value.text : b[orderBy];

	if (valB < valA) {
		return -1;
	}
	if (valB > valA) {
		return 1;
	}
	return 0;
}

export const getSorting = (order, orderBy) => {
	return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

export const headCells = [
	{ id: 'link', numeric: false, disablePadding: false, label: 'Link' },
	{ id: 'date', numeric: true, disablePadding: false, label: 'Date' },
];



export const EnhancedTableHead = (props) => {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map(headCell => (
					<TableCell key={headCell.id}
										 align={headCell.numeric ? 'right' : 'left'}
										 padding={headCell.disablePadding ? 'none' : 'default'}
										 sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel active={orderBy === headCell.id}
														direction={order}
														onClick={createSortHandler(headCell.id)}>
							{headCell.label}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}