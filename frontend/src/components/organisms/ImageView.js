import React from 'react';
import axios from 'axios';
import { saveAs } from "file-saver";
import { DELAY_TIME, LOAD_IMG_URL } from '../tools/env';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { URLJoin, generateAlt, isSmp, isMobile } from '../tools/support';
import { ViewTooltip } from '../molecules/info/BlogViewInfo';
import { Link } from 'react-router-dom';
import WriterCard from '../atoms/WriterCard';
import { MobileBottomMenu } from '../molecules/MobileMenu';
import { BlogViewLoader } from "../molecules/Loader";
import { NotFoundMessage } from "../atoms/NotFound";
import { ViewTemplate } from "../templates/BlogViewTemplate";
import { withRouter } from 'react-router-dom';


export const downloadImage = (url, incrementNumOfDownloads = null) => {
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

class ImageView extends ViewTemplate {
  constructor(props) {
    super(props);
    this.imageViewURL = this.props.imageViewURL;
    this.blogViewURL = this.props.blogViewURL;
  }

  putView() {
    axios
      .put(this.imageViewURL, {
        action: 'view',
        key: this.state.VIEW_KEY,
      }, {
        headers: {
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').getAttribute('value')
        }
      })
      .then(res => {
        if (res.data["status"] == "success") {
          this.incrementNumOfViews(this.props.order);
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // image が view されたとき
    if (prevState.status !== this.state.status && this.state.status === "success") {
      if (this.state.VIEW_KEY) {
        if (!this.props.accessedImages.includes(`${this.props.groupID}_${this.props.blogCt}_${this.props.order}_${this.props.location.key}`)) {
          this.putView();
          this.props.setAccessedImage(`${this.props.groupID}_${this.props.blogCt}_${this.props.order}_${this.props.location.key}`);
        }
      }

      // load original image
      let imageObjct = new Image();
      imageObjct.onload = setTimeout(() => {
        const mainImage = document.getElementById("main-image");
        if (mainImage !== null) {
          mainImage.removeAttribute("srcset");
          mainImage.setAttribute('src', imageObjct.src);
        }
      }, DELAY_TIME);
      const image = this.state.images[this.props.order];
      imageObjct.src = image.src["originals"];
    }

    // blogViewURL, imageViewURLの更新 
    if (prevProps.blogViewURL !== this.props.blogViewURL || prevProps.imageViewURL !== this.props.imageViewURL) {
      this.blogViewURL = this.props.blogViewURL;
      this.imageViewURL = this.props.imageViewURL;
    }

    // accepted
    super.componentDidUpdate(prevProps, prevState);
  }



  render() {
    let imageView;

    if (this.state.status === "") {
      // imageView = <HorizontalLoader />;
    } else if (this.state.status === "accepted") {
      imageView = (<BlogViewLoader progress={this.state.progress} loadingImageUrl={LOAD_IMG_URL} />);
    } else if (this.state.status === "blog_not_found") {
      imageView = (<div className="py-5"><NotFoundMessage type="blogFailed" margin={true} /></div>);
    } else if (this.state.status === "get_image_failed") {
      imageView = (<div className="py-5"><NotFoundMessage type="imageFailed" margin={true} /></div>);
    } else if (this.state.status === "success") {
      const image = this.state.images[this.props.order];
      const imageViewText = (
        <div className="ml-1 ml-sm-3 ml-lg-4 image-view-text">
          <div className="d-flex justify-content-between mt-1 mt-sm-3 mt-lg-2 mb-2 image-view-header">
            <div className="d-flex align-items-center p-0 col-7 col-md-8 col-lg-9">
              <div id="num-of-image-views-icon">
                <i className="fas fa-eye" style={{ color: "gray" }}></i>
              </div>
              <ViewTooltip target={"num-of-image-views-icon"} title="この画像の閲覧数" />
              {"\u00A0"}
              {image.num_of_views}

              <div className="ml-3" id="num-of-image-downloads-icon">
                <i className="fas fa-download" style={{ color: "gray" }}></i>
              </div>
              <ViewTooltip target={"num-of-image-downloads-icon"} title="この画像のダウンロード数" />
              {"\u00A0"}
              {image.num_of_downloads}
            </div>

            {!isMobile &&
              <div className="col-5 col-md-4 col-lg-3 text-right">
                <Button className={"rounded-circle p-0 image-view-download-button " + this.props.group}
                  onClick={() => downloadImage(URLJoin("/api/", image.url), this.incrementNumOfDownloads)} id="image-view-download-button" />
                <ViewTooltip target={"image-view-download-button"} title="この画像をダウンロード" />
              </div>
            }
          </div>

          <div><hr className="mt-2 mt-lg-3 mb-4 mr-3" /></div>

          <div className="image-view-body">
            <div className="d-flex mb-3">
              <i class="fas fa-link mr-3" id="image-view-blog-icon"></i>
              <ViewTooltip target={"image-view-blog-icon"} title="掲載ブログ" />
              <Link to={this.state.url} className="image-view-blog-title">
                {this.state.title.length > 50 || isSmp
                  ? (this.state.title.length > 0 ? <h3 className="smaller">{this.state.title}</h3> : <h3 className="smaller">{"\u00A0"}</h3>)
                  : (this.state.title.length > 0 ? <h3>{this.state.title}</h3> : <h3>{"\u00A0"}</h3>)
                }
              </Link>
            </div>

            <div className="d-flex align-items-center">
              <i class="fas fa-pencil-alt mr-3" id="image-view-writer-icon"></i>
              <ViewTooltip target={"image-view-writer-icon"} title="ブログを書いたメンバー" />
              <WriterCard writer={this.state.writer} />
            </div>
          </div>


          <div className="image-view-footer mt-4 mt-sm-5 mt-lg-2 mb-2">
            <a className={"btn btn-primary rounded-pill image-view-to-official-button py-0 " + (isSmp ? "px-2" : "")}
              id="image-view-to-official-button" role="button" target="_blank" href={this.state.officialUrl}>
              <h6 className="omit-title m-0 image-view-to-official-title">
                <i className="fas fa-external-link-alt"></i>{this.props.group + "zaka.com"}
              </h6>
            </a>
            <ViewTooltip target={"image-view-to-official-button"} title="公式ブログで確認" />

            {isMobile
              ? <MobileBottomMenu id="image-view-card-menu" type="imageViewCard" title={`${this.state.title}（${this.state.writer.name}）`}
                url={this.state.url} officialUrl={this.state.officialUrl} writer={this.state.writer} />
              : <DetailButton officialUrl={this.state.officialUrl} url={image.url} incrementNumOfDownloads={this.incrementNumOfDownloads} />
            }
          </div>
        </div>
      );

      if (isSmp) {
        imageView = (
          <>
            <img className="image-of-image-view smp" src={image.src["250x"]} id="main-image"
              alt={generateAlt(this.props.group, this.state.writer.name)} />
            <div className="container mt-3 text-muted">
              <div className={"card otapick-card2 mx-auto image-view smp " + this.props.group}>
                <div className="card-body">
                  <div className="p-0">
                    {imageViewText}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        imageView = (
          <div className={"card otapick-card2 my-4 mx-auto image-view " + this.props.group}>
            <div className="card-body">
              <div className="row m-0">
                <div className="col-12 col-lg-6 p-0">
                  <img className="image-of-image-view" src={image.src["250x"]} id="main-image"
                    srcSet={`${image.src["250x"]} 1x, ${image.src["500x"]} 2x`}
                    onContextMenu={(e) => (!isMobile ? e.preventDefault() : "")} onMouseDown={(e) => (!isMobile ? e.preventDefault() : "")}
                    alt={generateAlt(this.props.group, this.state.writer.name)} />
                </div>
                <div className="col-12 col-lg-6 p-0">
                  {imageViewText}
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <>{isSmp
        ? <div>{imageView}</div>
        : <div className="container mt-3 text-muted">{imageView}</div>
      }</>
    );
  }
}


export default withRouter(ImageView);