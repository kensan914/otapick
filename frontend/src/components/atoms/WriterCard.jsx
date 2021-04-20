import React from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faExternalLinkAlt,
  faImages,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import DropdownMobileFriendly from "../molecules/DropdownMobileFriendly";
import { isMobile } from "../modules/utils";

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
          alt={this.props.writer.name}
        />
        <h6 className="mx-2 mb-0">{this.props.writer.name}</h6>

        <DropdownMobileFriendly
          id="writer-card-menu"
          buttonClass="p-0 writer-card-detail-button rounded-circle"
          menuSettings={[
            ...(isMobile
              ? [
                  {
                    type: "TITLE",
                    label: this.props.writer.name,
                  },
                ]
              : []),
            {
              type: "LINK",
              pathname: this.props.writer.url["images"],
              label: "画像一覧へ",
              icon: faImages,
            },
            {
              type: "LINK",
              pathname: this.props.writer.url["blogs"],
              label: "ブログ一覧へ",
              icon: faNewspaper,
            },
            !this.props.writer.graduate
              ? {
                  type: "ANCHOR",
                  href: this.props.writer.officialUrl,
                  targetBlank: true,
                  label: "公式ブログで確認",
                  icon: faExternalLinkAlt,
                }
              : {},
          ]}
        >
          <FontAwesomeIcon icon={faAngleDown} />
        </DropdownMobileFriendly>
      </div>
    );
  }
}

export default withRouter(WriterCard);
