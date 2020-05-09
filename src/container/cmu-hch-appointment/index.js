import React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Row, Col } from "antd";
import { Card } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { Progress } from "antd";
import { Spin } from "antd";
import { Input } from "antd";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Worker from "./cmu.worker.js";
import styles from "./index.cssm";
import dayjs from "dayjs";
import _ from "lodash";
import Badge from "react-shields-badge";
import "react-shields-badge/dist/react-shields-badge.css";
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

function Layout() {
  const { room, timecode } = useParams();
  const [data, setData] = useState({ current_number: 0 });
  const [booking, setBooking] = useState(0);
  const [progress, setProgress] = useState({ percent: 100, status: "normal" });
  const [loading, setLoading] = useState(false);

  const onChangeBooking = useCallback((event) => {
    const val = _.toNumber(event.target.value);
    requestAnimationFrame(() => setBooking(val));
  }, []);

  useEffect(() => {
    if (!_.isEmpty(data)) setLoading(true);
    cvWorker = new Worker();
    cvWorker.postMessage({
      type: "fetch",
      room: room,
      timeCode: timecode,
    });
    cvWorker.onmessage = (res) => {
      setData(res.data);
      setLoading(false);
    };
    return () => {
      cvWorker && cvWorker.terminate();
    };
  }, [room, timecode]);

  // const goback = useHistory()
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
    let diff = _.subtract(booking, data.current_number);
    let percent = _.divide(data.current_number, booking) * 100;
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
    setProgress({ percent, status });
  }, [booking, data.current_number]);

  useEffect(() => {}, [booking, data.current_number]);

  return (
    <div className={styles.content}>
      <Card
        title={title}
        loading={_.isEmpty(data.room)}
        className={styles.card}
      >
        <Spin spinning={loading}>
          <Row className={styles.row}>
            <Col xs={24}>
              <div>
                <Badge data={["看診時段", timeText]} />
              </div>
              <div>
                <Badge data={["最近更新", dayjs().format("MM-DD HH:mm")]} />
              </div>
              <div>
                <Badge data={["總人數", data.total]} />
              </div>
              <div>
                <Badge data={["過號人數", _.size(data.register)]} />
              </div>
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
            <Input
              style={{ width: 100 }}
              min={0}
              max={1024}
              type="number"
              placeholder="就診號"
              onChange={onChangeBooking}
            />
          </Row>
        </Spin>
      </Card>
    </div>
  );
}

export default React.memo(Layout);
