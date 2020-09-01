import gql from "graphql-tag";

export const REGISTER_FILTER = "REGISTER_FILTER";
export const UPDATE_FILTER_VALUE = "UPDATE_FILTER_VALUE";
export const HANDLE_SEARCH_RESULT = "HANDLE_SEARCH_RESULT";
export const UPDATE_SEARCH_TEXT = "UPDATE_SEARCH_TEXT";
export const UPDATE_PAGE_NUM = "UPDATE_PAGE_NUM";
export const UPDATE_PAGE_SIZE = "UPDATE_PAGE_SIZE";
export const SHOW_LOADING = "SHOW_LOADING";

export const LINKS_SEARCH_QUERY = gql`
  query linksSearchQuery($searchText: String!, 
                         $filterNames: [String!], 
                         $fieldsEqual: [ItemSearchFieldQuery],
												 $pageStart: String,
                         $pageSize: Int) {
    searchResults: search(keyword: $searchText, 
                          fieldsEqual: $fieldsEqual,
                          index: "sitecore_web_link_index"
                          facetOn: $filterNames,
    										  after: $pageStart,
    										  first: $pageSize) {
      results {
        items {
          item {
            ... on PostLink {
              id
              title {
                value
              }
              linkUrl {
                jss
                text
                url
                linkType
              },
              date {
                value
              }
              category {
                value
              }
            }
          }
        }
        totalCount
        pageInfo {
          startCursor
          endCursor,
          hasPreviousPage,
          hasNextPage
        }
      }
      facets {
        name
        values {
          value
          item {
            name
          }
          count
        }
      }
    }
  }`;
