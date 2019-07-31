import React from "react";

export const Store = React.createContext();

const initialState = {
  date: new Date(),
  entry: null,
  allEntries: [],
  searchBoolean: false
};

function reducer(state, action) {
  const { date } = state;
  const allEntries = [...state.allEntries];
  const { entry } = state;
  const { searchResult } = state;
  switch (action.type) {
    case "SET_DATE": {
      const filteredEntry = state.allEntries.filter(
        entry => entry.date === action.payload.date.toDateString()
      )[0];
      return {
        date: action.payload.date,
        allEntries,
        entry: filteredEntry ? filteredEntry : null,
        searchBoolean: false
      };
    }
    case "GET_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries: state.allEntries,
        searchBoolean: false
      };
    case "ADD_NEW_ENTRY":
      return {
        date: action.payload.entry.date,
        entry: action.payload.entry,
        allEntries: [...state.allEntries].concat(action.payload.entry),
        searchBoolean: false
      };
    case "GET_ALL_ENTRIES":
      return {
        date: action.payload.date,
        allEntries: action.payload.allEntries,
        entry,
        searchBoolean: false
      };
    case "SEARCH":
      return {
        date,
        allEntries,
        entry,
        searchResult: action.payload.searchResult,
        searchBoolean: true
      };
    case "GET_SEARCH_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries,
        searchResult,
        searchBoolean: true
      };
    case "DELETE_ENTRY":
      return {
        date,
        allEntries: state.allEntries.filter(
          item => item.id !== action.payload.id
        ),
        entry: null,
        searchBoolean: false
      };
    case "UPDATE_ENTRY":
      return {
        date,
        allEntries: state.allEntries.map(item => {
          if (item.id === action.payload.entry.id) {
            item = action.payload.entry;
            return item;
          } else {
            return item;
          }
        }),
        entry: action.payload.entry,
        searchBoolean: false
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export const Consumer = Store.Consumer;
