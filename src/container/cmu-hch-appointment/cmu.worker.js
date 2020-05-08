import iconv from "iconv-lite";
import _ from "lodash";

const cors = "https://skycloud1030-cors.herokuapp.com/";
// const regex_list = new RegExp(`<tr><td>\\w+</td>(.*)</tr>`, "g");
const regex_item = new RegExp("<td>(\\w+)</td><td.*>(\\S+)</td>");
const regex_list = new RegExp(`<tr>(.*)</tr>`, "g");
const regex_room = new RegExp(`<td.*>(.*)</td>`);
const regex_number = new RegExp(`(診間目前燈號:\\s?(\\d+).*)</font>`);

function cacl_status(val) {
  let out = "";
  switch (val) {
    case "未看診(已報到)":
      out = "registered";
      break;
    case "完成":
      out = "success";
      break;
    case "取消":
      out = "cancel";
      break;
    default:
      // 未看診
      out = "unregistered";
      break;
  }
  return out;
}

function fetch_data(room, timeCode) {
  const url = `http://211.21.176.86/cgi-bin/hc/reg64x.cgi?CliRoom=${room}&TimeCode=${timeCode}`;
  fetch(`${cors}${url}`)
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
      const str = iconv.decode(new Uint8Array(buffer), "big5");
      const result = str.match(regex_list);
      let [, room, number, info, ...rest] = result;
      let current_number = 0;
      let next_number;

      let match_room = room.match(regex_room);
      let match_info = info.match(regex_room);
      let match_number = number.match(regex_number);
      try {
        // number_info = match_number ? match_number[1] : "";
        room = match_room ? match_room[1] : "";
        info = match_info ? match_info[1] : "";
        current_number = match_number ? match_number[2] : 0;
      } catch {}

      const appointment_list = _.map(rest, (item) => {
        let [, number, message] = item.match(regex_item);
        let status = cacl_status(message);
        if (!next_number && number > current_number && status == "registered") {
          next_number = number;
        }
        return { number, message, status };
      });

      next_number = next_number ? next_number : 0;
      const register = _.filter(
        appointment_list,
        (item) => item.status == "registered" && item.number < current_number
      );

      self.postMessage({
        room,
        info,
        current_number,
        next_number,
        register,
        list: appointment_list,
      });
    });
}

let interval;
self.onmessage = ({ data }) => {
  switch (data.type) {
    case "fetch": {
      const { room = "511", timeCode = "1" } = data;
      interval && clearInterval(interval);

      fetch_data(room, timeCode);
      interval = setInterval(() => {
        fetch_data(room, timeCode);
      }, 30000);
    }
  }
};
