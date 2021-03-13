import React from "react";
import { NotFoundMessage } from "../atoms/NotFound";
import { setBodyPadding, isMobile, updateMeta, gtagTo } from "../modules/utils";
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT } from "../modules/env";
import { withRouter } from "react-router-dom";

class NotFound404 extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.footerRef !== null) {
      this.props.domDispatch({
        type: "APPLY_SHOW_FOOTER",
        location: this.props.location,
      });
    }
    if (isMobile) {
      setBodyPadding(NAVBAR_HEIGHT);
    }
    updateMeta({ title: "404 Page Not Found", description: "" });
    gtagTo(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.footerRef !== prevProps.footerRef &&
      this.props.footerRef !== null
    ) {
      this.props.domDispatch({
        type: "APPLY_SHOW_FOOTER",
        location: this.props.location,
      });
    }
  }

  componentWillUnmount() {
    if (isMobile) {
      setBodyPadding(NAVBAR_HEIGHT + SUB_NAVBAR_HEIGHT);
    }
  }

  render() {
    return (
      <div className="container mt-3 text-muted py-5">
        <NotFoundMessage type="404" margin={true} />
      </div>
    );
  }
}

export default withRouter(NotFound404);