import React, { useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip } from 'reactstrap';


const DetailButton = () => {
  return (
    <UncontrolledDropdown className="col-4 text-center" style={{ overflowY: "visible" }}>
      <div className="card-detail-button-super">
        <DropdownToggle id="thumbnailDetail" color="light" className="p-0 card-detail-button rounded-circle">
          <i className="fas fa-bars" style={{ color: "gray" }}></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem href="" className="download-trigger">ダウンロードページへ</DropdownItem>
          <DropdownItem href="" target="_blank">公式ブログで確認</DropdownItem>
        </DropdownMenu>
      </div>
    </UncontrolledDropdown>
  );
};

const CardTooltip = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <Tooltip placement="top" isOpen={tooltipOpen} target={props.target} toggle={toggle}>{props.title}</Tooltip>
  )
}

class BlogCard extends React.Component {
  render() {
    return (
      <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3">
        <div className="otapick_card_back">
          <div className={"otapick_card " + this.props.group}>
            <div className="card border border-top-0">
              <div className="l-thumbnail">

                <a href="" className="download-trigger">
                  <figure className="thumbnail-wrapper">
                    <img className="card-img-top" src={this.props.img} style={{ borderRadius: "0" }} />
                  </figure>
                </a>
                <span className="more-button">
                  <div className="row justify-content-around">
                    <div className="col-4 p-0 mr-2">
                      <a href="" style={{ color: "white" }} target="_blank" id="to-official-page">
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                    <CardTooltip target="to-official-page" title="公式ブログで確認" />
                    <div className="col-4 p-0 ml-2">
                      <a href="" style={{ color: "white" }} id="to-download-page" className="download-trigger">
                        <i className="fas fa-download"></i>
                      </a>
                    </div>
                    <CardTooltip target="to-download-page" title="ダウンロードページへ" />
                  </div>
                </span>
              </div>
              <div className="card-body pb-0 px-3 px-sm-4 pt-3">
                <a href="" className="download-trigger" style={{ color: "dimgray" }}>
                  <h6 className="card-title blog-title">{this.props.title}</h6>
                </a>
                <div className="row">
                  <a href="" className={"card-text ml-3 small mb-2 pb-0 card-info writer-name " + this.props.group}>{this.props.writer}</a>
                  <p className="card-text ml-3 small mb-2 pb-0 card-info">{this.props.postDate}</p>
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
                          {this.props.num_of_views}
                        </div>
                      </div>
                    </div>

                    <DetailButton />

                    <div className="col-4 card-parameter d-flex justify-content-center align-items-center">
                      <div className="row justify-content-around">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-download" style={{ color: "gray" }}></i>
                        </div>
                          &nbsp;
                          <div className="card-parameter-num">
                          {this.props.num_of_downloads}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};


export default BlogCard;