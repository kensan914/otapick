import React, { useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip } from 'reactstrap';
import { Link } from 'react-router-dom';


const DetailButton = (props) => {
  return (
    <UncontrolledDropdown className="col-4 text-center" style={{ overflowY: "visible" }}>
      <div className="card-detail-button-super">
        <DropdownToggle id="thumbnailDetail" color="light" className="p-0 card-detail-button rounded-circle">
          <i className="fas fa-bars" style={{ color: "gray" }}></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem tag={Link} to={props.url}>ダウンロードページへ</DropdownItem>
          <DropdownItem href={props.officialUrl} target="_blank">公式ブログで確認</DropdownItem>
        </DropdownMenu>
      </div>
    </UncontrolledDropdown>
  );
};

const CardTooltip = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <Tooltip placement="top" isOpen={tooltipOpen} target={props.target} toggle={toggle} >
      {props.title}
    </Tooltip>
  )
}

class SuperBlogCard extends React.Component {
  render() {
    return (
      <div className={"otapick_card " + this.props.props.group}>
        <div className="card border border-top-0">
          <div className="l-thumbnail">
            <Link to={this.props.props.url}>
              <figure className="thumbnail-wrapper">
                <img className={"card-img-top " + (this.props.props.orderly ? "newpost-thumbnail" : "")} src={this.props.props.thumbnail} style={{ borderRadius: "0" }} />
              </figure>
            </Link>
            <span className="more-button">
              <div className="row justify-content-around">
                <div className="col-4 p-0 mr-2">
                  <a href={this.props.props.officialUrl} style={{ color: "white" }} target="_blank" id={`to-official-page-${this.props.props.id}`}>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
                <CardTooltip target={`to-official-page-${this.props.props.id}`} title="公式ブログで確認" />
                <div className="col-4 p-0 ml-2">
                  <Link to={this.props.props.url} id={`to-download-page-${this.props.props.id}`} style={{color: "white"}}>
                    <i className="fas fa-download"></i>
                  </Link>
                </div>
                <CardTooltip target={`to-download-page-${this.props.props.id}`} title="ダウンロードページへ" />
              </div>
            </span>
          </div>
          <div className="card-body pb-0 px-3 px-sm-4 pt-3">
            <Link to={this.props.props.url} style={{ color: "dimgray" }}>
              <h6 className={"card-title blog-title " + (this.props.props.orderly ? "newpost-title" : "")}>{!this.props.props.title ? "\u00A0" : this.props.props.title}</h6>
            </Link>
            <div className="row">
              <Link to={this.props.props.writer.url} className={"card-text ml-3 small mb-2 pb-0 card-info writer-name " + this.props.props.group}>
                {this.props.props.writer.name}
              </Link>
              <p className="card-text ml-3 small mb-2 pb-0 card-info">{this.props.props.postDate}</p>
            </div>

            <div className="container mb-2">
              <div className="row">

                <div className="col-4 card-parameter d-flex justify-content-center align-items-center">
                  <div className="row justify-content-around">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-eye" style={{ color: "gray" }}></i>
                    </div>
                    &nbsp;
                    <div className="card-parameter-num">
                      {this.props.props.numOfViews}
                    </div>
                  </div>
                </div>

                <DetailButton url={this.props.props.url} officialUrl={this.props.props.officialUrl} />

                <div className="col-4 card-parameter d-flex justify-content-center align-items-center">
                  <div className="row justify-content-around">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-download" style={{ color: "gray" }}></i>
                    </div>
                    &nbsp;
                    <div className="card-parameter-num">
                      {this.props.props.numOfViews}
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


export class OrderlyBlogCard extends React.Component {
  render() {
    return (
      <div className="otapick_card_back col-6 col-md-4 col-lg-3 mb-3 px-2 px-sm-3">
        <SuperBlogCard props={this.props} orderly={true} />
      </div>
    );
  }
}


class BlogCard extends React.Component {
  render() {
    return (
      <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3">
        <div className="otapick_card_back">
          <SuperBlogCard props={this.props} orderly={true} />
        </div>
      </div>
    );
  };
};

export default BlogCard;