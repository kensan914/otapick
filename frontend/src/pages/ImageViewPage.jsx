import React, { useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { useLocation } from "react-router";

import { useDomDispatch, useDomState } from "~/contexts/DomContext";
import { useAxios } from "~/hooks/useAxios";
import { useCacheRoute } from "~/hooks/useCacheRoute";
import { generateUuid4 } from "~/utils";
import ImageViewTemplate from "~/components/templates/ImageViewTemplate";
import {
  useView,
  useViewMatchParams,
  useViewNum,
  useViewUrl,
} from "~/hooks/useView";
import { useMeta } from "~/hooks/useMeta";

const ImageViewPage = (props) => {
  const { cookies } = props;

  const { isCachedRoute } = useCacheRoute();
  const csrftoken = cookies.get("csrftoken");
  const domState = useDomState();
  const domDispatch = useDomDispatch();
  const location = useLocation();

  const { groupId, blogCt, order, groupKey } = useViewMatchParams();
  const { imageApiUrl, blogApiUrl } = useViewUrl(groupId, blogCt, order);
  const [imageId] = useState(`${groupId}-${blogCt}-${order}`);
  const [accessedImageId] = useState(`${imageId}.${generateUuid4()}`);
  const prevSrcCollection =
    typeof location.state !== "undefined" ? location.state.prevSrc : null;

  const { setMeta } = useMeta();
  const setMetaVerView = (status, blogTitle, blogWriter) => {
    if (status === "success") {
      setMeta(
        `${blogTitle}(${blogWriter})｜画像詳細`,
        `${blogWriter}のブログ「${blogTitle}」の画像です。`
      );
    } else if (status === "blog_not_found") {
      setMeta("Not Found Blog", "");
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
  ] = useView(blogApiUrl, setMetaVerView, order);
  const { incrementNumOfViews, incrementNumOfDownloads } = useViewNum(
    images,
    setImages
  );

  const { request: requestPutView } = useAxios(imageApiUrl, "put", {
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
    imageApiUrl,
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
        setMetaVerView(status, blog.title, blog.writer.name);
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
