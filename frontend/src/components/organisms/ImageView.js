import React from 'react';
import axios from 'axios';
import { saveAs } from "file-saver";
import { DELAY_TIME } from '../tools/env';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Button } from 'reactstrap';
import { URLJoin } from '../tools/support';
import { ViewTooltip } from '../molecules/info/BlogViewInfo';
import { Link } from 'react-router-dom';
import WriterCard from '../atoms/WriterCard';


export const downloadImage = (url, incrementNumOfDownloads=null) => {
  axios
    .post(url, {}, {
      headers: {
        'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').getAttribute('value')
      },
      responseType: 'blob'
    })
    .then(res => {
      const blob = new Blob([res.data], {
        type: res.data.type
      });
      const fileName = res.headers["content-disposition"].match(/filename="(.*)"/)[1];
      saveAs(blob, fileName);
      if (incrementNumOfDownloads != null) {
        incrementNumOfDownloads();
      }
    });
}


class DetailButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => (
      { dropdownOpen: !prevState.dropdownOpen }
    ));
  }

  render() {
    return (
      <ButtonDropdown direction="right" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color="light" className="p-0 image-view-detail-button rounded-circle">
          <i className="fas fa-bars"></i>
        </DropdownToggle>
        <DropdownMenu className="bold">
          <DropdownItem onClick={() => downloadImage(URLJoin("/api/", this.props.url), this.props.incrementNumOfDownloads)}>この画像をダウンロードする</DropdownItem>
          <DropdownItem href={this.props.officialUrl} target="_blank">公式ブログで確認</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: this.props.image.src["250x"],
    }
  }

  componentDidMount() {
    let imageObjct = new Image();
    imageObjct.onload = setTimeout(() => {
      const mainImage = document.getElementById("main-image");
      if (mainImage !== null) {
        mainImage.removeAttribute("srcset")
        mainImage.setAttribute('src', imageObjct.src);
      }
    }, DELAY_TIME)
    imageObjct.src = this.props.image.src["originals"];
  }

  render() {
    return (
      <div className={"card otapick-card2 my-4 " + this.props.group}>
        <div className="card-body">

          <div className="d-flex">
            <div className="col-lg-6 p-0">
              <img className="image-of-image-view" src={this.props.image.src["250x"]} id="main-image"
                srcSet={`${this.props.image.src["250x"]} 1x, ${this.props.image.src["500x"]} 2x`}
                onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} />
            </div>
            <div className="col-lg-6 p-0">
              <div className="ml-4 image-view-text">

                <div className="d-flex justify-content-between my-2">
                  <div className="d-flex align-items-center p-0 col-7 col-md-8 col-lg-9">
                    <div id="num-of-image-views-icon">
                      <i className="fas fa-eye" style={{ color: "gray" }}></i>
                    </div>
                    <ViewTooltip target={"num-of-image-views-icon"} title="この画像の閲覧数" />
                    {"\u00A0"}
                    {this.props.image.num_of_views}

                    <div className="ml-3" id="num-of-image-downloads-icon">
                      <i className="fas fa-download" style={{ color: "gray" }}></i>
                    </div>
                    <ViewTooltip target={"num-of-image-downloads-icon"} title="この画像のダウンロード数" />
                    {"\u00A0"}
                    {this.props.image.num_of_downloads}
                  </div>

                  <div className="col-5 col-md-4 col-lg-3 text-right">
                    <Button className={"rounded-circle p-0 image-view-download-button " + this.props.group}
                      onClick={() => downloadImage(URLJoin("/api/", this.props.image.url), this.props.incrementNumOfDownloads)} id="image-view-download-button" />
                    <ViewTooltip target={"image-view-download-button"} title="この画像をダウンロード" />
                  </div>
                </div>

                <hr className="mt-3 mb-4" />

                <div className="d-flex mb-3">
                  <i class="fas fa-link mr-3" id="image-view-blog-icon"></i>
                  <ViewTooltip target={"image-view-blog-icon"} title="掲載ブログ" />
                  <Link to={this.props.blogUrl} className="image-view-blog-title">
                    {this.props.title.length > 50
                      ? <h5>{this.props.title}</h5>
                      : <h3>{this.props.title}</h3>
                    }
                  </Link>
                </div>

                <div className="d-flex align-items-center">
                  <i class="fas fa-pencil-alt mr-3" id="image-view-writer-icon"></i>
                  <ViewTooltip target={"image-view-writer-icon"} title="ブログを書いたメンバー" />
                  <WriterCard writer={this.props.writer} />
                </div>


                <div className="image-view-footer my-2">
                  <a className="btn btn-primary rounded-pill image-view-to-official-button py-0" id="image-view-to-official-button"
                    role="button" target="_blank" href={this.props.officialUrl}>
                    <h6 className="omit-title m-0 image-view-to-official-title">
                      <i className="fas fa-external-link-alt"></i>{this.props.group + "zaka.com"}
                    </h6>
                  </a>
                  <ViewTooltip target={"image-view-to-official-button"} title="公式ブログで確認" />
                  <DetailButton officialUrl={this.props.officialUrl} url={this.props.image.url} officialUrl={this.props.officialUrl} incrementNumOfDownloads={this.props.incrementNumOfDownloads} />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };
};


export default ImageView;