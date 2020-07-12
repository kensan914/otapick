import React from 'react';
import { withRouter } from 'react-router';
import { initLocationKey } from '../tools/support';
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
        <Button className="rounded-circle transparent-button-mobile" id="mobile-back-button" onClick={this.goBack}>
          <i className="fas fa-chevron-left" />
        </Button>
      );
    } else if (this.props.fixed) {
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