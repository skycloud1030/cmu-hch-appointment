import { combineReducers } from "redux";
import { createStore, applyMiddleware, compose } from "redux";
import { createHashHistory } from "history";
import { routerMiddleware, connectRouter } from "connected-react-router";
import thunk from "redux-thunk";
import preload from "./preload";
export const history = createHashHistory();

const search = (state={}, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      const { type, ...rest } = action;
      return { ...state, ...rest };
    default:
      return state;
  }
};

const Reducer = combineReducers({
  router: connectRouter(history),
  search,
});

const QMiddleWare = compose(
  applyMiddleware(routerMiddleware(history)),
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (f) => f
);
export const store = createStore(Reducer, preload, QMiddleWare);
