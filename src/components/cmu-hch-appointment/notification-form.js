import React, { useCallback, useEffect } from "react";
import { Modal } from "antd";
import { useState } from "react";
import { Button } from "antd";
import { NotificationOutlined } from "@ant-design/icons";

function NotifiForm(props) {
  const [visible, setVisible] = useState(false);
  const onModalSwitch = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  return (
    <>
      <Button
        shape="round"
        onClick={onModalSwitch}
        icon={<NotificationOutlined />}
      >
        系統通知
      </Button>
      <Modal
        title="系統通知"
        visible={visible}
        closable={false}
        footer={[
          <Button key="submit" type="primary" onClick={onModalSwitch}>
            關閉
          </Button>,
        ]}
      >
        <Space direction="vertical">
          <div>
            <Switch
              checkedChildren="開啟"
              unCheckedChildren="關閉"
              defaultChecked={notifySwitch}
              onChange={(checked) => setNotify(checked)}
            />
          </div>
          <Input
            style={{ width: 100 }}
            min={0}
            max={1024}
            type="number"
            placeholder="就診號"
            onChange={onChangeBooking}
            onPressEnter={onEnter}
          />
        </Space>
        {props.children}
      </Modal>
    </>
  );
}

export default React.memo(NotifiForm);
