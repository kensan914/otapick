import React from 'react';
import { withRouter } from 'react-router';

// TODO historyが0の時、すなわち初期状態はトップに戻るように。
class BackButton extends React.Component {
  goBack = () => {
    history.back();
  };

  render() {
    if (this.props.fixed) {
      return (
        <button onClick={this.goBack}
          className={"btn btn-light rounded-circle p-0 otapick-back-button-fixed shadow-sm " + (typeof this.props.className != "undefined" && this.props.className)}>
          <i className="fas fa-arrow-left" style={{ color: "gray" }}></i>
        </button>
      );
    } else {
      return (
        <button onClick={this.goBack}
          className={"btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm " + (typeof this.props.className != "undefined" && this.props.className)}>
          <i className="fas fa-arrow-left" style={{ color: "gray" }}></i>
        </button>
      );
    }
  };
};

export default withRouter(BackButton);