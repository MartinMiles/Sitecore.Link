import {
  REGISTER_FILTER,
  UPDATE_FILTER_VALUE,
  HANDLE_SEARCH_RESULT,
  UPDATE_SEARCH_TEXT,
  UPDATE_PAGE_NUM,
  UPDATE_PAGE_SIZE,
  SHOW_LOADING
} from "./constants";

export const initialState = {
  searchText: "",
  pageNum: 0,
  pageSize: 100,
  totalCount: 0,
	results: [],
	facets: [],
	pageInfo: {},
  filters: [],
  isLoading: false
};

export const stateReducer = (state = initialState, action) => {

  if(action === undefined) {
    return state;
  }

  switch (action.type) {

    case UPDATE_SEARCH_TEXT:
      state.searchText = action.searchText;
      return { 
        ...state,	
        searchText: action.searchText
      }

    // direct assignement to ensure it's updated for query
    case UPDATE_PAGE_NUM:
      state.pageNum = action.pageNum;
      return state;

    // direct assignement to ensure it's updated for query
    case UPDATE_PAGE_SIZE:
      state.pageSize = action.pageSize;
      state.pageNum = 0;
      return state;

    case SHOW_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case HANDLE_SEARCH_RESULT:
      return {
        ...state,
        results: action.results,
        facets: action.facets,
        filters: action.filters,
        pageInfo: action.pageInfo,
        totalCount: action.totalCount,
        isLoading: false
      }

    case REGISTER_FILTER:
      return handleRegisterFilter(state, action);

    case UPDATE_FILTER_VALUE:
      return handleUpdateFilterValue(state, action);
      
    default:
      return state;
  }
};

const handleRegisterFilter = (state, action) => {
  var filters = state.filters;
  if(state.filters.find(x => x.name === action.filterName) === undefined)
  {
    filters.push({ name: action.filterName, values: [] });
  }

  return {
    ...state,
    filters: filters
  };
};

const handleUpdateFilterValue = (state, action) => {
  var filters = state.filters;

  var filterToAmend = filters.find(x => x.name === action.filterName);
  var valueToAmend = filterToAmend.values.find(x => x.value === action.filterValue);
  valueToAmend.isChecked = !valueToAmend.isChecked;

  var otherCheckedValue = filterToAmend.values.find(x => x.value !== action.filterValue && x.isChecked);
  if(otherCheckedValue !== undefined) {
    otherCheckedValue.isChecked = false;
  }

  // direct assignement to ensure it's updated for query
  state.pageNum = 0;
  return {
    ...state,
    filters: filters
  }
};

export default stateReducer;