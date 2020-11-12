import React from "react";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { generateAlt, isMobile, isSmp } from "../modules/utils";
import { URLJoin } from "../modules/utils";
import { downloadImage } from "../organisms/ImageView";
import { MobileBottomMenu } from "./MobileMenu";
import { withCookies } from "react-cookie";
import { BASE_URL } from "../modules/env";
import LazyLoad from "react-lazyload";


class DownloadButton extends React.Component {
  render() {
    return (
      <Button className={"rounded-circle p-0 image-card-download-button " + this.props.group} title="この画像をダウンロードする"
        onClick={() => downloadImage(URLJoin(BASE_URL, this.props.url), this.props.cookies)} />
    );
  }
}

class ToBlogButton extends React.Component {
  render() {
    return (
      <>
        {this.props.title != "" &&
          <Link to={this.props.url} className="btn btn-primary rounded-pill image-to-blog-button image-card-button text-left d-flex align-items-center"
            role="button" title={`「${this.props.title}」を確認`}>
            <h6 className="omit-title m-0" style={{ fontSize: 14 }}>{this.props.title}</h6>
          </Link>
        }
      </>
    );
  }
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
    this.setState(prevState => {
      if (prevState.dropdownOpen) this.props.hideMenu();
      return { dropdownOpen: !prevState.dropdownOpen }
    });
  }

  render() {
    return (
      <ButtonDropdown direction="right" isOpen={this.state.dropdownOpen} toggle={this.toggle} className="image-card-detail-button-super text-center">
        <DropdownToggle color="light" className="p-0 image-card-detail-button image-card-button rounded-circle">
          <i className="fas fa-bars"></i>
        </DropdownToggle>
        <DropdownMenu className="bold">
          <DropdownItem tag={Link} to={{ pathname: this.props.url, state: { prevSrc: this.props.src } }}>詳細ページへ</DropdownItem>
          <DropdownItem divider />
          <DropdownItem tag={Link} to={this.props.writer.url["images"]}>{`「${this.props.writer.name}」の他の画像を探す`}</DropdownItem>
          <DropdownItem onClick={() => downloadImage(URLJoin(BASE_URL, this.props.url), this.props.cookies)}>この画像をダウンロードする</DropdownItem>
          <DropdownItem href={this.props.officialUrl} target="_blank">公式ブログで確認</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

class SuperImageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenMenu: false,
    }
    this.isHover = false
    this.detailButtonRef = React.createRef();
  }

  setIsOpenMenu = (willOpen) => {
    if (!isMobile) {
      if (willOpen && !this.isHover) {
        this.setState({ isOpenMenu: willOpen });
      } else if (!willOpen && this.isHover) {
        if (!this.detailButtonRef.current.state.dropdownOpen) {
          this.setState({ isOpenMenu: willOpen });
        }
      }
    }
  }

  hideMenu = () => {
    if (!this.isHover) this.setState({ isOpenMenu: false });
  };

  render() {
    return (
      <>
        <div className="image-card" ref={(imageCardRef) => this.imageCardRef = imageCardRef}
          onMouseEnter={() => { this.setIsOpenMenu(true); this.isHover = true; }}
          onMouseLeave={() => { this.setIsOpenMenu(false); this.isHover = false; }}
        >
          <Link to={{ pathname: this.props.url, state: { prevSrc: this.props.src } }}>
            <div className={"image-card-wrapper " + (!isMobile ? "pc" : "")}>
              {/* <LazyLoad width="500" height="500" once placeholder={
                <div style={{ width: 500, height: 500, backgroundColor: "red" }} />
              }> */}
              <img className={"image-card-img " + (this.props.orderly ? "newpost-thumbnail" : "")} src={isSmp ? this.props.src["250x"] : ""}
                srcSet={!isSmp ? `${this.props.src["250x"]} 1x, ${this.props.src["500x"]} 2x` : ""}
                alt={generateAlt(this.props.group, this.props.writer.name)} id={this.props.imageID}
              />
              {/* </LazyLoad> */}
            </div>
          </Link>

          {(this.state.isOpenMenu && !isMobile) &&
            <>
              {this.imageCardRef.clientHeight > 100 &&
                <DownloadButton group={this.props.group} url={this.props.url} cookies={this.props.cookies} />
              }
              <ToBlogButton url={this.props.blogUrl} title={this.props.blogTitle} />
              <DetailButton url={this.props.url} officialUrl={this.props.officialUrl} ref={this.detailButtonRef} hideMenu={() => this.hideMenu()}
                writer={this.props.writer} src={this.props.src} cookies={this.props.cookies} />
            </>
          }
        </div>

        {(this.props.message || isMobile) &&
          <div className="image-card-footer" >
            <div className={"image-card-message " + (isMobile ? "mobile" : "")}>
              {this.props.message &&
                <Link to={{ pathname: this.props.url, state: { prevSrc: this.props.src } }} onMouseEnter={() => { this.setIsOpenMenu(true); this.isHover = true; }} onMouseLeave={() => { this.setIsOpenMenu(false); this.isHover = false; }}
                  style={{ textDecoration: "none" }}>
                  <div className={"card-message mx-auto py-2 " + (!isMobile ? "pc" : "")}>
                    <i className="fas fa-crown" style={{ color: "gold" }}></i>{" "}<b>{this.props.message}</b>
                  </div>
                </Link>
              }
            </div>
            {isMobile &&
              <MobileBottomMenu id={this.props.id} type="imageCard" title={`${this.props.blogTitle}（${this.props.writer.name}）`}
                url={this.props.url} officialUrl={this.props.officialUrl} writer={this.props.writer} src={this.props.src} />
            }
          </div>
        }
      </>
    );
  }
}


class ImageCard extends React.Component {
  render() {
    return (
      <SuperImageCard {...this.props} orderly={false} />
    );
  };
};

export default withCookies(ImageCard);