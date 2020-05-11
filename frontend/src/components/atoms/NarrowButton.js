import React from 'react';
import { Button } from 'reactstrap';


class NarrowButton extends React.Component {
  render() {
    return (
      <>
        <Button id="narrowing" color="light" className="blogList-detail-btn col-5"
          style={{ border: "solid 1px silver", borderRadius: "5%", backgroundColor: "#F4F3F3" }}>
          <i className="fas fa-search"></i> 絞り込み
        </Button>
      </>
    );
  };
};

export default NarrowButton;