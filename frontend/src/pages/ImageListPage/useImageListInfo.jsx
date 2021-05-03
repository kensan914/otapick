import { useState, useEffect } from "react";
import { useLocation } from "react-router";

import { BASE_URL, HOME_TITLE, IMAGES_DESCRIPTION } from "~/constants/env";
import { useAxios } from "~/hooks/useAxios";
import { useListMatchParams, useListQueryString } from "~/hooks/useList";
import { gtagTo, updateMeta, URLJoin } from "~/utils";

export const useImageListInfo = (isHome) => {
  const { groupId, ct } = useListMatchParams();
  const { orderFormat } = useListQueryString("IMAGES");

  const [infoTitle, setInfoTitle] = useState("");
  const [infoStatus, setInfoStatus] = useState("");
  const [numOfHit, setNumOfHit] = useState(0);
  const [sortButtonTitle, setSortButtonTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");

  const location = useLocation();
  const queryParams = location.search;
  const { request: requestGetImagesInfo } = useAxios(
    URLJoin(BASE_URL, "images/info/", groupId, ct, queryParams),
    "get",
    {
      thenCallback: (res, resData) => {
        if (resData.status) {
          setInfoTitle("画像が見つかりませんでした。");
          setNumOfHit(0);
          setInfoStatus("not_found");
          setMetaTitle(isHome ? HOME_TITLE : "Not Found Image");
          if (!isHome)
            updateMeta({
              title: "Not Found Image",
              description: IMAGES_DESCRIPTION,
            });
          else updateMeta({ title: HOME_TITLE, description: "" });
        } else {
          setInfoTitle(resData.title);
          setNumOfHit(resData.numOfHit);
          setInfoStatus("success");
          setMetaTitle(isHome ? HOME_TITLE : resData.metaTitle);
          if (!isHome)
            updateMeta({
              title: `${resData.metaTitle}の画像・写真一覧`,
              description: IMAGES_DESCRIPTION,
            });
          else updateMeta({ title: HOME_TITLE, description: "" });
        }
      },
      finallyCallback: () => {
        gtagTo(location.pathname);
      },
    }
  );

  const convertSortButtonTitle = (orderFormat) => {
    switch (orderFormat) {
      case "recommend":
        return "おすすめ順";
      case "newer_post":
        return "新着順";
      case "older_post":
        return "古い順";
      case "popularity":
        return "人気順";
      case "dl":
        return "DL順";
      case "view":
        return "閲覧数順";
      default:
        return "";
    }
  };

  useEffect(() => {
    setSortButtonTitle(convertSortButtonTitle(orderFormat));
    requestGetImagesInfo();
    if (!isHome)
      updateMeta({
        title: `${metaTitle}の画像・写真一覧`,
        description: IMAGES_DESCRIPTION,
      });
    else updateMeta({ title: metaTitle, description: "" });
  }, [groupId, ct, orderFormat]);

  return { infoTitle, infoStatus, numOfHit, sortButtonTitle };
};
