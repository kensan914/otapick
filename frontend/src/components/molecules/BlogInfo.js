import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';


const BlogViewTooltip = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <Tooltip placement="top" isOpen={tooltipOpen} target={props.target} toggle={toggle} >
      {props.title}
    </Tooltip>
  )
}


class BlogInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let officialLinkTitle;
    if (this.props.group === "keyaki") officialLinkTitle = "keyakizaka.com";
    else if (this.props.group === "hinata") officialLinkTitle = "hinatazaka.com";

    return (
      <div className={"card otapick-card2 my-4 " + this.props.group}>
        <div className="card-body px-sm-5 py-4">
          <h4 className="">{!this.props.title ? "\u00A0" : this.props.title}</h4>
          <div className="row download-info mt-3">
            <Link to={this.props.writer.url} className={"card-text ml-3 small " + this.props.group}>
              {!this.props.writer.name ? "\u00A0" : this.props.writer.name}
            </Link>
            <p className="card-text ml-3 small">{this.props.postDate}</p>
          </div>
          <hr />
          <div className="row ml-3">
            <div className="row col-7 col-md-8 col-lg-9">

              <div className="d-flex align-items-center" id="num-of-views-icon">
                <i className="fas fa-eye" style={{ color: "gray" }}></i>
              </div>
              <BlogViewTooltip target={"num-of-views-icon"} title="閲覧数" />
              {"\u00A0"}
              <div className="">
                {this.props.numOfViews}
              </div>

              <div className="d-flex align-items-center ml-3" id="num-of-downloads-icon">
                <i className="fas fa-download" style={{ color: "gray" }}></i>
              </div>
              <BlogViewTooltip target={"num-of-downloads-icon"} title="総ダウンロード数" />
              {"\u00A0"}
              <div className="">
                {this.props.numOfDownloads}
              </div>

            </div>

            <div className="col-5 col-md-4 col-lg-3">
              <a href={this.props.officialUrl} className={"text-center " + this.props.group} target="_blank" id="officialLink">
                <div className="download-official-a">
                  <i className="fas fa-external-link-alt"></i>{officialLinkTitle}
                </div>
              </a>
              <BlogViewTooltip target={"officialLink"} title="公式ブログで確認" />
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default withRouter(BlogInfo);