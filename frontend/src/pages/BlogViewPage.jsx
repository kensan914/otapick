import React, { useEffect, useState } from "react";
import { withCookies } from "react-cookie";

import { useDomDispatch, useDomState } from "~/contexts/DomContext";
import { useAxios, requestAxios } from "~/hooks/useAxios";
import { useCacheRoute } from "~/hooks/useCacheRoute";
import { BlogViewTemplate } from "~/components/templates/BlogViewTemplate";
import {
  useView,
  useViewMatchParams,
  useViewNum,
  useViewUrl,
} from "~/hooks/useView";
import { useMeta } from "~/hooks/useMeta";

const BlogViewPage = (props) => {
  const { cookies } = props;

  const { isCachedRoute } = useCacheRoute();
  const csrftoken = cookies.get("csrftoken");
  const domState = useDomState();
  const domDispatch = useDomDispatch();

  const { groupId, blogCt, groupKey } = useViewMatchParams();
  const { blogApiUrl, blogUrlPath, geneImageApiUrl } = useViewUrl(
    groupId,
    blogCt
  );
  const [mode, setMode] = useState("VIEW"); // "VIEW" | "DL"
  const [accessedBlogId] = useState(`${groupId}_${blogCt}`);

  const { setMeta } = useMeta();
  const setMetaVerView = (status, blogTitle, blogWriter) => {
    switch (status) {
      case "success":
        setMeta(
          `${blogTitle}(${blogWriter})｜ブログ詳細`,
          `${blogWriter}のブログ「${blogTitle}」です。`
        );
        break;
      case "get_image_failed":
        setMeta("Not Found Image", "");
        break;
      case "blog_not_found":
        setMeta("Not Found Blog", "");
        break;
      case "accepted":
        setMeta("画像取得中", "");
        break;
      default:
        throw new Error(`the status "${status} is unexpected."`);
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
  ] = useView(blogApiUrl, setMetaVerView);
  const {
    addedNumOfViewsOnlyBlog,
    incrementNumOfViews,
    addedNumOfDownloadsOnlyBlog,
    incrementNumOfDownloads,
  } = useViewNum(images, setImages);

  const changeMode = (_mode) => {
    if (_mode !== mode) {
      if (_mode === "VIEW" || _mode === "DL") {
        setMode(_mode);
      } else {
        throw new Error(`the mode "${_mode} is unexpected."`);
      }
    }
  };

  const { request: requestPutView } = useAxios(blogApiUrl, "put", {
    data: { action: "view", key: viewKey },
    csrftoken: csrftoken,
    thenCallback: (res) => {
      if (res.data["status"] == "success") {
        incrementNumOfViews(-1);
      }
    },
    limitRequest: 1, // 再送防止
  });

  const requestPutDownloadOnlyMobile = (_order) => {
    const imageApiUrl = geneImageApiUrl(_order);

    requestAxios(imageApiUrl, "put", {
      data: { action: "download", key: downloadKey },
      csrftoken: csrftoken,
      thenCallback: (res) => {
        if (res.data["status"] == "success") {
          incrementNumOfDownloads(-1);
        }
      },
    });
  };

  useEffect(() => {
    // image viewの準備ができた
    if (!isCachedRoute && isReadyView) {
      if (!domState.accessedBlogs.includes(accessedBlogId)) {
        requestPutView();
        domDispatch({
          type: "ACCESS_TO_BLOG",
          blogId: accessedBlogId,
        });
      }

      if (blog?.writer?.name) {
        // update meta
        setMetaVerView(status, blog.title, blog.writer.name);
      }
    }
  }, [isCachedRoute, isReadyView]);

  return (
    <BlogViewTemplate
      mode={mode}
      changeMode={changeMode}
      groupKey={groupKey}
      addedNumOfViewsOnlyBlog={addedNumOfViewsOnlyBlog}
      addedNumOfDownloadsOnlyBlog={addedNumOfDownloadsOnlyBlog}
      images={images}
      blog={blog}
      status={status}
      requestPutDownloadOnlyMobile={requestPutDownloadOnlyMobile}
      incrementNumOfDownloads={incrementNumOfDownloads}
      blogApiUrl={blogApiUrl}
      blogUrlPath={blogUrlPath}
    />
  );
};

export default withCookies(BlogViewPage);
