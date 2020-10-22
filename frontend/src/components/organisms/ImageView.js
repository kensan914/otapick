import React from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { DELAY_TIME, LOAD_IMG_URL } from "../modules/env";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";
import { URLJoin, generateAlt, isSmp, isMobile, addLongPressEventListeners, generateKeepAliveNameInfo, updateMeta, gtagTo } from "../modules/support";
import { ViewTooltip } from "../molecules/info/BlogViewInfo";
import { Link } from "react-router-dom";
import WriterCard from "../atoms/WriterCard";
import { MobileBottomMenu } from "../molecules/MobileMenu";
import { BlogViewLoader, HorizontalLoader } from "../molecules/Loader";
import { NotFoundMessage } from "../atoms/NotFound";
import { ViewTemplate } from "../templates/BlogViewTemplate";
import { withRouter } from "react-router-dom";


export const downloadImage = (url, incrementNumOfDownloads = null, order) => {
  axios
    .post(url, {}, {
      headers: {
        "X-CSRFToken": document.querySelector(`input[name="csrfmiddlewaretoken"]`).getAttribute("value")
      },
      responseType: "blob"
    })
    .then(res => {
      const blob = new Blob([res.data], {
        type: res.data.type
      });
      const fileName = res.headers["content-disposition"].match(/filename="(.*)"/)[1];
      saveAs(blob, fileName);
      if (incrementNumOfDownloads !== null) {
        incrementNumOfDownloads(order);
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
          <DropdownItem onClick={() => downloadImage(URLJoin("/api/", this.props.url), this.props.incrementNumOfDownloads, this.props.order)}>この画像をダウンロードする</DropdownItem>
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
        action: "view",
        key: this.state.VIEW_KEY,
      }, {
        headers: {
          "X-CSRFToken": document.querySelector(`input[name="csrfmiddlewaretoken"]`).getAttribute("value")
        }
      })
      .then(res => {
        if (res.data["status"] == "success") {
          this.incrementNumOfViews(this.props.order);
        }
      });
  }

  putDownload() {
    axios
      .put(this.imageViewURL, {
        action: "download",
        key: this.state.DOWNLOAD_KEY,
      }, {
        headers: {
          "X-CSRFToken": document.querySelector(`input[name="csrfmiddlewaretoken"]`).getAttribute("value")
        }
      })
      .then(res => {
        if (res.data["status"] == "success") {
          this.incrementNumOfDownloads(this.props.order);
        }
      });
  }

  updateMetaVerView(status, blogTitle, blogWriter) {
    if (this.props.keepAliveNameView === generateKeepAliveNameInfo(this.props.location.key)) {
      if (status === "success") {
        updateMeta({ title: `${blogTitle}(${blogWriter})｜画像詳細`, discription: `${blogWriter}のブログ「${blogTitle}」の画像です。` });
      } else if (status === "get_image_failed") {
        updateMeta({ title: "Not Found Image", discription: "" });
      } else if (status === "blog_not_found") {
        updateMeta({ title: "Not Found Blog", discription: "" });
      } else if (status === "accepted") {
        updateMeta({ title: "画像取得中", discription: "" });
      }
    }
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

      const mainImage = document.getElementById("main-image");
      // 長押し検出eventをadd
      addLongPressEventListeners(mainImage, () => this.putDownload());

      // load original image
      let imageObjct = new Image();
      imageObjct.onload = setTimeout(() => {
        if (mainImage !== null) {
          mainImage.removeAttribute("srcset");
          mainImage.setAttribute("src", imageObjct.src);
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

    // update meta
    if (this.props.keepAliveNameView === generateKeepAliveNameInfo(this.props.location.key)) {
      if (this.props.location !== prevProps.location) {
        this.updateMetaVerView(this.state.status, this.state.title, this.state.writer.name);
      }
    }

    // accepted
    super.componentDidUpdate(prevProps, prevState);
  }



  render() {
    let imageView;
    let imageViewText;
    let imageAlt;

    if (this.state.status === "") {
      imageViewText = <HorizontalLoader />;
    } else if (this.state.status === "accepted") {
      imageView = (<BlogViewLoader progress={this.state.progress} loadingImageUrl={LOAD_IMG_URL} />);
    } else if (this.state.status === "blog_not_found") {
      imageView = (<div className="py-0 py-sm-5"><NotFoundMessage type="blogFailed" margin={true} /></div>);
    } else if (this.state.status === "get_image_failed") {
      imageView = (<div className="py-0 py-sm-5"><NotFoundMessage type="imageFailed" margin={true} /></div>);
    } else if (this.state.status === "success") {
      const image = this.state.images[this.props.order];
      imageViewText = (
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
                  onClick={() => downloadImage(URLJoin("/api/", image.url), this.incrementNumOfDownloads, this.props.order)} id="image-view-download-button" />
                <ViewTooltip target={"image-view-download-button"} title="この画像をダウンロード" />
              </div>
            }
          </div>

          <div><hr className="mt-2 mt-lg-3 mb-4 mr-3" /></div>

          <div className="image-view-body">
            <div className="d-flex mb-3">
              <i className="fas fa-link mr-3" id="image-view-blog-icon"></i>
              <ViewTooltip target={"image-view-blog-icon"} title="掲載ブログ" />
              <Link to={this.state.url} className="image-view-blog-title">
                {this.state.title.length > 50 || isSmp
                  ? (this.state.title.length > 0 ? <h3 className="smaller">{this.state.title}</h3> : <h3 className="smaller">{"\u00A0"}</h3>)
                  : (this.state.title.length > 0 ? <h3>{this.state.title}</h3> : <h3>{"\u00A0"}</h3>)
                }
              </Link>
            </div>

            <div className="d-flex align-items-center">
              <i className="fas fa-pencil-alt mr-3" id="image-view-writer-icon"></i>
              <ViewTooltip target={"image-view-writer-icon"} title="ブログを書いたメンバー" />
              <WriterCard writer={this.state.writer} />
            </div>
          </div>


          <div className="image-view-footer mt-4 mt-sm-5 mt-lg-2 mb-2">
            <a className={"btn btn-primary rounded-pill image-view-to-official-button py-0 " + (isSmp ? "px-2" : "")}
              id="image-view-to-official-button" role="button" target="_blank" href={this.state.officialUrl}>
              <h6 className="omit-title m-0 image-view-to-official-title">
                <i className="fas fa-external-link-alt"></i>{this.props.group + "zaka46.com"}
              </h6>
            </a>
            <ViewTooltip target={"image-view-to-official-button"} title="公式ブログで確認" />

            {isMobile
              ? <MobileBottomMenu id="image-view-card-menu" type="imageViewCard" title={`${this.state.title}（${this.state.writer.name}）`}
                url={this.state.url} officialUrl={this.state.officialUrl} writer={this.state.writer} />
              : <DetailButton officialUrl={this.state.officialUrl} url={image.url} incrementNumOfDownloads={this.incrementNumOfDownloads} order={this.props.order} />
            }
          </div>
        </div>
      );

      imageAlt = generateAlt(this.props.group, this.state.writer.name);
    }

    let src;
    if (this.props.prevSrc) {
      src = this.props.prevSrc["250x"];
    } else {
      if (this.state.status === "success") {
        const image = this.state.images[this.props.order];
        src = image.src["250x"];
      } else {
        src = null
      }
    }
    if (isSmp) {
      imageView = (
        <>
          <img className="image-of-image-view smp" src={src} id="main-image" alt={imageAlt} />
          <div className="container mt-3 text-muted">
            <div className="alert alert-success" role="alert" style={{ borderRadius: "1rem", fontSize: 14 }}>画像を長押しして保存をおこなってください</div>
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
      let srcSet;
      if (this.props.prevSrc) {
        srcSet = `${this.props.prevSrc["250x"]} 1x, ${this.props.prevSrc["500x"]} 2x`;
      } else {
        if (this.state.status === "success") {
          const image = this.state.images[this.props.order];
          srcSet = `${image.src["250x"]} 1x, ${image.src["500x"]} 2x`;
        } else {
          srcSet = null;
        }
      }
      imageView = (
        <div className={"card otapick-card2 mx-auto image-view " + (isMobile ? "mb-3 mt-1 " : "my-4 ") + this.props.group}>
          <div className="card-body">
            <div className="row m-0">
              <div className="col-12 col-lg-6 p-0">
                <img className="image-of-image-view" src={src} id="main-image" srcSet={srcSet} alt={imageAlt}
                  onContextMenu={(e) => (!isMobile ? e.preventDefault() : "")} onMouseDown={(e) => (!isMobile ? e.preventDefault() : "")} />
              </div>
              <div className="col-12 col-lg-6 p-0">
                {imageViewText}
              </div>
            </div>
          </div>
        </div>
      );
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