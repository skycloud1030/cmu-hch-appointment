import React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Row, Col } from "antd";
import { Card } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { Progress } from "antd";
import { Spin } from "antd";
import { Input } from "antd";
import { Button } from "antd";
import { Empty } from "antd";
import { Switch } from "antd";
import { Space } from "antd";
import { BackTop } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Layout } from "antd";

import useNotification from "../../hooks/useNotification.js";
import Worker from "./cmu.worker.js";
import styles from "./index.cssm";
import NotifiForm from "./notification-form.js";
import dayjs from "dayjs";
import AppoList from "./list.js";
import _ from "lodash";
import Badge from "react-shields-badge";
import "react-shields-badge/dist/react-shields-badge.css";

const { Header, Content } = Layout;

let cvWorker;

const Title = React.memo((props) => {
  const history = useHistory();
  const onGobak = useCallback(() => {
    history.push("/appointment");
  }, []);

  return (
    <Row className={styles.title}>
      <Col xs={24}>
        <Button
          type="primary"
          shape="circle"
          onClick={onGobak}
          icon={<HomeOutlined />}
          className={styles.back}
          size="large"
        />
        {props.room}
      </Col>
    </Row>
  );
});

function Main() {
  const { room, timecode } = useParams();
  const [data, setData] = useState({ current_number: 0 });
  const [bookingNumber, setBookingNumber] = useState(0);
  const [progress, setProgress] = useState({ percent: 100, status: "normal", waiting: 0 });
  const [loading, setLoading] = useState(false);
  const [notifySwitch, setNotify] = useState(false);
  const notify = useNotification();

  const onChangeBookingNumber = useCallback((event) => {
    const val = _.toNumber(event.target.value);
    requestAnimationFrame(() => setBookingNumber(val));
  }, []);

  const onEnter = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.blur();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(data)) setLoading(true);
    cvWorker = new Worker();
    cvWorker.postMessage({
      type: "fetch",
      room: room,
      timeCode: timecode,
    });
    cvWorker.onmessage = ({ data }) => {
      setData(data);
      setLoading(false);
    };
    return () => {
      cvWorker && cvWorker.terminate();
    };
  }, [room, timecode]);

  const title = <Title room={data.room} />;
  const timeText = useMemo(() => {
    switch (timecode) {
      case "1":
        return "上午";
      case "2":
        return "下午";
      case "3":
        return "晚上";
    }
  }, [timecode]);

  useEffect(() => {
    let diff = _.subtract(bookingNumber, data.current_number);
    let percent = _.divide(data.current_number, bookingNumber) * 100;
    const waiting = _.size(_.filter(
      data.appointment_list,
      (item) => item.status == "unregistered" && item.number >= data.current_number && item.number < bookingNumber
    ));
    let status;

    switch (true) {
      case diff <= 20 && diff > 0:
        status = "exception";
        break;
      case diff == 0:
        status = "success";
        break;
      default:
        status = "active";
        break;
    }
    percent = diff > 0 ? percent : 100;

    setProgress({ percent, status, waiting });
  }, [bookingNumber, data.current_number]);

  useEffect(() => {
    if (notifySwitch) {
      notify(`診間目前燈號: ${data.current_number}`);
    }
  }, [notifySwitch, data.current_number]);

  const progress_realTime = useMemo(() => {
    const { type } = data;
    if (type == "error") {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="查無資料" />
      );
    }
    return (
      <>
        <Row className={styles.row}>
          <Col xs={24}>
            <Space direction="vertical">
              <Badge data={["看診時段", timeText]} />
              <Badge data={["最近更新", dayjs().format("MM-DD HH:mm")]} />
              <Badge data={["總人數", data.total]} />
              <Badge data={["過號人數", _.size(data.unregistered)]} />
              {
                progress.waiting ? <Badge data={["等待人數", progress.waiting]} /> : null
              }
            </Space>
          </Col>
          <Col xs={24}>
            <div className={styles.center}>
              <Progress
                type="circle"
                percent={progress.percent}
                status={progress.status}
                width={180}
                strokeWidth={8}
                format={() => (
                  <>
                    <div
                      className={styles.subTitle}
                    >{`${data.current_number}`}</div>
                  </>
                )}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <NotifiForm>
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
                onChange={onChangeBookingNumber}
                onPressEnter={onEnter}
              />
            </Space>
          </NotifiForm>
        </Row>
      </>
    );
  }, [data, progress]);

  return (
    <div className={styles.container}>
      <Layout className={styles.layout}>
        <Header className={styles.header}>{title}</Header>
        <Content className={styles.content}>
          <Space direction="vertical" className={styles.space} size={12}>
            <Card loading={!data.init} className={styles.card}>
              <Spin spinning={loading}>{progress_realTime}</Spin>
            </Card>

            <Card loading={!data.init} className={styles.card}>
              <Spin spinning={loading}>
                <AppoList
                  data={data.list}
                  current_number={data.current_number}
                />
              </Spin>
            </Card>
            <BackTop />
          </Space>
        </Content>
      </Layout>
    </div>
  );
}

export default React.memo(Main);
