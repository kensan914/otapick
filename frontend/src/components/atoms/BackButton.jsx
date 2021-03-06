import React from "react";
import { withRouter } from "react-router";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { initLocationKey, isMobile } from "~/utils";

class BackButton extends React.Component {
  goBack = () => {
    if (initLocationKey === this.props.location.key) {
      this.props.history.push("/");
    } else {
      history.back();
    }
  };

  render() {
    if (this.props.mini) {
      return (
        <Button
          className={
            "rounded-circle transparent-button-mobile " +
            (isMobile ? "mobile " : " ") +
            (this.props.className ? this.props.className : "")
          }
          id="mobile-back-button"
          onClick={this.goBack}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
      );
    } else if (this.props.fixed) {
      return (
        <button
          onClick={this.goBack}
          className={
            "btn btn-light rounded-circle p-0 otapick-back-button-fixed shadow-sm " +
            (this.props.className ? this.props.className : "")
          }
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: "gray" }} />
        </button>
      );
    } else {
      return (
        <button
          onClick={this.goBack}
          className={
            "btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm " +
            (this.props.className ? this.props.className : "")
          }
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: "gray" }} />
        </button>
      );
    }
  }
}

export default withRouter(BackButton);
