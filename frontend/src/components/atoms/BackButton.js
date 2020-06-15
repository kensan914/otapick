import React from 'react';
import { withRouter } from 'react-router';


class BackButton extends React.Component {
  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <button onClick={this.goBack} className="btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm back-from-download">
        <i className="fas fa-arrow-left" style={{ color: "gray" }}></i>
      </button>
    );
  };
};

export default withRouter(BackButton);