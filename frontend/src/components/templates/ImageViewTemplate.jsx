import React from "react";
import { isMobile, isSmp } from "../modules/utils";
import ImageView from "../organisms/ImageView";
import ImageList from "../organisms/List/ImageList";
import BackButton from "../atoms/BackButton";
import Headline from "../molecules/Headline";
import { SquareAds, LandscapeAds } from "../atoms/Adsense";

const ImageViewTemplate = (props) => {
  const {
    groupId,
    blogCt,
    order,
    groupKey,
    imageId,
    images,
    blog,
    status,
    isReadyView,
    requestPutDownloadOnlyMobile,
    incrementNumOfDownloads,
    prevSrcCollection,
  } = props;

  return (
    <>
      {isMobile && <Headline title={`画像詳細`} />}
      {!isMobile && <BackButton fixed={true} className="in-image-view" />}

      <ImageView
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

      {/* Google AdSense */}
      <div className="container mt-4">
        {isSmp ? <SquareAds /> : <LandscapeAds height="100px" />}
      </div>

      <div className="container-fluid text-muted mt-3 list-container-fluid">
        <ImageList
          type="RELATED_IMAGES"
          topComponent={
            <h3
              className={
                "text-center related-image-title " + (isSmp ? "mt-2" : "")
              }
            >
              関連画像
            </h3>
          }
        />
      </div>
    </>
  );
};

export default ImageViewTemplate;
