import React from 'react';


class OtapickButton extends React.Component {
  render() {
    let className = "hinata";
    if (this.props.group === "keyaki"){
      className = "gradient-btn keyaki";
    } else if (this.props.group === "hinata") {
      className = "gradient-btn hinata";
    };
    return (
      <a href={this.props.href} className={className}
        style={{ width: this.props.width+"px" }}>
        <b>{this.props.title}</b>
      </a>
    );
  };
};

export default OtapickButton;