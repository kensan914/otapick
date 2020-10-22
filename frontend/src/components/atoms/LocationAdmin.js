import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { setInitLocationKey } from '../modules/utils';


class LocationAdmin extends Component {
  componentDidMount() {
    setInitLocationKey(this.props.location.key);
    window.scrollTo(0, 0);
  }

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

export default withRouter(LocationAdmin);