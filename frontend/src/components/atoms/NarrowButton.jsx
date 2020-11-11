import React from 'react';
import { Button } from 'reactstrap';


class NarrowButton extends React.Component {
  render() {
    return (
      <>
        <Button id="narrowing" color="light" className="blogList-detail-btn col-5 narrow-button">
          <i className="fas fa-search"></i> 絞り込み
        </Button>
      </>
    );
  };
};

export default NarrowButton;