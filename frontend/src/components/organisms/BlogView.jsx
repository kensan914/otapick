import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { DELAY_TIME } from "../modules/env";
import Masonry from "react-masonry-component";
import ImageCard from "../molecules/ImageCard";
import { addLongPressEventListeners, isMobile, isSmp } from "../modules/utils";
import { withCookies } from "react-cookie";
import { useDomDispatch } from "../contexts/DomContext";
import { useLocation } from "react-router-dom";

const BlogView = (props) => {
  const {
    group,
    images,
    blogViewURL,
    incrementNumOfDownloads,
    putDownload,
    mode,
    blogUrl,
    officialUrl,
    writer,
    blogCt,
    blogTitle,
    groupID,
    cookies,
  } = props;

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [checkList, setCheckList] = useState(Array(images.length).fill(false));
  const [isShowAlert, setIsShowAlert] = useState(false);

  const domDispatch = useDomDispatch();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkList.includes(true)) {
      let orderList = [];
      for (const [index, val] of checkList.entries()) {
        if (val) orderList.push(index);
      }
      axios
        .post(blogViewURL, orderList, {
          headers: {
            "X-CSRFToken": cookies.get("csrftoken"),
          },
          responseType: "blob",
        })
        .then((res) => {
          domDispatch({
            type: "OPEN_GLOBAL_MODAL",
            globalModalId: "ImageDownloadedModal",
          });
          setIsCheckAll(false);
          setCheckList(Array(images.length).fill(false));
          setIsShowAlert(false);

          const blob = new Blob([res.data], {
            type: res.data.type,
          });
          const fileName = res.headers["content-disposition"].match(
            /filename="(.*)"/
          )[1];
          saveAs(blob, fileName);
          incrementNumOfDownloads(-1, orderList.length);
        });
    } else {
      if (!isShowAlert) setIsShowAlert(true);
    }
  };

  const handleAllCheckChange = (e) => {
    const target = e.target;
    const value = target.checked;

    setIsCheckAll(value);
    setCheckList([...checkList].fill(value));
  };

  const handleCheckChange = (e) => {
    const target = e.target;
    const value = target.checked;

    const _checkList = [...checkList];
    _checkList[target.name] = value;
    setCheckList(_checkList);
  };

  const changeCheck = (order) => {
    const _checkList = [...checkList];
    _checkList[order] = !_checkList[order];
    setCheckList(_checkList);
  };

  const loadOriginalImage = () => {
    let imageObjects = [];
    for (const [index, image] of images.entries()) {
      if (mode === "view") {
        // view
      } else if (mode === "download") {
        imageObjects.push(new Image());
        imageObjects[index].onload = setTimeout(() => {
          const blogImageID = geneImageID(image.order);
          const targetImage = document.getElementById(blogImageID);
          targetImage.style.backgroundImage =
            "url(" + imageObjects[index].src + ")";
        }, DELAY_TIME);
        imageObjects[index].src = image.src["originals"];
      }
    }
  };

  useEffect(() => {
    loadOriginalImage();
  }, []);

  useEffect(() => {
    loadOriginalImage();
  }, [mode]);

  // cache導入でimageIDが複数存在しうるため（今のところBlogViewはcache対象外であるが）
  const geneImageID = (order) =>
    `blog-image-${groupID}_${blogCt}_${order}_${location.key}`;

  if (mode === "view") {
    const options = {
      itemSelector: ".grid-item",
      transitionDuration: 0,
      stagger: 0,
    };

    return (
      <div className="container">
        {isMobile && (
          <div
            className="alert alert-success mb-1"
            role="alert"
            style={{ borderRadius: "1rem", fontSize: 14 }}
          >
            画像を長押しして保存をおこなってください
          </div>
        )}
        <Masonry options={options} className="mt-3 image-list-in-blog-view">
          {images.map(({ src, url, order, isFavorite, width, height }, i) => (
            <div
              key={order}
              className="grid-item col-12 col-sm-6 my-2 my-sm-3 px-0 px-sm-2"
            >
              <ImageCard
                groupId={groupID}
                groupKey={group}
                blogCt={blogCt}
                blogTitle={blogTitle}
                srcCollection={src}
                url={url}
                blogUrl={blogUrl}
                officialUrl={officialUrl}
                writer={writer}
                priorityImageId={geneImageID(order)}
                order={order}
                initIsFavorite={isFavorite}
                width={width}
                height={height}
                shouldLoadOriginal={true}
                didMountImage={() => {
                  const blogImageID = geneImageID(order);
                  const targetImage = document.getElementById(blogImageID);
                  addLongPressEventListeners(targetImage, () =>
                    putDownload(order)
                  );
                }}
              />
            </div>
          ))}
        </Masonry>
      </div>
    );
  } else if (mode === "download") {
    return (
      <>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="col-md-3 col-lg-2 ml-auto" style={{ width: 200 }}>
            <div className="custom-control custom-checkbox">
              <input
                name="allCheck"
                type="checkbox"
                className="custom-control-input"
                id="allCheck"
                checked={isCheckAll}
                onChange={(e) => handleAllCheckChange(e)}
              />
              <label className="custom-control-label" htmlFor="allCheck">
                すべて選択
              </label>
            </div>
          </div>

          <div className="container my-4">
            <div className="row text-center">
              {images.map((image, index) => (
                <div key={index} className="col-6 col-md-4 col-xl-3 mb-5">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => changeCheck(image.order)}
                  >
                    <div className={group}>
                      <div
                        className={
                          "thumbnail img-thumbnail mx-auto " +
                          (checkList[image.order] ? "checked" : "")
                        }
                        // id={`image_${image.order}`}
                        id={geneImageID(image.order)}
                        style={{
                          background: `-webkit-image-set( url(${image.src["250x"]}) 1x, url(${image.src["500x"]}) 2x )`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <input
                          className="save_img_checkbox"
                          type="checkbox"
                          onChange={(e) => handleCheckChange(e)}
                          name={image.order}
                          checked={checkList[image.order]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {isShowAlert && (
            <div
              className="alert alert-danger py-2 mb-5 mt-0"
              role="alert"
              style={{ borderRadius: "1rem" }}
            >
              画像を選択してください。
            </div>
          )}
          <div className="mx-auto mb-5" style={{ width: 150 }}>
            <button
              type="submit"
              className={"gradient-btn " + group}
              style={{ width: 150 }}
            >
              <b>保存</b>
            </button>
          </div>
        </form>
      </>
    );
  }
};

export default withCookies(BlogView);
