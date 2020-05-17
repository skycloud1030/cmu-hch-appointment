import { connect } from "react-redux";
import { push } from "connected-react-router";
import Search from "../../components/cmu-hch-appointment/search.js";

const mapStateToProps = (state) => {
  return {
    timecode: state.search.timecode,
    room: state.search.room,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFinish: ({ room, timecode }) => {
      dispatch({ type: "SET_SEARCH", room, timecode });
      dispatch(push(`/appointment/${room}/${timecode}`));
    },
  };
};

const C_Search = connect(mapStateToProps, mapDispatchToProps)(Search);
export default C_Search;
