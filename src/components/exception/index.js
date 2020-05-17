import React from "react";
import classNames from "classnames";
import { Button } from "antd";
import { Link } from "react-router-dom";
import config from "./typeConfig";
import "./index.less";

const Exception = props => {
  const { className, linkElement = "a", type, title, desc, img, actions, ...rest } = props;
  const pageType = type in config ? type : "404";
  const clsString = classNames("exception", className);
  return (
    <div className={clsString} {...rest}>
      <div className="imgBlock">
        <div className="imgEle" style={{ backgroundImage: `url(${img || config[pageType].img})` }} />
      </div>
      <div className="content">
        <h1>{title || config[pageType].title}</h1>
        <div className="desc">{desc || config[pageType].desc}</div>
        <div className="actions">
          {actions || (
            <Link to={"/"}>
              <Button type="primary">HomePage</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exception;