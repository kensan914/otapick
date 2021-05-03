import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronCircleRight,
  faCrown,
  faDownload,
  faEllipsisH,
  faExternalLinkAlt,
  faImages,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { withCookies } from "react-cookie";

import {
  geneIsFavoriteGetterSetter,
  generateAlt,
  isMobile,
  isSmp,
  URLJoin,
} from "~/utils";
import { downloadImage } from "~/components/organisms/ImageView";
import { BASE_URL } from "~/constants/env";
import FavoriteButton, {
  useFavoriteButton,
} from "~/components/atoms/FavoriteButton";
import { useDomDispatch, useDomState } from "~/contexts/DomContext";
import DownloadButton from "~/components/atoms/DownloadButton";
import DropdownMobileFriendly from "~/components/molecules/DropdownMobileFriendly";

const ToBlogButton = (props) => {
  const { title, url } = props;
  return (
    <>
      {title !== "" && (
        <Link
          to={url}
          className="btn btn-primary rounded-pill image-to-blog-button image-card-button text-left d-flex align-items-center"
          role="button"
          title={`「${title}」を確認`}
        >
          <h6 className="omit-title m-0" style={{ fontSize: 14 }}>
            {title}
          </h6>
        </Link>
      )}
    </>
  );
};

const ImageCard = (props) => {
  const {
    urlPath,
    srcCollection,
    imageId,
    initIsFavorite,
    cookies,
    shouldPreload = true,
    shouldLoadOriginal = false, // 250x・500xをpreload後にoriginalをloadする(blogView等).
    didMountImage = () => void 0,
    width,
    height,
    orderly,
    groupKey,
    groupId,
    blogCt,
    order,
    writer,
    priorityImageId,
    blogUrl,
    blogTitle,
    officialUrl,
    footerMessage,
    isFavorite,
  } = props;

  const domDispatch = useDomDispatch();

  const [isShowHoverMenu, setIsShowHoverMenu] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);
  const [isLoadedImage, setIsLoadedImage] = useState(false);
  const [actuallySrc, setActuallySrc] = useState(
    isSmp ? srcCollection["250x"] : ""
  );
  const [actuallySrcset, setActuallySrcset] = useState(
    !isSmp ? `${srcCollection["250x"]} 1x, ${srcCollection["500x"]} 2x` : ""
  );
  // 本来DropdownMobileFriendlyで管理しているが、ImageCard(親コンポーネント)でも管理したいため
  const [isOpenDropdownMenu, setIsOpenDropdownMenu] = useState(false);

  const imageCardRef = useRef(null);
  const isHover = useRef(false);
  const [{ setIsFavorite }] = useState(
    geneIsFavoriteGetterSetter({}, domDispatch, imageId)
  );
  const [csrftoken] = useState(cookies.get("csrftoken"));
  const dropdownMenuMobile = useRef(null);
  const endWorkDropdownMenuMobile = () => {
    dropdownMenuMobile.current && dropdownMenuMobile.current.endWork();
  };

  const [onClickFavoriteButton, lottieName] = useFavoriteButton(
    groupId,
    blogCt,
    order,
    setIsFavorite,
    isFavorite,
    csrftoken,
    isMobile ? endWorkDropdownMenuMobile : void 0
  );

  const onMouseEnterOrLeave = (isEnter) => {
    if (!isMobile) {
      if (isEnter && !isHover.current) {
        setIsShowHoverMenu(true);
      } else if (!isEnter && isHover.current) {
        if (!isOpenDropdownMenu) {
          setIsShowHoverMenu(false);
        }
      }
    }
    isHover.current = isEnter;
  };

  const hideMenu = () => {
    if (!isHover.current) {
      setIsShowHoverMenu(false);
    }
  };

  const updateCardHeight = () => {
    if (
      imageCardRef.current &&
      Number.isFinite(imageCardRef.current.clientHeight) &&
      imageCardRef.current.clientHeight > cardHeight
    ) {
      setCardHeight(imageCardRef.current.clientHeight);
    }
  };

  useEffect(() => {
    updateCardHeight();

    // init isFavorite
    if (isFavorite !== initIsFavorite)
      domDispatch({
        type: "INIT_FAVORITE",
        imageID: imageId,
        isFavorite: initIsFavorite,
      });

    // preload image
    if (shouldPreload) {
      const imageObject = new Image();
      imageObject.onload = () => {
        setIsLoadedImage(true);
        if (shouldLoadOriginal) {
          setActuallySrc(srcCollection["originals"]);
          setActuallySrcset("");
        }
      };
      imageObject.src = actuallySrc;
      imageObject.srcset = actuallySrcset;
    }
  }, []);

  useEffect(() => {
    if (isLoadedImage) {
      didMountImage && didMountImage();
    }
  }, [isLoadedImage]);

  useEffect(() => {
    updateCardHeight();
  });

  const isShowMenu = isShowHoverMenu && !isMobile;
  const isEnoughHighMenu = cardHeight > 100;
  const formatWidth = Number.isFinite(width) && width > 0 ? width : 250;
  const formatHeight = Number.isFinite(height) && height > 0 ? height : 250;
  return (
    <>
      <div
        className="image-card"
        onMouseEnter={() => {
          onMouseEnterOrLeave(true);
        }}
        onMouseLeave={() => {
          onMouseEnterOrLeave(false);
        }}
      >
        <Link
          to={{
            pathname: urlPath,
            state: { prevSrc: srcCollection },
          }}
        >
          <div className={"image-card-wrapper " + (!isMobile ? "pc" : "")}>
            {!shouldPreload || isLoadedImage ? (
              <div
                ref={(_imageCardRef) => (imageCardRef.current = _imageCardRef)}
              >
                <img
                  width={formatWidth}
                  height={formatHeight}
                  className={`image-card-img ${
                    orderly ? "newpost-thumbnail" : ""
                  }`}
                  src={actuallySrc}
                  srcSet={actuallySrcset}
                  alt={generateAlt(groupKey, writer.name)}
                  id={priorityImageId || imageId}
                />
              </div>
            ) : (
              <div className="image-card-preload-img-wrapper loading-background">
                <div
                  className={`image-card-preload-img`}
                  style={{
                    paddingTop: `${(formatHeight / formatWidth) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </Link>

        {isLoadedImage && (
          <>
            {/* isShowHoverMenuがfalseになるたびにFavoriteButtonがunmountされstateがリセットされていたため
                {(this.props.getIsFavorite() !== null) && */}
            <FavoriteButton
              groupKey={groupKey}
              lottieName={lottieName}
              isFavorite={isFavorite}
              isShowMenu={isShowMenu}
              cardHeight={cardHeight}
              type="image-card"
              onClickFavoriteButton={onClickFavoriteButton}
            />
            {isShowMenu && isEnoughHighMenu && (
              <DownloadButton
                className={"image-card-download-button-ver2"}
                groupId={groupId}
                onClick={() => {
                  downloadImage(URLJoin(BASE_URL, urlPath), csrftoken);
                }}
              />
            )}
            {isShowMenu && (
              <>
                <ToBlogButton url={blogUrl} title={blogTitle} />
                <DropdownMobileFriendly
                  id={`image-card-detail-button-${imageId}`}
                  buttonClass="p-0 image-card-detail-button image-card-button rounded-circle"
                  buttonContainerClass="image-card-detail-button-super text-center"
                  onToggleWork={(prevIsOpen) => {
                    if (prevIsOpen) {
                      hideMenu();
                    }
                    setIsOpenDropdownMenu(!prevIsOpen);
                  }}
                  menuSettings={[
                    {
                      type: "ONCLICK",
                      label: "この画像をダウンロードする",
                      onClick: () => {
                        downloadImage(URLJoin(BASE_URL, urlPath), csrftoken);
                      },
                      icon: faDownload,
                    },
                    {
                      type: "ANCHOR",
                      href: officialUrl,
                      targetBlank: true,
                      label: "公式ブログで確認",
                      icon: faExternalLinkAlt,
                    },
                    {
                      type: "LINK",
                      pathname: writer.url["images"],
                      label: `「${writer.name}」の画像を探す`,
                      icon: faImages,
                    },
                    {
                      type: "LINK",
                      pathname: writer.url["blogs"],
                      label: `「${writer.name}」のブログを探す`,
                      icon: faNewspaper,
                    },
                  ]}
                >
                  <FontAwesomeIcon icon={faBars} />
                </DropdownMobileFriendly>
              </>
            )}
          </>
        )}
      </div>

      {(footerMessage || isMobile) && (
        <div className="image-card-footer">
          <div className={"image-card-message " + (isMobile ? "mobile" : "")}>
            {footerMessage && (
              <Link
                to={{
                  pathname: urlPath,
                  state: { prevSrc: srcCollection },
                }}
                onMouseEnter={() => {
                  onMouseEnterOrLeave(true);
                }}
                onMouseLeave={() => {
                  onMouseEnterOrLeave(false);
                }}
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`card-message mx-auto py-2 ${
                    !isMobile ? "pc" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faCrown} style={{ color: "gold" }} />{" "}
                  <b>{footerMessage}</b>
                </div>
              </Link>
            )}
          </div>
          {isMobile && (
            <DropdownMobileFriendly
              ref={dropdownMenuMobile}
              id={`image-card-detail-button-mobile-${imageId}`}
              buttonClass="rounded-circle transparent-button-mobile ml-auto"
              menuSettings={[
                {
                  type: "TITLE",
                  label: `${blogTitle}（${writer.name}）`,
                },
                {
                  type: "CUSTOM_ONLY_MOBILE",
                  menuComponent: (
                    <FavoriteButton
                      type="image-card-detail-menu"
                      groupKey={groupKey}
                      lottieName={lottieName}
                      isFavorite={isFavorite}
                      onClickFavoriteButton={onClickFavoriteButton}
                    />
                  ),
                },
                {
                  type: "LINK",
                  pathname: urlPath,
                  state: { prevSrc: srcCollection },
                  label: "詳細ページへ",
                  icon: faChevronCircleRight,
                },
                {
                  type: "ANCHOR",
                  href: officialUrl,
                  targetBlank: true,
                  label: "公式ブログで確認",
                  icon: faExternalLinkAlt,
                },
                {
                  type: "LINK",
                  pathname: writer.url["images"],
                  label: `「${writer.name}」の画像を探す`,
                  icon: faImages,
                },
                {
                  type: "LINK",
                  pathname: writer.url["blogs"],
                  label: `「${writer.name}」のブログを探す`,
                  icon: faNewspaper,
                },
              ]}
            >
              <FontAwesomeIcon icon={faEllipsisH} />
            </DropdownMobileFriendly>
          )}
        </div>
      )}
    </>
  );
};

// 1ページに数百単位でレンダリングされるコンポーネントのため、
// ImageCardのprops・stateに変更があったときのみ再レンダー(memo)
const geneImageCardDom = () => {
  const ImageCardMemo = React.memo(withCookies(ImageCard));

  const _ImageCard = (props) => {
    const { groupId, blogCt, order } = props;
    const imageId = `${groupId}-${blogCt}-${order}`;

    const domState = useDomState();

    return (
      <ImageCardMemo
        {...props}
        orderly={false}
        imageId={imageId}
        isFavorite={domState.favoriteState[imageId]}
      />
    );
  };

  return _ImageCard;
};

export default geneImageCardDom();
