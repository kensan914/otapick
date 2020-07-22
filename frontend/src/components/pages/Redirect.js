import React from 'react';
import { URLJoin } from '../tools/support';
import { withRouter } from 'react-router-dom';


class Redirect extends React.Component {
  constructor(props) {
    super(props);
    let url
    if (props.baseUrl.startsWith("/blogs")) {
      url = URLJoin(props.baseUrl, props.match.params.groupID, props.match.params.ct, props.location.search)
    } else if (props.baseUrl.startsWith("/blog")) {
      url = URLJoin(props.baseUrl, props.match.params.groupID, props.match.params.blogCt, props.location.search)
    } else if (props.baseUrl.startsWith("/members")) {
      url = URLJoin(props.baseUrl, props.location.search);
    }
    props.history.replace(url);
  }

  render() {
    return <></>;
  }
}

export default withRouter(Redirect);