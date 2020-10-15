import React from "react";
import { GROUPS } from "../tools/env";


class OtapickButton extends React.Component {
  render() {
    let className = "";
    Object.values(GROUPS).forEach(groupObj => {
      if (groupObj.key === this.props.group) className = `gradient-btn ${groupObj.key}`;
    });

    let otapickButton;
    if (this.props.onClick) {
      otapickButton = (
        <button className={className} onClick={this.props.onClick}
          style={{ width: this.props.width + "px" }}>
          <b>{this.props.title}</b>
        </button>
      )
    } else {
      otapickButton = (
        <a href={this.props.href} className={className}
          style={{ width: this.props.width + "px" }}>
          <b>{this.props.title}</b>
        </a>
      )
    }
    return otapickButton;
  };
};

export default OtapickButton;