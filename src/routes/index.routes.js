import React from "react";
import { Route, Switch, Redirect } from "react-router";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../reducers/index.js";
import CmuHchAppointment from "../container/cmu-hch-appointment/index.js";
import Route404 from "./route404.js";

export const Router_List = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/appointment/511/1" />} />
      <Route exact path="/appointment/:room/:timecode" component={CmuHchAppointment} />
      <Route path="*" component={Route404} />
    </Switch>
  </ConnectedRouter>
);
export default Router_List;
