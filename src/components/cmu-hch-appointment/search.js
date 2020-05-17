import React from "react";
import { useCallback } from "react";
import { Card } from "antd";
import { Input } from "antd";
import { Select } from "antd";
import { Button } from "antd";
import { AimOutlined } from "@ant-design/icons";
import { Form } from "antd";
import styles from "./search.cssm";

const { Option } = Select;

function Search(props) {
  const { room, timecode } = props;
  const { onFinish } = props;
  return (
    <Card>
      <div className={styles.content}>
        <Form
          onFinish={onFinish}
          name="search"
          className={styles.form}
          initialValues={{ room, timecode }}
        >
          <Form.Item
            name="room"
            rules={[{ required: true, message: "請輸入診間號" }]}
          >
            <Input placeholder="診間號碼" prefix={<AimOutlined />} />
          </Form.Item>
          <Form.Item
            name="timecode"
            rules={[{ required: true, message: "請選擇時段" }]}
          >
            <Select placeholder="看診時段">
              <Option value="1">上午</Option>
              <Option value="2">下午</Option>
              <Option value="3">晚上</Option>
            </Select>
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
