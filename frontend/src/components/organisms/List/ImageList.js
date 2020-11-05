import React, { forwardRef, useImperativeHandle, useState } from "react";
import { URLJoin, getGroup, isMobile } from "../../modules/utils";
import { BASE_URL, ADS_INTERVAL, ADS_INDEX } from "../../modules/env";
import ImageCard from "../../molecules/ImageCard";
import { SquareAds } from "../../atoms/Adsense";
import { useAxios } from "../../modules/axios";
import List, { useList } from "./List";


const ImageList = (props) => {
  const { keepAliveName, topComponent } = props;

  return (
    <ImageListModel {...props} render={(hasMore, status, page, urlExcludePage, isLoading, request, items, isShowTopComponent, isFluid, isExcludeAds) => {
      return (
        <List keepAliveName={keepAliveName} hasMore={hasMore} status={status} page={page} urlExcludePage={urlExcludePage} isLoading={isLoading} request={request}
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
 * ↓↓↓ require params ↓↓↓
 * @param {string} groupID
 * @param {string} keepAliveName
 * 
 * ↓↓↓ require params ↓↓↓
 * @param {string} ct 通常のimage list
 * @param {string} blogCt related image list
 * @param {string} order related image list
 * @param {string} orderFormat
 * @param {string} type ["RELATED_IMAGES"] 通常のimage listの場合、不必要。それ以外でimage list を使う際に指定する。
 * @param {component} topComponent listの上部に表示させる
 * 
 * 親コンポーネントからstate(page等々)を取得したい場合、useImperativeHandleにてゲッターを設定し、ref.current.[ゲッター]で取得する。
 */
export const ImageListModel = forwardRef((props, ref) => {
  const { groupID, ct, blogCt, order, orderFormat, type, render } = props;

  const [randomSeed, items, setItems, hasMore, setHasMore, status, setStatus, page, incrPage] = useList();
  const [isShowTopComponent, setIsShowTopComponent] = useState(false);

  //---------- typeごとに異なる処理はここに記述 ----------//
  let urlExcludeQparams;
  let isFluid = false;  // container-fluidを指定している
  let isExcludeAds = false;  // list内にAdsを表示していない
  switch (type) {
    case "RELATED_IMAGES":
      urlExcludeQparams = URLJoin(BASE_URL, "relatedImages/", groupID, blogCt, order.toString());
      isFluid = true;
      isExcludeAds = true;
      break;

    case "HOME":
      urlExcludeQparams = URLJoin(BASE_URL, "home/");
      break;

    default:
      urlExcludeQparams = URLJoin(BASE_URL, "images/", groupID, ct);
      break;
  }
  //----------------------------------------------------//

  const urlExcludePage = URLJoin(urlExcludeQparams, randomSeed && `?random_seed=${randomSeed}`, orderFormat && `?sort=${orderFormat}`);

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
          setItems(items.concat(newImages));
          setStatus("success");
          if (res.data.length < 20) {
            setHasMore(false);
          }
        } else {
          if (page == 1) {
            setHasMore(false);
            setStatus("image_not_found");
          } else setHasMore(false);
        }

        // relatedImageTitle表示
        setIsShowTopComponent && setIsShowTopComponent(true);
      },
      errorCallback: err => {
        if (err.response.status === 404) {
          setHasMore(false);
          setStatus("image_not_found");
        }
      },
      finallyCallback: () => {
        incrPage();
      },
      didRequestCallback: r => console.info(r),
      didMountRequest: true,
    },
  );

  useImperativeHandle(ref, () => ({
    getCurrentPage: () => page,
  }));

  return (
    render(hasMore, status, page, urlExcludePage, isLoading, request, items, isShowTopComponent, isFluid, isExcludeAds)
  );
});