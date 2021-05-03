import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  faBars,
  faChevronCircleRight,
  faCrown,
  faDownload,
  faExternalLinkAlt,
  faEye,
  faImages,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { shortenNum, generateAlt, isMobile, isSmp } from "~/utils";
import TooltipComponent from "~/components/atoms/TooltipComponent";
import DropdownMobileFriendly from "~/components/molecules/DropdownMobileFriendly";

class SuperBlogCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mountedBlogCard: false,
      isLoadThumbnail: false,

      src: this.props.thumbnail["250x"],
      srcset: !isSmp
        ? `${this.props.thumbnail["250x"]} 1x, ${this.props.thumbnail["500x"]} 2x`
        : "",
    };
  }

  componentDidMount() {
    this.setState({ mountedBlogCard: true });

    // preload image
    const thumbnailObject = new Image();
    thumbnailObject.onload = () => {
      this.setState({ isLoadThumbnail: true });
    };
    thumbnailObject.src = this.state.src;
    thumbnailObject.srcset = this.state.srcset;
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
                ) : this.state.isLoadThumbnail ? (
                  <img
                    className="card-img-top"
                    style={{ borderRadius: "0" }}
                    src={this.state.src}
                    srcSet={this.state.srcset}
                    alt={generateAlt(
                      this.props.group,
                      this.props.writer.name,
                      "thumbnail"
                    )}
                  />
                ) : (
                  <div className="preload-image-card-wrapper loading-background">
                    <div
                      className="preload-image-card-wrapper-before"
                      style={{
                        paddingTop: `${(formatHeight / formatWidth) * 100}%`,
                      }}
                    />
                    <div
                      className="preload-image-card"
                      style={{
                        backgroundColor: "whitesmoke",
                      }}
                    />
                  </div>
                )}
              </figure>
            </Link>
            {!isMobile && (
              <span className="more-button">
                <div className="row justify-content-around">
                  <div
                    className="col-4 p-0 mr-2"
                    id={`to-official-page-${this.props.id}`}
                  >
                    <TooltipComponent title="公式ブログで確認">
                      <a
                        rel="noreferrer"
                        href={this.props.officialUrl}
                        style={{ color: "white" }}
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </TooltipComponent>
                  </div>

                  <div
                    className="col-4 p-0 ml-2"
                    id={`to-download-page-${this.props.id}`}
                  >
                    <TooltipComponent title="ダウンロードページへ">
                      <Link to={this.props.url} style={{ color: "white" }}>
                        <FontAwesomeIcon icon={faDownload} />
                      </Link>
                    </TooltipComponent>
                  </div>
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

                <div className="col-4 card-detail-button-super">
                  <DropdownMobileFriendly
                    id={`blog-card-detail-button-${this.props.id}`}
                    buttonClass="p-0 card-detail-button rounded-circle"
                    buttonContainerClass=""
                    buttonContainerStyle={{ overflowY: "visible" }}
                    menuSettings={[
                      ...(isMobile
                        ? [
                            {
                              type: "TITLE",
                              label: `${this.props.title}（${this.props.writer.name}）`,
                            },
                          ]
                        : []),
                      {
                        type: "LINK",
                        pathname: this.props.url,
                        label: "詳細ページへ",
                        icon: faChevronCircleRight,
                      },
                      {
                        type: "ANCHOR",
                        href: this.props.officialUrl,
                        targetBlank: true,
                        label: "公式ブログで確認",
                        icon: faExternalLinkAlt,
                      },
                      {
                        type: "LINK",
                        pathname: this.props.writer.url["images"],
                        label: `「${this.props.writer.name}」の画像を探す`,
                        icon: faImages,
                      },
                      {
                        type: "LINK",
                        pathname: this.props.writer.url["blogs"],
                        label: `「${this.props.writer.name}」のブログを探す`,
                        icon: faNewspaper,
                      },
                    ]}
                  >
                    <FontAwesomeIcon icon={faBars} style={{ color: "gray" }} />
                  </DropdownMobileFriendly>
                </div>

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
