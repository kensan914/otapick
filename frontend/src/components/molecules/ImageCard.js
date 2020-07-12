import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { generateAlt, isMobile, isSmp } from '../tools/support';
import { URLJoin } from '../tools/support';
import { downloadImage } from '../organisms/ImageView';
import { MobileBottomMenu } from './MobileMenu';


class DownloadButton extends React.Component {
  render() {
    return (
      <Button className={"rounded-circle p-0 image-card-download-button " + this.props.group} title="この画像をダウンロードする"
        onClick={() => downloadImage(URLJoin("/api/", this.props.url))} />
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
          <DropdownItem tag={Link} to={this.props.url}>詳細ページへ</DropdownItem>
          <DropdownItem divider />
          <DropdownItem tag={Link} to={this.props.writer.url["images"]}>{`「${this.props.writer.name}」の他の画像を探す`}</DropdownItem>
          <DropdownItem onClick={() => downloadImage(URLJoin("/api/", this.props.url))}>この画像をダウンロードする</DropdownItem>
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
          onMouseLeave={() => { this.setIsOpenMenu(false); this.isHover = false; }}>
          <Link to={this.props.props.url}>
            <div className={"image-card-wrapper " + (!isMobile ? "pc" : "")}>
              <img className={"image-card-img " + (this.props.orderly ? "newpost-thumbnail" : "")} src={this.props.props.src["250x"]}
                srcSet={!isSmp ? `${this.props.props.src["250x"]} 1x, ${this.props.props.src["500x"]} 2x` : ""}
                alt={generateAlt(this.props.props.group, this.props.props.writer.name)} id={this.props.props.imageID} />
            </div>
          </Link>

          {(this.state.isOpenMenu && !isMobile) &&
            <>
              {this.imageCardRef.clientHeight > 100 &&
                <DownloadButton group={this.props.props.group} url={this.props.props.url} />
              }
              <ToBlogButton url={this.props.props.blogUrl} title={this.props.props.blogTitle} />
              <DetailButton url={this.props.props.url} officialUrl={this.props.props.officialUrl} ref={this.detailButtonRef} hideMenu={() => this.hideMenu()}
                writer={this.props.props.writer} />
            </>
          }
        </div>

        {(this.props.props.message || isMobile) &&
          <div className="image-card-footer" >
            <div className={"image-card-message " + (isMobile ? "mobile" : "")}>
              {this.props.props.message &&
                <Link to={this.props.props.url} onMouseEnter={() => { this.setIsOpenMenu(true); this.isHover = true; }} onMouseLeave={() => { this.setIsOpenMenu(false); this.isHover = false; }}
                  style={{ textDecoration: "none" }}>
                  <div className={"card-message mx-auto py-2 " + (!isMobile ? "pc" : "")}>
                    <i className="fas fa-crown" style={{ color: "gold" }}></i>
                    {"\u00A0"}
                    <b>{this.props.props.message}</b>
                  </div>
                </Link>
              }
            </div>
            {isMobile &&
              <MobileBottomMenu id={this.props.props.id} type="imageCard" title={`${this.props.props.blogTitle}（${this.props.props.writer.name}）`}
                url={this.props.props.url} officialUrl={this.props.props.officialUrl} writer={this.props.props.writer} />
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
      <SuperImageCard props={this.props} orderly={false} />
    );
  };
};

export default ImageCard;