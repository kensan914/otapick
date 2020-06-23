import { Component } from 'react';
import { withRouter } from 'react-router-dom';

class KeepScrollTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);

      document.activeElement.blur();
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(KeepScrollTop);