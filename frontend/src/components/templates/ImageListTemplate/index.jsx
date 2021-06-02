import React from "react";

import ImageList from "~/components/templates/ImageListTemplate/organisms/ImageList";
import Headline from "~/components/molecules/Headline";
import { isMobile } from "~/utils";
import { ImageListInfo } from "~/components/templates/ImageListTemplate/organisms/ImageListInfo";

export const ImageListTemplate = (props) => {
  const {
    groupId,
    ct,
    groupKey,
    pushHistoryList,
    infoTitle,
    infoStatus,
    numOfHit,
    sortButtonTitle,
  } = props;

  return (
    <div className="container mt-3 text-muted">
      <Headline
        title="画像一覧"
        type="images"
        mode={groupKey ? groupKey : "recommend"}
        groupID={groupId}
        ct={ct}
      />

      <ImageListInfo
        groupKey={groupKey}
        hide={
          typeof groupId === "undefined" && typeof ct === "undefined"
            ? true
            : false
        }
        pushHistoryList={pushHistoryList}
        infoTitle={infoTitle}
        infoStatus={infoStatus}
        numOfHit={numOfHit}
        sortButtonTitle={sortButtonTitle}
      />

      {typeof groupId === "undefined" &&
        typeof ct === "undefined" &&
        !isMobile && <div className="py-2"></div>}

      <ImageList />
    </div>
  );
};
