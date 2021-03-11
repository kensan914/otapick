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
      isLoadImage: false,
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

    this.src = isSmp ? this.props.src["250x"] : "";
    this.srcset = !isSmp
      ? `${this.props.src["250x"]} 1x, ${this.props.src["500x"]} 2x`
      : "";
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

  updateCardHeight = () => {
    if (
      this.imageCardRef &&
      Number.isFinite(this.imageCardRef.clientHeight) &&
      this.imageCardRef.clientHeight > this.state.cardHeight
    ) {
      this.setState({ cardHeight: this.imageCardRef.clientHeight });
    }
  };

  componentDidMount = () => {
    this.updateCardHeight();

    // init isFavorite
    this.props.domDispatch({
      type: "INIT_FAVORITE",
      imageID: this.imageID,
      isFavorite: this.props.initIsFavorite,
    });

    // preload image
    const imageObject = new Image();
    imageObject.onload = () => {
      console.log("オンロード");
      this.setState({ isLoadImage: true });
    };
    imageObject.src = this.src;
    imageObject.srcset = this.srcset;
  };

  componentDidUpdate = () => {
    console.log("レンダーimageCard");
    this.updateCardHeight();
  };

  render() {
    const isShowMenu = this.state.isOpenMenu && !isMobile;
    const isEnoughHighMenu = this.state.cardHeight > 100;
    const formatWidth =
      Number.isFinite(this.props.width) && this.props.width > 0
        ? this.props.width
        : 250;
    const formatHeight =
      Number.isFinite(this.props.height) && this.props.height > 0
        ? this.props.height
        : 250;
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
              {this.state.isLoadImage ? (
                <div ref={(imageCardRef) => (this.imageCardRef = imageCardRef)}>
                  <img
                    width={formatWidth}
                    height={formatHeight}
                    className={
                      "image-card-img " +
                      (this.props.orderly ? "newpost-thumbnail" : "")
                    }
                    src={this.src}
                    srcSet={this.srcset}
                    alt={generateAlt(this.props.group, this.props.writer.name)}
                    id={this.props.imgID || this.imageID}
                  />
                </div>
              ) : (
                <img
                  width={formatWidth}
                  height={formatHeight}
                  style={{ backgroundColor: "green" }}
                  className={`image-card-img ${
                    this.props.orderly ? "newpost-thumbnail" : ""
                  }`}
                />
              )}
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
