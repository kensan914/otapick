import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { shortenNum, generateAlt, isMobile, isSmp } from "../modules/utils";
import { MobileBottomMenu } from "./MobileMenu";
import {
  faBars,
  faCrown,
  faDownload,
  faExternalLinkAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GROUPS } from "../modules/env";
import TooltipComponent from "../atoms/TooltipComponent";

const DetailButton = (props) => {
  return (
    <UncontrolledDropdown
      className="col-4 text-center"
      style={{ overflowY: "visible" }}
    >
      <div className="card-detail-button-super">
        <DropdownToggle
          color="light"
          className="p-0 card-detail-button rounded-circle"
        >
          <FontAwesomeIcon icon={faBars} style={{ color: "gray" }} />
        </DropdownToggle>
        <DropdownMenu className="bold">
          <DropdownItem tag={Link} to={props.url}>
            ダウンロードページへ
          </DropdownItem>
          <DropdownItem href={props.officialUrl} target="_blank">
            公式ブログで確認
          </DropdownItem>
        </DropdownMenu>
      </div>
    </UncontrolledDropdown>
  );
};

class SuperBlogCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mountedBlogCard: false,
      isLoadImage: false,
    };

    this.src = isSmp ? this.props.thumbnail["250x"] : "";
    this.srcset = !isSmp
      ? `${this.props.thumbnail["250x"]} 1x, ${this.props.thumbnail["500x"]} 2x`
      : "";
  }

  componentDidMount() {
    this.setState({ mountedBlogCard: true });

    if (!this.props.orderly) {
      // preload thumbnail
      const imageObject = new Image();
      imageObject.onload = () => {
        this.setState({ isLoadImage: true });
      };
      imageObject.src = this.src;
      imageObject.srcset = this.srcset;
    }
  }

  render() {
    const formatWidth =
      Number.isFinite(this.props.width) && this.props.width > 0
        ? this.props.width
        : 250;
    const formatHeight =
      Number.isFinite(this.props.height) && this.props.height > 0
        ? this.props.height
        : 250;
    const groupKey = GROUPS[this.props.groupID]?.key;

    return (
      <div className={"otapick_card " + this.props.group}>
        <div className="card border border-top-0">
          <div className="l-thumbnail">
            <Link to={this.props.url}>
              <figure
                className={
                  isMobile ? "thumbnail-wrapper-mobile" : "thumbnail-wrapper"
                }
              >
                {this.props.orderly ? (
                  <img
                    className="card-img-top newpost-thumbnail"
                    style={{ borderRadius: "0" }}
                    src={this.props.thumbnail["500x"]}
                    alt={generateAlt(
                      this.props.group,
                      this.props.writer.name,
                      "thumbnail"
                    )}
                  />
                ) : this.state.isLoadImage ? (
                  <img
                    className="card-img-top"
                    style={{ borderRadius: "0" }}
                    src={this.src}
                    srcSet={this.srcset}
                    alt={generateAlt(
                      this.props.group,
                      this.props.writer.name,
                      "thumbnail"
                    )}
                  />
                ) : (
                  <div className="image-card-preload-img-wrapper">
                    <div
                      className={`image-card-preload-img ${groupKey}`} // groupKeyはnotUsed
                      style={{
                        backgroundColor: "lightgray",
                        paddingTop: `${(formatHeight / formatWidth) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </figure>
            </Link>
            {!isMobile && (
              <span className="more-button">
                <div className="row justify-content-around">
                  <TooltipComponent title="公式ブログで確認">
                    <div
                      className="col-4 p-0 mr-2"
                      id={`to-official-page-${this.props.id}`}
                    >
                      <a
                        rel="noreferrer"
                        href={this.props.officialUrl}
                        style={{ color: "white" }}
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </div>
                  </TooltipComponent>
                  <TooltipComponent title="ダウンロードページへ">
                    <div
                      className="col-4 p-0 ml-2"
                      id={`to-download-page-${this.props.id}`}
                    >
                      <Link to={this.props.url} style={{ color: "white" }}>
                        <FontAwesomeIcon icon={faDownload} />
                      </Link>
                    </div>
                  </TooltipComponent>
                </div>
              </span>
            )}
          </div>
          <div className="card-body pb-0 px-3 px-sm-4 pt-3">
            <Link to={this.props.url} style={{ color: "dimgray" }}>
              <h6
                className={
                  "card-title blog-title " +
                  (this.props.orderly ? "omit-title" : "")
                }
              >
                {!this.props.title ? "\u00A0" : this.props.title}
              </h6>
            </Link>
            <div className="row">
              <Link
                to={this.props.writer.url["blogs"]}
                className={
                  "card-text ml-3 small mb-2 pb-0 card-info writer-name " +
                  this.props.group
                }
              >
                {this.props.writer.name}
              </Link>
              <p className="card-text ml-3 small mb-2 pb-0 card-info">
                {this.props.postDate}
              </p>
            </div>

            <div className="container mb-2">
              <div className="row">
                <div className="col-4 card-parameter d-flex justify-content-center align-items-center">
                  <div className="row justify-content-around">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faEye} style={{ color: "gray" }} />
                    </div>
                    &nbsp;
                    <div className="card-parameter-num">
                      {shortenNum(this.props.numOfViews)}
                    </div>
                  </div>
                </div>

                {isMobile ? (
                  <MobileBottomMenu
                    id={this.props.id}
                    type="blogCard"
                    title={`${this.props.title}（${this.props.writer.name}）`}
                    url={this.props.url}
                    officialUrl={this.props.officialUrl}
                    writer={this.props.writer}
                    className="col-4"
                  />
                ) : (
                  <DetailButton
                    url={this.props.url}
                    officialUrl={this.props.officialUrl}
                  />
                )}

                <div className="col-4 card-parameter d-flex justify-content-center align-items-center">
                  <div className="row justify-content-around">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faDownload}
                        style={{ color: "gray" }}
                      />
                    </div>
                    &nbsp;
                    <div className="card-parameter-num">
                      {shortenNum(this.props.numOfDownloads)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const OrderlyBlogCard = withRouter((props) => (
  <div className="otapick-card-back blog-card col-6 col-md-4 col-lg-3 mb-3 px-2 px-sm-3">
    <SuperBlogCard {...props} orderly={true} />
  </div>
));

class BlogCard extends React.Component {
  render() {
    return (
      <>
        <div className="otapick-card-back">
          <SuperBlogCard {...this.props} orderly={false} />
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

// 1ページに数百単位でレンダリングされるコンポーネントのため、BlogCardのprops・stateに変更があったときのみ再レンダー
export default React.memo(withRouter(BlogCard));
