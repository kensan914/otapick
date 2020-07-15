import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


class SortButton extends React.Component {
  render() {
    return (
      <UncontrolledDropdown className={"p-0 " + this.props.className} style={this.props.style}>
        <DropdownToggle caret color="light" className="blogList-detail-btn sort-button">
          <i className="fas fa-sort"></i>{this.props.title}
        </DropdownToggle>

        <DropdownMenu>
          {this.props.type == "images" &&
            <DropdownItem onClick={() => this.props.pushHistory({ "sort": "recommend" })}>おすすめ順</DropdownItem>
          }
          <DropdownItem onClick={() => this.props.pushHistory({ "sort": "newer_post" })}>新着順</DropdownItem>
          <DropdownItem onClick={() => this.props.pushHistory({ "sort": "older_post" })}>古い順</DropdownItem>
          <DropdownItem onClick={() => this.props.pushHistory({ "sort": "popularity" })}>人気順</DropdownItem>
          <DropdownItem onClick={() => this.props.pushHistory({ "sort": "dl" })}>DL順</DropdownItem>
          {this.props.type == "blogs" &&
            <DropdownItem onClick={() => this.props.pushHistory({ "sort": "sum_dl" })}>総DL順</DropdownItem>
          }
          <DropdownItem onClick={() => this.props.pushHistory({ "sort": "view" })}>閲覧数順</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  };
};

export default SortButton;