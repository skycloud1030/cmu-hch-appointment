import { connect } from "react-redux";
import { push } from "connected-react-router";
import Main from "../../components/cmu-hch-appointment/index.js";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const C_Main = connect(mapStateToProps, mapDispatchToProps)(Main);
export default C_Main;
