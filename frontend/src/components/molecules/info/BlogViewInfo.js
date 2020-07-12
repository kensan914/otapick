import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isSmp } from '../../tools/support';


export const ViewTooltip = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <Tooltip placement="top" isOpen={tooltipOpen} target={props.target} toggle={toggle} >
      {props.title}
    </Tooltip>
  )
}


class BlogViewInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let officialLinkTitle;
    if (this.props.group === "keyaki") officialLinkTitle = "keyakizaka.com";
    else if (this.props.group === "hinata") officialLinkTitle = "hinatazaka.com";

    return (
      <div className={"card otapick-card2 " + (isSmp ? "smp mb-3 " : "my-4 ") + this.props.group}>
        <div className="card-body px-4 px-sm-5 py-4">
          {this.props.title.length > 0
            ? (this.props.title.length > 50 ? <h5>{this.props.title}</h5> : <h4>{this.props.title}</h4>)
            : <h4>{"\u00A0"}</h4>
          }
          <div className="row download-info mt-3">
            {!Object.keys(this.props.writer).length
              ? <Link to="" className={"info-discription ml-3 small " + this.props.group}>{"\u00A0"}</Link>
              : <Link to={this.props.writer.url["blogs"]} className={"info-discription ml-3 small " + this.props.group}>
                {!this.props.writer.name ? "\u00A0" : this.props.writer.name}
              </Link>
            }
            <p className="info-discription ml-3 small mb-0">{this.props.postDate}</p>
          </div>
          <hr className="info-hr" />
          <div className="row ml-2 ml-sm-3">
            <div className="row col-12 col-sm-7 col-md-8 col-lg-9 col-xl-10 info-discription">
              <div className="d-flex align-items-center" id="num-of-views-icon">
                <i className="fas fa-eye" style={{ color: "gray" }}></i>
              </div>
              <ViewTooltip target={"num-of-views-icon"} title="閲覧数" />
              {"\u00A0"}
              <div className="">
                {this.props.numOfViews}
              </div>

              <div className="d-flex align-items-center ml-3" id="num-of-downloads-icon">
                <i className="fas fa-download" style={{ color: "gray" }}></i>
              </div>
              <ViewTooltip target={"num-of-downloads-icon"} title="総ダウンロード数" />
              {"\u00A0"}
              <div className="">
                {this.props.numOfDownloads}
              </div>

            </div>

            <div className="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 info-discription px-0 mt-2 mt-sm-0">
              <a href={this.props.officialUrl} className={this.props.group} target="_blank" id="officialLink">
                <div className="download-official-a">
                  <i className="fas fa-external-link-alt"></i>{"\u00A0"}{officialLinkTitle}
                </div>
              </a>
              <ViewTooltip target={"officialLink"} title="公式ブログで確認" />
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default withRouter(BlogViewInfo);