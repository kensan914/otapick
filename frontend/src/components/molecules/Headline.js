import React from 'react';
import BackButton from '../atoms/BackButton';

class Headline extends React.Component {
  render() {
    return (
      <div className="row d-flex align-items-center">
        <BackButton />
        <h3 className="ml-3 my-0">{this.props.title}</h3>
      </div>
    );
  };
};

export default Headline;