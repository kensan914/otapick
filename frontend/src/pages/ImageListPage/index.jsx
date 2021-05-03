import React from "react";

import ImageListTemplate from "~/components/templates/ImageListTemplate";
import { useImageListInfo } from "~/pages/ImageListPage/useImageListInfo";
import {
  useListMatchParams,
  useListQueryString,
  usePushHistoryList,
} from "~/hooks/useList";

const ImageListPage = () => {
  const { groupId, ct, groupKey } = useListMatchParams();
  const { orderFormat } = useListQueryString("IMAGES");

  const pushHistoryList = usePushHistoryList();

  const {
    infoTitle,
    infoStatus,
    numOfHit,
    sortButtonTitle,
  } = useImageListInfo();

  return (
    <ImageListTemplate
      groupId={groupId}
      ct={ct}
      groupKey={groupKey}
      orderFormat={orderFormat}
      pushHistoryList={pushHistoryList}
      infoTitle={infoTitle}
      infoStatus={infoStatus}
      numOfHit={numOfHit}
      sortButtonTitle={sortButtonTitle}
    />
  );
};

export default ImageListPage;
