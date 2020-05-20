import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./reducers/index.js";
import Router from "./routes/index.routes.js";
import "./index.less";


ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("index")
);
