import React from "react";
import { useState, useCallback } from "react";
import { Card } from "antd";
import { Input } from "antd";
import { Select } from "antd";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { AimOutlined } from "@ant-design/icons";
const { Option } = Select;
import styles from "./search.cssm";

function Search() {
  const [room, setRoom] = useState("");
  const [timecode, setTimecode] = useState("1");
  const history = useHistory();
  const onSearch = useCallback(() => {
    history.push(`/appointment/${room}/${timecode}`);
  }, [room, timecode]);

  return (
    <Card>
      <div>
        <Input
          min={0}
          max={2048}
          prefix={<AimOutlined />}
          type="number"
          placeholder="診間號碼"
          onChange={(e) => setRoom(e.target.value)}
          className={styles.input}
        />
      </div>
      <div>
        <Select
          defaultValue={timecode}
          className={styles.input}
          onChange={(value) => setTimecode(value)}
        >
          <Option value="1">上午</Option>
          <Option value="2">下午</Option>
          <Option value="3">晚上</Option>
        </Select>
      </div>
      <Button type="primary" onClick={onSearch}>
        查詢
      </Button>
    </Card>
  );
}

export default React.memo(Search);
