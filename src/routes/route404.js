import React from "react";
import Exception from "../components/exception/index.js";
export default class Route404 extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return <Exception />;
  }
}