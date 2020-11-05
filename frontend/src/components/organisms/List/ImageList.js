import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { URLJoin, getGroup, isMobile } from "../../modules/utils";
import { BASE_URL, ADS_INTERVAL, ADS_INDEX } from "../../modules/env";
import ImageCard from "../../molecules/ImageCard";
import { SquareAds } from "../../atoms/Adsense";
import { useAxios } from "../../modules/axios";
import List, { useListDidMountRequest, useListState } from "./List";
import { useHistoryDispatch } from "../../contexts/HistoryContext";
import { getImageUrlComposition } from "../../templates/ImageListTemplate";


const ImageList = (props) => {
  const { topComponent } = props;

  return (
    <ImageListModel {...props} render={(hasMore, status, page, urlExcludePage, isLoading, request, items, isShowTopComponent, isFluid, isExcludeAds) => {
      return (
        <List hasMore={hasMore} status={status} page={page} urlExcludePage={urlExcludePage} isLoading={isLoading} request={request}
          topComponent={(isShowTopComponent && status === "success") && topComponent}>
          {items.map(({ groupID, blogCt, blogTitle, src, url, blogUrl, officialUrl, writer }, i) => {
            const gridItemClassName = "grid-item " +
              (isFluid
                ? "col-6 col-md-4 col-lg-3 col-xl-2 px-1 px-sm-2 " + (isMobile ? "my-1 " : "my-3 ")
                : "col-6 col-md-4 col-lg-3 px-1 px-sm-2 " + (isMobile ? "my-1 " : "my-3 "));
            return (
              <div key={i}>
                <div className={gridItemClassName}>
                  <ImageCard id={i} groupID={groupID} group={getGroup(groupID)} blogCt={blogCt} blogTitle={blogTitle}
                    src={src} url={url} blogUrl={blogUrl} officialUrl={officialUrl} writer={writer} />
                </div>

                {(!isExcludeAds && i % ADS_INTERVAL === ADS_INDEX) &&
                  <div className={gridItemClassName + (isMobile ? "mb-4" : "")} >
                    <SquareAds />
                  </div>
                }
              </div>
            )
          })}
        </List>
      );
    }} />
  );
}


export default ImageList;


/**
 * ↓↓↓ unrequire params ↓↓↓
 * @param {string} type ["RELATED_IMAGES"] 通常のimage listの場合、不必要。それ以外でimage list を使う際に指定する。
 * @param {component} topComponent listの上部に表示させる
 */
export const ImageListModel = withRouter((props) => {
  const { type, render } = props;

  //---------- typeごとに異なる処理はここに記述 ----------//
  let urlExcludeQparams;
  let isFluid = false;  // container-fluidを指定している
  let isExcludeAds = false;  // list内にAdsを表示していない
  switch (type) {
    case "RELATED_IMAGES":
      urlExcludeQparams = URLJoin(BASE_URL, "relatedImages/",
        props.match.params.groupID,
        props.match.params.blogCt,
        props.match.params.order,
      );
      isFluid = true;
      isExcludeAds = true;
      break;

    case "HOME":
      urlExcludeQparams = URLJoin(BASE_URL, "home/");
      break;

    default:
      urlExcludeQparams = URLJoin(BASE_URL, "images/",
        props.match.params.groupID,
        props.match.params.ct,
      );
      break;
  }
  //----------------------------------------------------//

  const [items, hasMore, status, page, urlExcludePage] = useListState(props.location.key,
    (randomSeed) => {
      const { orderFormat } = getImageUrlComposition(props);

      return (
        URLJoin(
          urlExcludeQparams,
          orderFormat && `?sort=${orderFormat}`,
          randomSeed && `?random_seed=${randomSeed}`
        )
      );
    }
  );
  const [isShowTopComponent, setIsShowTopComponent] = useState(false);
  const historyDispatch = useHistoryDispatch();

  const { isLoading, resData, request } = useAxios(
    URLJoin(urlExcludePage, `?page=${page}`),
    "get",
    {
      thenCallback: res => {
        if (res.data.length > 0) {
          const newImages = res.data.map((item, index) =>
            ({
              groupID: item.blog.group_id,
              blogCt: item.blog.blog_ct,
              blogTitle: item.blog.title,
              src: item.image.src,
              url: item.image.url,
              blogUrl: item.blog.url,
              officialUrl: item.blog.official_url,
              writer: item.blog.writer,
            })
          );
          historyDispatch({ type: "APPEND_LIST_ITEMS", locationKey: props.location.key, items: newImages });

          historyDispatch({ type: "SET_LIST_STATUS", locationKey: props.location.key, status: "success" });
          if (res.data.length < 20) {
            historyDispatch({ type: "SET_LIST_HAS_MORE", locationKey: props.location.key, hasMore: false });
          }
        } else {
          if (page == 1) {
            historyDispatch({ type: "SET_LIST_HAS_MORE", locationKey: props.location.key, hasMore: false });
            historyDispatch({ type: "SET_LIST_STATUS", locationKey: props.location.key, status: "image_not_found" });
          } else {
            historyDispatch({ type: "SET_LIST_HAS_MORE", locationKey: props.location.key, hasMore: false });
          }
        }

        // relatedImageTitle表示
        setIsShowTopComponent && setIsShowTopComponent(true);
      },
      errorCallback: err => {
        if (err.response.status === 404) {
          historyDispatch({ type: "SET_LIST_HAS_MORE", locationKey: props.location.key, hasMore: false });
          historyDispatch({ type: "SET_LIST_STATUS", locationKey: props.location.key, status: "image_not_found" });
        }
      },
      finallyCallback: () => {
        historyDispatch({ type: "INCREMENT_LIST_PAGE", locationKey: props.location.key })
      },
      didRequestCallback: r => console.info(r),
    },
  );

  useListDidMountRequest(props.location.key, request, urlExcludePage);

  return (
    render(hasMore, status, page, urlExcludePage, isLoading, request, items, isShowTopComponent, isFluid, isExcludeAds)
  );
});