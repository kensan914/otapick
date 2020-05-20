import React, { useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';


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
    <Tooltip placement="top" isOpen={tooltipOpen} target={props.target} toggle={toggle} >
      {props.title}
    </Tooltip>
  )
}


class BlogCard extends React.Component {
  render() {
    var thumbnail = this.props.thumbnail;
    if (thumbnail == null) {
      thumbnail = "/static/img/imageNotFound.jpg"
    }

    return (
      <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3">
        <div className="otapick_card_back">
          <div className={"otapick_card " + this.props.group}>
            <div className="card border border-top-0">
              <div className="l-thumbnail">

                <a className="download-trigger" onClick={() => { this.props.history.push('/react/blogs/1/'); }}>
                  {/* <a className="download-trigger" href=""> */}
                  <figure className="thumbnail-wrapper">
                    <img className="card-img-top" src={thumbnail} style={{ borderRadius: "0" }} />
                  </figure>
                </a>
                <span className="more-button">
                  <div className="row justify-content-around">
                    <div className="col-4 p-0 mr-2">
                      <a href="" style={{ color: "white" }} target="_blank" id={`to-official-page-${this.props.id}`}>
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                    <CardTooltip target={`to-official-page-${this.props.id}`} title="公式ブログで確認" />
                    <div className="col-4 p-0 ml-2">
                      <a href="" style={{ color: "white" }} id={`to-download-page-${this.props.id}`} className="download-trigger">
                        <i className="fas fa-download"></i>
                      </a>
                    </div>
                    <CardTooltip target={`to-download-page-${this.props.id}`} title="ダウンロードページへ" />
                  </div>
                </span>
              </div>
              <div className="card-body pb-0 px-3 px-sm-4 pt-3">
                <a href="" className="download-trigger" style={{ color: "dimgray" }}>
                  <h6 className="card-title blog-title">{this.props.title}</h6>
                </a>
                <div className="row">
                  <Link to={`/react/blogs/${this.props.groupID}/${this.props.writerCt}`} className={"card-text ml-3 small mb-2 pb-0 card-info writer-name " + this.props.group}>
                    {this.props.writer}
                  </Link>
                  {/* <a href="" className={"card-text ml-3 small mb-2 pb-0 card-info writer-name " + this.props.group}>{this.props.writer}</a> */}
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
                          {this.props.numOfViews}
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
                          {this.props.numOfDownloads}
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


export default withRouter(BlogCard);