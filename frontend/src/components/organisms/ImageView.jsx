import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { BASE_URL } from "../modules/env";
import {
  URLJoin,
  generateAlt,
  isSmp,
  isMobile,
  addLongPressEventListeners,
  geneIsFavoriteGetterSetter,
} from "../modules/utils";
import { Link, useLocation } from "react-router-dom";
import WriterCard from "../atoms/WriterCard";
import { HorizontalLoader } from "../molecules/Loader";
import { NotFoundMessage } from "../atoms/NotFound";
import { withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";
import FavoriteButton, { useFavoriteButton } from "../atoms/FavoriteButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faDownload,
  faExternalLinkAlt,
  faEye,
  faImages,
  faLink,
  faNewspaper,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import TooltipComponent from "../atoms/TooltipComponent";
import DownloadButton from "../atoms/DownloadButton";
import DropdownMobileFriendly from "../molecules/DropdownMobileFriendly";
import { useDomDispatch, useDomState } from "../contexts/DomContext";
import useCacheRoute from "../modules/cacheRoute";

export const downloadImage = (
  url,
  csrftoken,
  incrementNumOfDownloads = () => void 0,
  order
) => {
  axios
    .post(
      url,
      {},
      {
        headers: {
          "X-CSRFToken": csrftoken,
        },
        responseType: "blob",
      }
    )
    .then((res) => {
      const blob = new Blob([res.data], {
        type: res.data.type,
      });
      const fileName = res.headers["content-disposition"].match(
        /filename="(.*)"/
      )[1];
      saveAs(blob, fileName);
      incrementNumOfDownloads && incrementNumOfDownloads(order);
    });
};

const ImageView = (props) => {
  const {
    groupId,
    blogCt,
    order,
    groupKey,
    imageId,
    images,
    blog,
    status,
    isReadyView,
    requestPutDownloadOnlyMobile,
    incrementNumOfDownloads,
    prevSrcCollection,
    cookies,
  } = props;

  const location = useLocation();
  const domState = useDomState();
  const domDispatch = useDomDispatch();
  const { isCachedRoute } = useCacheRoute();

  const [mainImageId] = useState(`${imageId}-${location.key}`);

  const { getIsFavorite, setIsFavorite } = geneIsFavoriteGetterSetter(
    domState.favoriteState,
    domDispatch,
    imageId
  );
  const csrftoken = cookies.get("csrftoken");
  const [onClickFavoriteButton, lottieName] = useFavoriteButton(
    groupId,
    blogCt,
    order,
    setIsFavorite,
    getIsFavorite(),
    csrftoken
  );

  useEffect(() => {
    if (isReadyView) {
      const mainImage = document.getElementById(mainImageId);
      // 長押し検出eventをadd
      addLongPressEventListeners(mainImage, requestPutDownloadOnlyMobile);
    }
  }, [isReadyView]);

  useEffect(() => {
    if (isReadyView && !isCachedRoute) {
      const mainImage = document.getElementById(mainImageId);

      // load original image
      let imageObject = new Image();
      imageObject.onload = () => {
        if (mainImage !== null) {
          mainImage.removeAttribute("srcset");
          mainImage.setAttribute("src", imageObject.src);
        }
      };
      const image = images[order];
      imageObject.src = image.src["originals"];

      // init isFavorite
      domDispatch({
        type: "INIT_FAVORITE",
        imageID: imageId,
        isFavorite: images[order].isFavorite,
      });
    }
  }, [isReadyView, isCachedRoute]);

  let imageView;
  let imageViewText;
  let imageAlt;
  if (!isReadyView) {
    imageViewText = <HorizontalLoader />;
  } else if (status === "blog_not_found") {
    imageView = (
      <div className="py-0 py-sm-5">
        <NotFoundMessage type="blogFailed" margin={true} />
      </div>
    );
  } else if (status === "success") {
    const image = images[order];
    imageViewText = (
      <div className="ml-1 ml-sm-3 ml-lg-4 image-view-text">
        <div className="d-flex justify-content-between mt-1 mt-sm-3 mt-lg-2 mb-2 image-view-header">
          <div className="d-flex align-items-center p-0">
            <TooltipComponent title="この画像の閲覧数">
              <div id="num-of-image-views-icon">
                <FontAwesomeIcon icon={faEye} style={{ color: "gray" }} />
              </div>
            </TooltipComponent>

            {"\u00A0"}
            {image ? image.numOfViews : 0}

            <TooltipComponent title="この画像のダウンロード数">
              <div className="ml-3" id="num-of-image-downloads-icon">
                <FontAwesomeIcon icon={faDownload} style={{ color: "gray" }} />
              </div>
            </TooltipComponent>

            {"\u00A0"}
            {image ? image.numOfDownloads : 0}
          </div>

          <div className="d-flex justify-content-end">
            <FavoriteButton
              groupKey={groupKey}
              isFavorite={getIsFavorite()}
              lottieName={lottieName}
              onClickFavoriteButton={onClickFavoriteButton}
              type="image-view"
            />
            {!isMobile && (
              <>
                <TooltipComponent title="この画像をダウンロード">
                  <DownloadButton
                    className="image-view-download-button-v2"
                    groupId={groupId}
                    onClick={() => {
                      image &&
                        downloadImage(
                          URLJoin(BASE_URL, image.url),
                          csrftoken,
                          incrementNumOfDownloads,
                          order
                        );
                    }}
                  />
                </TooltipComponent>
              </>
            )}
          </div>
        </div>

        <div>
          <hr className="mt-2 mt-lg-3 mb-4 mr-3" />
        </div>

        <div className="image-view-body">
          <div className="d-flex mb-3">
            <TooltipComponent title="掲載ブログ">
              <FontAwesomeIcon
                className="mr-3"
                icon={faLink}
                id="image-view-blog-icon"
              />
            </TooltipComponent>
            {blog.url && (
              <Link to={blog.url} className="image-view-blog-title">
                {blog.title.length > 50 || isSmp ? (
                  blog.title.length > 0 ? (
                    <h3 className="smaller">{blog.title}</h3>
                  ) : (
                    <h3 className="smaller">{"\u00A0"}</h3>
                  )
                ) : blog.title.length > 0 ? (
                  <h3>{blog.title}</h3>
                ) : (
                  <h3>{"\u00A0"}</h3>
                )}
              </Link>
            )}
          </div>

          <div className="d-flex align-items-center">
            <TooltipComponent title="ブログを書いたメンバー">
              <FontAwesomeIcon
                className="mr-3"
                icon={faPencilAlt}
                id="image-view-writer-icon"
              />
            </TooltipComponent>

            <WriterCard writer={blog.writer} />
          </div>
        </div>

        <div className="image-view-footer mt-4 mt-sm-5 mt-lg-2 mb-2">
          <div className="image-view-to-official-button-wrapper">
            <TooltipComponent title="公式ブログで確認">
              <a
                className={
                  "btn btn-primary rounded-pill image-view-to-official-button py-0 " +
                  (isSmp ? "px-2" : "")
                }
                id="image-view-to-official-button"
                role="button"
                target="_blank"
                rel="noreferrer"
                href={blog.officialUrl}
              >
                <h6 className="omit-title m-0 image-view-to-official-title">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />{" "}
                  {groupKey + "zaka46.com"}
                </h6>
              </a>
            </TooltipComponent>
          </div>

          <DropdownMobileFriendly
            id="image-view-card-menu"
            buttonClass="p-0 image-view-detail-button rounded-circle"
            menuSettings={[
              ...(isMobile
                ? [
                    {
                      type: "TITLE",
                      label: `${blog.title}（${blog.writer.name}）`,
                    },
                    {
                      type: "LINK",
                      pathname: blog.url,
                      label: "掲載ブログを確認",
                      icon: faLink,
                    },
                  ]
                : [
                    {
                      type: "ONCLICK",
                      label: "この画像をダウンロードする",
                      onClick: () => {
                        downloadImage(
                          URLJoin(BASE_URL, image.url),
                          csrftoken,
                          incrementNumOfDownloads,
                          order
                        );
                      },
                      icon: faDownload,
                    },
                  ]),
              {
                type: "ANCHOR",
                href: blog.officialUrl,
                targetBlank: true,
                label: "公式ブログで確認",
                icon: faExternalLinkAlt,
              },
              {
                type: "LINK",
                pathname: blog.writer.url["images"],
                label: `「${blog.writer.name}」の画像を探す`,
                icon: faImages,
              },
              {
                type: "LINK",
                pathname: blog.writer.url["blogs"],
                label: `「${blog.writer.name}」のブログを探す`,
                icon: faNewspaper,
              },
            ]}
          >
            <FontAwesomeIcon icon={faBars} />
          </DropdownMobileFriendly>
        </div>
      </div>
    );

    imageAlt = generateAlt(groupKey, blog.writer.name);
  }

  let src;
  if (prevSrcCollection) {
    src = prevSrcCollection["250x"];
  } else {
    if (status === "success" && images.length > 0) {
      const image = images[order];
      src = image.src["250x"];
    } else {
      src = null;
    }
  }
  if (isSmp) {
    imageView = (
      <>
        <img
          className="image-of-image-view smp"
          src={src}
          id={mainImageId}
          alt={imageAlt}
        />
        <div className="container mt-3 text-muted">
          <div
            className="alert alert-success"
            role="alert"
            style={{ borderRadius: "1rem", fontSize: 14 }}
          >
            画像を長押しして保存をおこなってください
          </div>
          <div
            className={"card otapick-card2 mx-auto image-view smp " + groupKey}
          >
            <div className="card-body">
              <div className="p-0">{imageViewText}</div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    let srcSet;
    if (prevSrcCollection) {
      srcSet = `${prevSrcCollection["250x"]} 1x, ${prevSrcCollection["500x"]} 2x`;
    } else {
      if (status === "success") {
        const image = images[order];
        srcSet = `${image.src["250x"]} 1x, ${image.src["500x"]} 2x`;
      } else {
        srcSet = null;
      }
    }
    imageView = (
      <div
        className={`card otapick-card2 mx-auto image-view ${
          isMobile ? "mb-3 mt-1" : "my-4"
        } ${groupKey}`}
      >
        <div className="card-body">
          <div className="row m-0">
            <div className="col-12 col-lg-6 p-0">
              <img
                className="image-of-image-view"
                src={src}
                id={mainImageId}
                srcSet={srcSet}
                alt={imageAlt}
                onContextMenu={(e) => (!isMobile ? e.preventDefault() : "")}
                onMouseDown={(e) => (!isMobile ? e.preventDefault() : "")}
              />
            </div>
            <div className="col-12 col-lg-6 p-0">{imageViewText}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isSmp ? (
        <div>{imageView}</div>
      ) : (
        <div className="container mt-3 text-muted">{imageView}</div>
      )}
    </>
  );
};

export default withRouter(withCookies(ImageView));
