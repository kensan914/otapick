import React from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";

import {
  geneIsFavoriteGetterSetter,
  generateAlt,
  isMobile,
  isSmp,
} from "../modules/utils";
import { URLJoin } from "../modules/utils";
import { downloadImage } from "../organisms/ImageView";
import { MobileBottomMenu } from "./MobileMenu";
import { withCookies } from "react-cookie";
import { BASE_URL } from "../modules/env";
import FavoriteButton from "../atoms/FavoriteButton";
import { DomDispatchContext, DomStateContext } from "../contexts/DomContext";
import LazyLoad from "react-lazyload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCrown } from "@fortawesome/free-solid-svg-icons";

class DownloadButton extends React.Component {
  render() {
    return (
      <Button
        className={
          "rounded-circle p-0 image-card-download-button " + this.props.group
        }
        title="この画像をダウンロードする"
        onClick={() =>
          downloadImage(URLJoin(BASE_URL, this.props.url), this.props.csrftoken)
        }
      />
    );
  }
}

class ToBlogButton extends React.Component {
  render() {
    return (
      <>
        {this.props.title != "" && (
          <Link
            to={this.props.url}
            className="btn btn-primary rounded-pill image-to-blog-button image-card-button text-left d-flex align-items-center"
            role="button"
            title={`「${this.props.title}」を確認`}
          >
            <h6 className="omit-title m-0" style={{ fontSize: 14 }}>
              {this.props.title}
            </h6>
          </Link>
        )}
      </>
    );
  }
}

class DetailButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => {
      if (prevState.dropdownOpen) this.props.hideMenu();
      return { dropdownOpen: !prevState.dropdownOpen };
    });
  }

  render() {
    return (
      <ButtonDropdown
        direction="right"
        isOpen={this.state.dropdownOpen}
        toggle={this.toggle}
        className="image-card-detail-button-super text-center"
      >
        <DropdownToggle
          color="light"
          className="p-0 image-card-detail-button image-card-button rounded-circle"
        >
          <FontAwesomeIcon icon={faBars} />
        </DropdownToggle>
        <DropdownMenu className="bold">
          <DropdownItem
            tag={Link}
            to={{
              pathname: this.props.url,
              state: { prevSrc: this.props.src },
            }}
          >
            詳細ページへ
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem
            tag={Link}
            to={this.props.writer.url["images"]}
          >{`「${this.props.writer.name}」の他の画像を探す`}</DropdownItem>
          <DropdownItem
            onClick={() =>
              downloadImage(
                URLJoin(BASE_URL, this.props.url),
                this.props.csrftoken
              )
            }
          >
            この画像をダウンロードする
          </DropdownItem>
          <DropdownItem href={this.props.officialUrl} target="_blank">
            公式ブログで確認
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

class ImageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenMenu: false,
      cardHeight: 0,
      placeholderCardWidth: 0,
    };
    this.isHover = false;
    this.detailButtonRef = React.createRef();
    this.imageID = props.imageID;

    this.setIsFavorite = geneIsFavoriteGetterSetter(
      {},
      props.domDispatch,
      this.imageID
    ).setIsFavorite;
    this.csrftoken = props.cookies.get("csrftoken");
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
  };

  hideMenu = () => {
    if (!this.isHover) this.setState({ isOpenMenu: false });
  };

  componentDidMount = () => {
    // update this.state.cardHeight
    if (
      this.imageCardRef &&
      this.state.cardHeight !== this.imageCardRef.clientHeight
    ) {
      this.setState({ cardHeight: this.imageCardRef.clientHeight });
    }

    // update this.state.placeholderCardWidth
    if (
      this.placeholderCardRef &&
      this.state.placeholderCardWidth !== this.placeholderCardRef.clientWidth
    ) {
      this.setState({
        placeholderCardWidth: this.placeholderCardRef.clientWidth,
      });
    }

    // init isFavorite
    this.props.domDispatch({
      type: "INIT_FAVORITE",
      imageID: this.imageID,
      isFavorite: this.props.initIsFavorite,
    });
  };

  componentDidUpdate = () => {
    console.log("レンダーimageCard");
    if (
      this.imageCardRef &&
      this.imageCardRef.clientHeight > this.state.cardHeight
    ) {
      this.setState({ cardHeight: this.imageCardRef.clientHeight });
    }

    if (
      this.placeholderCardRef &&
      this.placeholderCardRef.clientWidth !== this.state.placeholderCardWidth
    ) {
      this.setState({
        placeholderCardWidth: this.placeholderCardRef.clientWidth,
      });
      console.log("更新", this.placeholderCardRef.clientWidth);
    }
  };

  render() {
    const isShowMenu = this.state.isOpenMenu && !isMobile;
    const isEnoughHighMenu = this.state.cardHeight > 100;

    return (
      <>
        <div
          className="image-card"
          // onMouseEnter={() => { console.log("エンター"); this.setIsOpenMenu(true); this.isHover = true; }}
          onMouseEnter={() => {
            this.setIsOpenMenu(true);
            this.isHover = true;
          }}
          onMouseLeave={() => {
            this.setIsOpenMenu(false);
            this.isHover = false;
          }}
        >
          <Link
            to={{
              pathname: this.props.url,
              state: { prevSrc: this.props.src },
            }}
          >
            <div className={"image-card-wrapper " + (!isMobile ? "pc" : "")}>
              <LazyLoad
                width="500"
                height="500"
                once
                placeholder={
                  <div
                    ref={(placeholderCardRef) =>
                      (this.placeholderCardRef = placeholderCardRef)
                    }
                    style={{
                      width: 216.5,
                      height: 100,
                      backgroundColor: "red",
                    }}
                  />
                }
              >
                <img
                  ref={(imageCardRef) => (this.imageCardRef = imageCardRef)}
                  className={
                    "image-card-img " +
                    (this.props.orderly ? "newpost-thumbnail" : "")
                  }
                  src={isSmp ? this.props.src["250x"] : ""}
                  srcSet={
                    !isSmp
                      ? `${this.props.src["250x"]} 1x, ${this.props.src["500x"]} 2x`
                      : ""
                  }
                  alt={generateAlt(this.props.group, this.props.writer.name)}
                  id={this.props.imgID || this.imageID}
                  // width={250}
                  // height={250}
                />
              </LazyLoad>
            </div>
          </Link>

          {/* isOpenMenuがfalseになるたびにFavoriteButtonがunmountされstateがリセットされていたため */}
          {/* {(this.props.getIsFavorite() !== null) && */}
          <FavoriteButton
            group={this.props.group}
            groupID={this.props.groupID}
            blogCt={this.props.blogCt}
            order={this.props.order}
            isFavorite={this.props.isFavorite}
            setIsFavorite={this.setIsFavorite}
            isShowMenu={isShowMenu}
            cardHeight={this.state.cardHeight}
          />
          {/* } */}
          {isShowMenu && isEnoughHighMenu && (
            <DownloadButton
              group={this.props.group}
              url={this.props.url}
              csrftoken={this.csrftoken}
            />
          )}
          {isShowMenu && (
            <>
              <ToBlogButton
                url={this.props.blogUrl}
                title={this.props.blogTitle}
              />
              <DetailButton
                url={this.props.url}
                officialUrl={this.props.officialUrl}
                ref={this.detailButtonRef}
                hideMenu={() => this.hideMenu()}
                writer={this.props.writer}
                src={this.props.src}
                csrftoken={this.csrftoken}
              />
            </>
          )}
        </div>

        {(this.props.message || isMobile) && (
          <div className="image-card-footer">
            <div className={"image-card-message " + (isMobile ? "mobile" : "")}>
              {this.props.message && (
                <Link
                  to={{
                    pathname: this.props.url,
                    state: { prevSrc: this.props.src },
                  }}
                  onMouseEnter={() => {
                    this.setIsOpenMenu(true);
                    this.isHover = true;
                  }}
                  onMouseLeave={() => {
                    this.setIsOpenMenu(false);
                    this.isHover = false;
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className={
                      "card-message mx-auto py-2 " + (!isMobile ? "pc" : "")
                    }
                  >
                    <FontAwesomeIcon icon={faCrown} style={{ color: "gold" }} />{" "}
                    <b>{this.props.message}</b>
                  </div>
                </Link>
              )}
            </div>
            {isMobile && (
              <MobileBottomMenu
                id={this.props.id}
                type="imageCard"
                title={`${this.props.blogTitle}（${this.props.writer.name}）`}
                url={this.props.url}
                officialUrl={this.props.officialUrl}
                writer={this.props.writer}
                src={this.props.src}
              />
            )}
          </div>
        )}
      </>
    );
  }
}

// 1ページに数百単位でレンダリングされるコンポーネントのため、
// ImageCardのprops・stateに変更があったときのみ再レンダー(memo)
const geneImageCardDom = () => {
  const _ImageCard = React.memo(withCookies(ImageCard));

  const ImageCardWithDom = (props) => {
    const imageID = `${props.groupID}_${props.blogCt}_${props.order}`;
    return (
      <DomStateContext.Consumer>
        {(domState) => (
          <DomDispatchContext.Consumer>
            {(domDispatch) => (
              <_ImageCard
                {...props}
                orderly={false}
                imageID={imageID}
                initIsFavorite={props.isFavorite}
                isFavorite={domState.favoriteState[imageID]}
                domDispatch={domDispatch}
              />
            )}
          </DomDispatchContext.Consumer>
        )}
      </DomStateContext.Consumer>
    );
  };

  return ImageCardWithDom;
};

export default geneImageCardDom();
