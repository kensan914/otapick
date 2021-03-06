import { useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router";

import { URLJoin, getGroup } from "~/utils";
import { BASE_URL } from "~/constants/env";
import { useAxiosQuery } from "~/hooks/useAxiosQuery";

/**
 * blog・image兼用のhooks. URL(match.params)から各値を取得し返却.
 * orderのみimage限定
 * @returns
 */
export const useViewMatchParams = () => {
  const match = useRouteMatch();

  const [groupId] = useState(match?.params?.groupId);
  const [blogCt] = useState(match?.params?.blogCt);
  const [order] = useState(match?.params?.order); // image限定
  const [groupKey] = useState(getGroup(groupId));

  return { groupId, blogCt, order, groupKey };
};

/**
 * blog・image兼用のhooks. otapickのblog/image詳細URLを生成し返す
 * blogのみorderがundefinedであるため、geneImageApiUrlを提供
 * @param {*} groupId
 * @param {*} blogCt
 * @param {*} order imageのみ必要. blogはundefinedで可
 * @returns
 */
export const useViewUrl = (groupId, blogCt, order) => {
  const [imageApiUrl] = useState(
    URLJoin(BASE_URL, "image/", groupId, blogCt, order)
  );
  const geneImageApiUrl = (_order) =>
    URLJoin(BASE_URL, "image/", groupId, blogCt, _order);
  const [blogApiUrl] = useState(URLJoin(BASE_URL, "blog/", groupId, blogCt));
  const [blogUrlPath] = useState(`/${URLJoin("blog/", groupId, blogCt)}`);

  return { imageApiUrl, blogApiUrl, blogUrlPath, geneImageApiUrl };
};

export const useView = (blogApiUrl, setMetaVerView, order) => {
  const [images, setImages] = useState();
  const [blog, setBlog] = useState();

  const [status, setStatus] = useState("");
  const [viewKey, setViewKey] = useState("");
  const [downloadKey, setDownloadKey] = useState("");

  const [isReadyView, setIsReadyView] = useState(false);

  useAxiosQuery(blogApiUrl, {
    thenCallback: (resData) => {
      const blogData = resData;
      if (resData["status"] === "success") {
        // order error(orderが渡されるimageのみ有効. blogはそのままパスされる)
        if (typeof order !== "undefined" && resData.images.length <= order) {
          setStatus("get_image_failed");
          setBlog(blogData);
          setMetaVerView && setMetaVerView("get_image_failed");
        } else {
          setBlog(blogData);
          setImages(resData.images);
          setStatus("success");
          setViewKey(resData.viewKey);
          setDownloadKey(resData.downloadKey);

          setMetaVerView &&
            setMetaVerView("success", blogData.title, blogData.writer.name);
        }
      } else if (resData["status"] === "blog_not_found") {
        setStatus("blog_not_found");
        setMetaVerView && setMetaVerView("blog_not_found");
      }
    },
  });

  useEffect(() => {
    if (
      !isReadyView &&
      typeof images !== "undefined" &&
      typeof blog !== "undefined" &&
      typeof status === "string" &&
      status.length > 0 &&
      typeof viewKey === "string" &&
      viewKey.length > 0 &&
      typeof downloadKey === "string" &&
      downloadKey.length > 0
    ) {
      setIsReadyView(true);
    }
  }, [images, blog, status, viewKey, downloadKey]);

  return [images, setImages, blog, status, viewKey, downloadKey, isReadyView];
};

/**
 * blog・image兼用の閲覧数・DL数管理hooks.
 * サーバに閲覧数・DL数をputする処理ではなく、putした後にstateに対して加算する値を管理
 * @param {*} images
 * @param {*} setImages
 * @returns
 */
export const useViewNum = (images, setImages) => {
  const [addedNumOfViewsOnlyBlog, setAddedNumOfViewsOnlyBlog] = useState(0);
  const [
    addedNumOfDownloadsOnlyBlog,
    setAaddedNumOfDownloadsOnlyBlog,
  ] = useState(0);
  // incrementNumOfDownloadsがmobileにおいてサイレンダリングがかからない(setTimeoutに渡しているから?)のでrefをかませる
  const addedNumOfDownloadsOnlyBlogRef = useRef(0);

  const incrementNumOfViews = (order = -1) => {
    if (order < 0) {
      // blog
      setAddedNumOfViewsOnlyBlog(addedNumOfViewsOnlyBlog + 1);
    } else {
      // image
      let _images = [...images];
      if (_images.length > order) {
        _images[Number(order)].numOfViews += 1;
        setImages(_images);
      }
    }
  };

  const incrementNumOfDownloads = (order = -1, num = 1) => {
    if (order < 0) {
      addedNumOfDownloadsOnlyBlogRef.current += num;
      // 総DL数
      setAaddedNumOfDownloadsOnlyBlog(addedNumOfDownloadsOnlyBlogRef.current);
    } else {
      // DL数
      let _images = [...images];
      if (_images.length > order) {
        _images[Number(order)].numOfDownloads += num;
        setImages(_images);
      }
    }
  };

  return {
    addedNumOfViewsOnlyBlog,
    incrementNumOfViews,
    addedNumOfDownloadsOnlyBlog,
    incrementNumOfDownloads,
  };
};
