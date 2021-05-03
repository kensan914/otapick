import React from "react";
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCrown,
  faExternalLinkAlt,
  faImages,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";

import { generateAlt, isMobile } from "~/utils";
import DropdownMobileFriendly from "~/components/molecules/DropdownMobileFriendly";

class MemberCard extends React.Component {
  render() {
    return (
      <>
        <div className={"member-card mx-auto " + this.props.belongingGroup}>
          <Link
            to={this.props.url["images"]}
            style={{ textDecoration: "none" }}
          >
            <div className={"member-card-header " + (!isMobile ? "pc" : "")}>
              <div
                className="member-card-overlay"
                style={{ backgroundImage: `url(${this.props.image})` }}
              ></div>
              <img
                src={this.props.image}
                className="mb-3 mb-sm-4"
                alt={generateAlt(
                  this.props.belongingGroup,
                  this.props.lastKanji + this.props.firstKanji,
                  "member"
                )}
              />
              <h4 className="m-0">
                {this.props.lastKanji} {this.props.firstKanji}
              </h4>
              <p style={{ color: "whitesmoke" }}>
                {this.props.lastKana} {this.props.firstKana}
              </p>
            </div>
          </Link>

          <svg
            className="waves"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use
                xlinkHref="#gentle-wave"
                x={this.props.wavesVals[0]}
                y="0"
                fill="rgba(255,255,255,0.7)"
              />
              <use
                xlinkHref="#gentle-wave"
                x={this.props.wavesVals[1]}
                y="3"
                fill="rgba(255,255,255,0.5)"
              />
              <use
                xlinkHref="#gentle-wave"
                x={this.props.wavesVals[2]}
                y="5"
                fill="rgba(255,255,255,0.3)"
              />
              <use
                xlinkHref="#gentle-wave"
                x={this.props.wavesVals[3]}
                y="7"
                fill="rgba(255,255,255)"
              />
            </g>
          </svg>

          <div className="member-card-body">
            <div className="card-detail-button-super">
              <DropdownMobileFriendly
                id={`member-card-detail-button-${this.props.id}`}
                buttonClass="p-0 card-detail-button rounded-circle"
                buttonContainerClass="text-center mx-auto py-3"
                buttonContainerStyle={{ overflowY: "visible" }}
                menuSettings={[
                  ...(isMobile
                    ? [
                        {
                          type: "TITLE",
                          label: `${this.props.lastKanji} ${this.props.firstKanji}`,
                        },
                      ]
                    : []),
                  {
                    type: "LINK",
                    pathname: this.props.url["images"],
                    label: "画像一覧へ",
                    icon: faImages,
                  },
                  {
                    type: "LINK",
                    pathname: this.props.url["blogs"],
                    label: "ブログ一覧へ",
                    icon: faNewspaper,
                  },
                  !this.props.graduate
                    ? {
                        type: "ANCHOR",
                        href: this.props.officialUrl,
                        targetBlank: true,
                        label: "公式ブログで確認",
                        icon: faExternalLinkAlt,
                      }
                    : {},
                ]}
              >
                <FontAwesomeIcon icon={faBars} style={{ color: "gray" }} />
              </DropdownMobileFriendly>
            </div>
          </div>
        </div>
        {this.props.message && (
          <div className="card-message mx-auto py-2">
            <FontAwesomeIcon icon={faCrown} style={{ color: "gold" }} />
            {"\u00A0"}
            <b>{this.props.message}</b>
          </div>
        )}
      </>
    );
  }
}

export default withRouter(MemberCard);
