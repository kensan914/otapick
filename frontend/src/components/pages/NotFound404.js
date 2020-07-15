import React from 'react';
import { NotFoundMessage } from '../atoms/NotFound';
import { setBodyPadding, isMobile, updateMeta, gtagTo } from '../tools/support';
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT } from '../tools/env';
import { withRouter } from 'react-router-dom';


class NotFound404 extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.footerRef !== null) {
      this.props.applyShowFooter(this.props.location);
    }
    if (isMobile) {
      setBodyPadding(NAVBAR_HEIGHT);
    }
    updateMeta({ title: "404 Page Not Found", discription: "" });
    gtagTo(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (this.props.footerRef !== prevProps.footerRef && this.props.footerRef !== null) {
      this.props.applyShowFooter(this.props.location);
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