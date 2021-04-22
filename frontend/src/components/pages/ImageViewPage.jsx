import React, { useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { useLocation } from "react-router";
import { useDomDispatch, useDomState } from "../contexts/DomContext";
import { useAxios } from "../modules/axios";
import useCacheRoute from "../modules/cacheRoute";
import { generateUuid4, updateMeta } from "../modules/utils";
import ImageViewTemplate from "../templates/ImageViewTemplate";
import {
  useView,
  useViewMatchParams,
  useViewNum,
  useViewUrl,
} from "../templates/ViewTemplate";

const ImageViewPage = (props) => {
  const { cookies } = props;

  const { isCachedRoute } = useCacheRoute();
  const csrftoken = cookies.get("csrftoken");
  const domState = useDomState();
  const domDispatch = useDomDispatch();
  const location = useLocation();

  const { groupId, blogCt, order, groupKey } = useViewMatchParams();
  const { imageViewUrl, blogViewUrl } = useViewUrl(groupId, blogCt, order);
  const [imageId] = useState(`${groupId}-${blogCt}-${order}`);
  const [accessedImageId] = useState(`${imageId}.${generateUuid4()}`);
  const prevSrcCollection =
    typeof location.state !== "undefined" ? location.state.prevSrc : null;

  const updateMetaVerView = (status, blogTitle, blogWriter) => {
    if (status === "success") {
      updateMeta({
        title: `${blogTitle}(${blogWriter})｜画像詳細`,
        description: `${blogWriter}のブログ「${blogTitle}」の画像です。`,
      });
    } else if (status === "blog_not_found") {
      updateMeta({ title: "Not Found Blog", description: "" });
    }
  };

  const [
    images,
    setImages,
    blog,
    status,
    viewKey,
    downloadKey,
    isReadyView,
  ] = useView(blogViewUrl, order, updateMetaVerView);
  const { incrementNumOfViews, incrementNumOfDownloads } = useViewNum(
    images,
    setImages
  );

  const { request: requestPutView } = useAxios(imageViewUrl, "put", {
    data: { action: "view", key: viewKey },
    csrftoken: csrftoken,
    thenCallback: (res) => {
      if (res.data["status"] == "success") {
        incrementNumOfViews(order);
      }
    },
    limitRequest: 1, // 再送防止
  });

  const { request: requestPutDownloadOnlyMobile } = useAxios(
    imageViewUrl,
    "put",
    {
      data: { action: "download", key: downloadKey },
      csrftoken: csrftoken,
      thenCallback: (res) => {
        if (res.data["status"] == "success") {
          incrementNumOfDownloads(order);
        }
      },
    }
  );

  useEffect(() => {
    // image viewの準備ができた
    if (!isCachedRoute && isReadyView) {
      if (!domState.accessedImages.includes(accessedImageId)) {
        requestPutView();
        domDispatch({
          type: "ACCESS_TO_IMAGE",
          imageId: accessedImageId,
        });
      }

      if (blog?.writer?.name) {
        // update meta
        updateMetaVerView(status, blog.title, blog.writer.name);
      }
    }
  }, [isCachedRoute, isReadyView]);

  return (
    <ImageViewTemplate
      groupId={groupId}
      blogCt={blogCt}
      order={order}
      groupKey={groupKey}
      imageId={imageId}
      images={images}
      blog={blog}
      status={status}
      isReadyView={isReadyView}
      requestPutDownloadOnlyMobile={requestPutDownloadOnlyMobile}
      incrementNumOfDownloads={incrementNumOfDownloads}
      prevSrcCollection={prevSrcCollection}
    />
  );
};

export default withCookies(ImageViewPage);
