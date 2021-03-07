import React from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { isMobile } from "../modules/utils";
import { MobileBottomMenu } from "../molecules/MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

class DetailButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));
  }

  render() {
    return (
      <ButtonDropdown
        direction="right"
        isOpen={this.state.dropdownOpen}
        toggle={this.toggle}
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownToggle
          color="light"
          className="p-0 writer-card-detail-button rounded-circle"
        >
          <FontAwesomeIcon icon={faAngleDown} />
        </DropdownToggle>
        <DropdownMenu className="bold">
          <DropdownItem tag={Link} to={this.props.writer.url["images"]}>
            画像一覧へ
          </DropdownItem>
          <DropdownItem tag={Link} to={this.props.writer.url["blogs"]}>
            ブログ一覧へ
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

class WriterCard extends React.Component {
  render() {
    return (
      <div
        className="rounded-pill d-flex writer-card p-1 align-items-center border shadow-sm"
        onClick={() => this.props.history.push(this.props.writer.url["images"])}
      >
        <img
          className="rounded-circle writer-card-image"
          src={this.props.writer.image}
        ></img>
        <h6 className="mx-2 mb-0">{this.props.writer.name}</h6>
        {isMobile ? (
          <MobileBottomMenu
            id="writer-card-menu"
            type="writerCard"
            title={this.props.writer.name}
            url={this.props.writer.url}
            officialUrl={this.props.writer.official_url}
          />
        ) : (
          <DetailButton writer={this.props.writer} />
        )}
      </div>
    );
  }
}

export default withRouter(WriterCard);
