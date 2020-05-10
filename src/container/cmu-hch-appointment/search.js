import React from "react";
import { useCallback } from "react";
import { Card } from "antd";
import { Input } from "antd";
import { Select } from "antd";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { AimOutlined } from "@ant-design/icons";
import { Form } from "antd";
import styles from "./search.cssm";

const { Option } = Select;

function Search() {
  const history = useHistory();
  const onFinish = useCallback(({ room, timecode }) => {
    history.push(`/appointment/${room}/${timecode}`);
  }, []);

  return (
    <Card>
      <div className={styles.content}>
        <Form
          onFinish={onFinish}
          name="search"
          initialValues={{ timecode: "1" }}
          className={styles.form}
        >
          <Form.Item
            label="看診時段"
            name="timecode"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="1">上午</Option>
              <Option value="2">下午</Option>
              <Option value="3">晚上</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="診間號碼"
            name="room"
            rules={[{ required: true, message: "請輸入診間號" }]}
          >
            <Input prefix={<AimOutlined />} />
          </Form.Item>
          <Form.Item className={styles.button}>
            <Button type="primary" htmlType="submit">
              查詢
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}

export default React.memo(Search);
