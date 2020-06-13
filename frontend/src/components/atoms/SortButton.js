import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


class SortButton extends React.Component {
  render() {
    return (
      <UncontrolledDropdown style={{ border: "solid 1px silver", borderRadius: "5%" }} className="col-5 p-0">
        <DropdownToggle caret color="light" className="blogList-detail-btn" style={{ width: "100%" }}>
          <i className="fas fa-sort"></i>{this.props.title}
        </DropdownToggle>

        <DropdownMenu>
          <DropdownItem onClick={() => this.props.pushHistory({"sort": "newer_post"})}>新着順</DropdownItem>
          <DropdownItem onClick={() => this.props.pushHistory({"sort": "older_post"})}>古い順</DropdownItem>
          <DropdownItem onClick={() => this.props.pushHistory({"sort": "popularity"})}>人気順</DropdownItem>
          <DropdownItem onClick={() => this.props.pushHistory({"sort": "dl"})}>DL順</DropdownItem>
          <DropdownItem onClick={() => this.props.pushHistory({"sort": "sum_dl"})}>総DL順</DropdownItem>
          <DropdownItem onClick={() => this.props.pushHistory({"sort": "view"})}>閲覧数順</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  };
};

export default SortButton;