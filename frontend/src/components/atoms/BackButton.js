import React from 'react';
import { withRouter } from 'react-router';
import { initLocationKey, isMobile } from '../modules/support';
import { Button } from 'reactstrap';


class BackButton extends React.Component {
  goBack = () => {
    if (initLocationKey === this.props.location.key) {
      this.props.history.push("/")
    } else {
      history.back();
    }
  };

  render() {
    if (this.props.mini) {
      return (
        <Button className={"rounded-circle transparent-button-mobile " + (isMobile ? "mobile " : " ") + (this.props.className ? this.props.className : "")} id="mobile-back-button" onClick={this.goBack}>
          <i className="fas fa-chevron-left" />
        </Button>
      );
    } else if (this.props.fixed) {
      return (
        <button onClick={this.goBack}
          className={"btn btn-light rounded-circle p-0 otapick-back-button-fixed shadow-sm " + (this.props.className ? this.props.className : "")}>
          <i className="fas fa-arrow-left" style={{ color: "gray" }}></i>
        </button>
      );
    } else {
      return (
        <button onClick={this.goBack}
          className={"btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm " + (this.props.className ? this.props.className : "")}>
          <i className="fas fa-arrow-left" style={{ color: "gray" }}></i>
        </button>
      );
    }
  };
};

export default withRouter(BackButton);