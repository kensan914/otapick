import { useState, useEffect } from "react";
import { useLocation } from "react-router";

import { BASE_URL, BLOGS_DESCRIPTION } from "~/constants/env";
import { useAxios } from "~/hooks/useAxios";
import { useListMatchParams, useListQueryString } from "~/hooks/useList";
import { gtagTo, updateMeta, URLJoin } from "~/utils";

export const useBlogListInfo = () => {
  const { groupId, ct } = useListMatchParams();
  const { orderFormat, narrowingKeyword, narrowingPost } = useListQueryString(
    "BLOGS"
  );

  const [infoTitle, setInfoTitle] = useState("");
  const [infoStatus, setInfoStatus] = useState("");
  const [numOfHit, setNumOfHit] = useState(0);
  const [sortButtonTitle, setSortButtonTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");

  const location = useLocation();
  const queryParams = location.search;
  const { request: requestGetBlogsInfo } = useAxios(
    URLJoin(BASE_URL, "blogs/info/", groupId, ct, queryParams),
    "get",
    {
      thenCallback: (res, resData) => {
        if (resData.status) {
          setInfoTitle("ブログが見つかりませんでした。");
          setNumOfHit(0);
          setInfoStatus("not_found");
          setMetaTitle("Not Found Blog");
          updateMeta({
            title: "Not Found Blog",
            description: BLOGS_DESCRIPTION,
          });
        } else {
          setInfoTitle(resData.title);
          setNumOfHit(resData.numOfHit);
          setInfoStatus("success");
          setMetaTitle(resData.metaTitle);
          updateMeta({
            title: `${resData.metaTitle}のブログ一覧`,
            description: BLOGS_DESCRIPTION,
          });
        }
      },
      finallyCallback: () => {
        gtagTo(location.pathname);
      },
    }
  );

  const convertSortButtonTitle = (orderFormat) => {
    switch (orderFormat) {
      case "newer_post":
        return "新着順";
      case "older_post":
        return "古い順";
      case "popularity":
        return "人気順";
      case "dl":
        return "DL順";
      case "sum_dl":
        return "総DL順";
      case "view":
        return "閲覧数順";
      default:
        return "";
    }
  };

  useEffect(() => {
    setSortButtonTitle(convertSortButtonTitle(orderFormat));
    requestGetBlogsInfo();
    updateMeta({
      title: `${metaTitle}のブログ一覧`,
      description: BLOGS_DESCRIPTION,
    });
  }, [groupId, ct, orderFormat, narrowingKeyword, narrowingPost]);

  return { infoTitle, infoStatus, numOfHit, sortButtonTitle };
};
