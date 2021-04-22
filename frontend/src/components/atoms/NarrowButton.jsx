import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "reactstrap";

class NarrowButton extends React.Component {
  render() {
    return (
      <>
        <Button
          id="narrowing"
          color="light"
          className="blogList-detail-btn col-5 narrow-button"
        >
          <FontAwesomeIcon icon={faSearch} /> 絞り込み
        </Button>
      </>
    );
  }
}

export default NarrowButton;
