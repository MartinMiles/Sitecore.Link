import {
  REGISTER_FILTER,
  UPDATE_FILTER_VALUE,
  HANDLE_SEARCH_RESULT,
  UPDATE_SEARCH_TEXT,
  UPDATE_PAGE_NUM,
  UPDATE_PAGE_SIZE,
  LINKS_SEARCH_QUERY,
  SHOW_LOADING
} from "./constants";

import GraphQLClientFactory from "../lib/GraphQLClientFactory";
import config from '../temp/config';

export const updateFilterValue = (filterName, filterValue) => ({
  type: UPDATE_FILTER_VALUE,
  filterName,
  filterValue
});

export const registerFilter = filterName => ({
  type: REGISTER_FILTER,
  filterName
});

export const updateSearchText = searchText => ({
  type: UPDATE_SEARCH_TEXT,
  searchText
});

export const updatePageNum = pageNum => ({
  type: UPDATE_PAGE_NUM,
  pageNum
});

export const updatePageSize = pageSize => ({
  type: UPDATE_PAGE_SIZE,
  pageSize
});

export const showLoading = () => ({
  type: SHOW_LOADING
});

export const runSearch = ([state, dispatch], isFiltering = false) => {
    return dispatch(fetchResults([state, dispatch], isFiltering));
};

const fetchResults = ([state, dispatch], isFiltering) => {
    const client = GraphQLClientFactory(config.graphQLEndpoint, false);

    var fieldsEqual = [];
    var filterNames = [];
    var pageStart = (state.pageNum * state.pageSize).toString();

    if(isFiltering) {
      state.filters.forEach((filter) => {
        if(filter.values.find(x => x.isChecked)) {
          fieldsEqual.push({
            name: filter.name,
            value: filter.values.find(x => x.isChecked).value
          });
        }
      });
    }
    filterNames = state.filters.map(x => x.name);

    const variables = {
      ...state,
      fieldsEqual,
      filterNames,
      pageStart
    };
    
    client.query({ 
      query: LINKS_SEARCH_QUERY, 
      variables: variables 
    }).then(results => dispatch(handleSearchResult(state, results.data.searchResults, isFiltering)));
};

const handleSearchResult = (state, searchResults, isFiltering) => ({
    type: HANDLE_SEARCH_RESULT,
    results: searchResults.results.items.map(result => result.item),
    facets: searchResults.facets,
    filters: calculateFilters(searchResults.facets, state.filters, isFiltering),
    pageInfo: searchResults.results.pageInfo,
    totalCount: searchResults.results.totalCount
  });

function calculateFilters(facets, filters, isFiltering) {
  var result = [];
  if(!isFiltering) {
    result = facets.map((facet) => {
      return {
        name: facet.name, 
        values: facet.values.map((val) => { 
        return {
          name: val.item !== null ? val.item.name : val.value, 
          value: val.value, 
          count: val.count,
          isChecked: false
      }})}
    })
  }
  else {
    result = filters.map((filter) => {
      return {
        name: filter.name, 
        values: filter.values.map((val) => { 
        return {
          name: val.name, 
          value: val.value, 
          count: val.count,
          isChecked: calculateIsChecked(filters, filter.name, val.value)
      }})}
    })    
  }
  return result;
}

function calculateIsChecked(filters, facetName, filterValue) {
  var filter = filters.find(x => x.name === facetName);
  var value = filter.values.find(x => x.value === filterValue);
  if(value !== undefined) {
    return value.isChecked;
  }
  return false;
}