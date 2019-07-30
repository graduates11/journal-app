import React from "react";

export const Store = React.createContext();

const initialState = {
  date: "",
  entry: null,
  allEntries: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATE":
      return {
        date: action.payload.date,
        allEntries: state.allEntries,
        entry: state.entry
      };
    case "GET_ENTRY":
      return {
        date: state.date,
        entry: action.payload.entry,
        allEntries: state.allEntries
      };
    case "ADD_NEW_ENTRY":
      return {
        date: state.date,
        entry: action.payload.entry,
        allEntries: [...state.allEntries].concat(action.payload.entry)
      };
    case "GET_ALL_ENTRIES":
      return {
        date: action.payload.date,
        allEntries: action.payload.allEntries,
        entry: state.entry
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
