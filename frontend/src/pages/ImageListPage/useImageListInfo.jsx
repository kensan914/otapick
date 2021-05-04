import { useState, useEffect } from "react";
import { useLocation } from "react-router";

import { BASE_URL, HOME_TITLE, IMAGES_DESCRIPTION } from "~/constants/env";
import { useAxios } from "~/hooks/useAxios";
import { useListMatchParams, useListQueryString } from "~/hooks/useList";
import { URLJoin } from "~/utils";
import { useMeta } from "~/hooks/useMeta";

export const useImageListInfo = (isHome) => {
  const { groupId, ct } = useListMatchParams();
  const { orderFormat } = useListQueryString("IMAGES");

  const [infoTitle, setInfoTitle] = useState("");
  const [infoStatus, setInfoStatus] = useState("");
  const [numOfHit, setNumOfHit] = useState(0);
  const [sortButtonTitle, setSortButtonTitle] = useState("");

  const location = useLocation();
  const queryParams = location.search;
  const { setMeta } = useMeta();
  const { request: requestGetImagesInfo } = useAxios(
    URLJoin(BASE_URL, "images/info/", groupId, ct, queryParams),
    "get",
    {
      thenCallback: (res, resData) => {
        if (resData.status) {
          setInfoTitle("画像が見つかりませんでした。");
          setNumOfHit(0);
          setInfoStatus("not_found");
          if (!isHome) {
            setMeta("Not Found Image", IMAGES_DESCRIPTION);
          } else {
            setMeta(HOME_TITLE, "");
          }
        } else {
          setInfoTitle(resData.title);
          setNumOfHit(resData.numOfHit);
          setInfoStatus("success");
          if (!isHome) {
            setMeta(`${resData.metaTitle}の画像・写真一覧`, IMAGES_DESCRIPTION);
          } else {
            setMeta(HOME_TITLE, "");
          }
        }
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
  }, [groupId, ct, orderFormat]);

  return { infoTitle, infoStatus, numOfHit, sortButtonTitle };
};
