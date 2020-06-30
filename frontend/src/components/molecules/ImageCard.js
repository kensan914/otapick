import React, { useState } from 'react';
import { UncontrolledDropdown, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { shortenNum } from '../tools/support';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import { downloadImage } from '../organisms/ImageView';


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
            role="button" title="掲載されているブログを確認">
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
    if (willOpen && !this.isHover) {
      this.setState({ isOpenMenu: willOpen });
    } else if (!willOpen && this.isHover) {
      if (!this.detailButtonRef.current.state.dropdownOpen) {
        this.setState({ isOpenMenu: willOpen });
      }
    }
  }

  hideMenu = () => {
    if (!this.isHover) this.setState({ isOpenMenu: false });
  };

  render() {
    return (
      <div className="image-card" ref={(imageCardRef) => this.imageCardRef = imageCardRef}
        onMouseEnter={() => { this.setIsOpenMenu(true); this.isHover = true; }}
        onMouseLeave={() => { this.setIsOpenMenu(false); this.isHover = false; }}>
        <Link to={this.props.props.url}>
          <div className="image-card-wrapper">
            <img className={"image-card-img " + (this.props.orderly ? "newpost-thumbnail" : "")} src={this.props.props.src["250x"]}
              srcSet={`${this.props.props.src["250x"]} 1x, ${this.props.props.src["500x"]} 2x`} />
          </div>
        </Link>

        {this.state.isOpenMenu &&
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
    );
  }
}


class ImageCard extends React.Component {
  render() {
    return (
      <div className="grid-item col-6 col-md-4 col-lg-3 my-3 px-2 px-sm-2">
        <SuperImageCard props={this.props} orderly={false} />
      </div>
    );
  };
};

export default ImageCard;