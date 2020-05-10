import React from "react";
import { Badge } from "antd";
import { List } from "antd";

function cacl_status(val) {
  let out = "";
  switch (val) {
    case "registered":
      out = "warning";
      break;
    case "success":
      out = "success";
      break;
    case "cancel":
      out = "default";
      break;
    default:
      out = "default";
      break;
  }
  return out;
}

function AppoList(props) {
  const { data, current_number } = props;
  return (
    <List
      bordered
      dataSource={data}
      renderItem={(item) => {
        const text = `${item.number} ${item.message}}`;
        let status = cacl_status(item.status);
        if (number == current_number) {
          status = "processing";
        }
        return (
          <List.Item>
            <Badge status={status} text={text} />
          </List.Item>
        );
      }}
    />
  );
}

export default React.memo(AppoList);
