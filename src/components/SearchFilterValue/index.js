import React, { useContext } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import { globalStateContext } from '../../AppRoot';
import { updateFilterValue, runSearch, showLoading } from '../../global/actions'

const SearchFilterValue = (props) => {

	const [state, dispatch] = useContext(globalStateContext);
	if(state === undefined) {
		return null;
	}

	const handleCheckboxChange = () => {
		dispatch(updateFilterValue(props.filterName, props.filterValue));
		dispatch(showLoading());
		dispatch(runSearch([state, dispatch], true));
	}

	return (
		<div>
			<Checkbox checked={props.isChecked} 
								disabled={props.disabled}
								onChange={handleCheckboxChange}
								color="primary"/>
		</div>
)};
export default SearchFilterValue;