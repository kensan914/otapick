import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { URLJoin, getGroup, isMobile, isSmp } from "~/utils";
import { BASE_URL } from "~/constants/env";
import ImageCard from "~/components/molecules/ImageCard";
import { useAxios } from "~/hooks/useAxios";
import List, { useListState } from "~/components/organisms/List";
import { useAuthState } from "~/contexts/AuthContext";
import { NotFoundMessage } from "~/components/atoms/NotFound";
import { useProfileState } from "~/contexts/ProfileContext";
import { useListMatchParams, useListQueryString } from "~/hooks/useList";
import { useViewMatchParams } from "~/hooks/useView";

const ImageList = (props) => {
  const { topComponent } = props;

  const profileState = useProfileState();
  return (
    <ImageListModel
      {...props}
      additionalQParams={
        profileState?.profile?.favGroups
          ? [
              "?groups=",
              profileState.profile.favGroups.map((group) => group.groupId),
            ]
          : []
      }
      render={(
        hasMore,
        status,
        page,
        urlExcludePage,
        isLoading,
        request,
        items,
        isShowTopComponent,
        isFluid,
        isExcludeAds,
        NotFoundComponent
      ) => {
        return (
          <List
            hasMore={hasMore}
            status={status}
            page={page}
            urlExcludePage={urlExcludePage}
            isLoading={isLoading}
            request={request}
            topComponent={
              isShowTopComponent && status === "success" && topComponent
            }
            NotFoundComponent={NotFoundComponent}
          >
            {items.map(
              (
                {
                  groupID,
                  blogCt,
                  blogTitle,
                  src,
                  url,
                  blogUrl,
                  officialUrl,
                  writer,
                  order,
                  isFavorite,
                  width,
                  height,
                },
                i
              ) => {
                const gridItemClassName =
                  "grid-item " +
                  (isFluid
                    ? "col-6 col-md-4 col-lg-3 col-xl-2 px-1 px-sm-2 " +
                      (isMobile ? "my-1 " : "my-3 ")
                    : "col-6 col-md-4 col-lg-3 px-1 px-sm-2 " +
                      (isMobile ? "my-1 " : "my-3 "));
                return (
                  <div key={i}>
                    <div className={gridItemClassName}>
                      <ImageCard
                        id={i}
                        groupId={groupID}
                        groupKey={getGroup(groupID)}
                        blogCt={blogCt}
                        blogTitle={blogTitle}
                        srcCollection={src}
                        urlPath={url}
                        blogUrl={blogUrl}
                        officialUrl={officialUrl}
                        writer={writer}
                        order={order}
                        initIsFavorite={isFavorite}
                        width={width}
                        height={height}
                      />
                    </div>

                    {/* {!isExcludeAds && i % ADS_INTERVAL === ADS_INDEX && (
                      <div
                        className={gridItemClassName + (isMobile ? "mb-4" : "")}
                      >
                        <SquareAds />
                      </div>
                    )} */}
                  </div>
                );
              }
            )}
          </List>
        );
      }}
    />
  );
};

export default ImageList;

/**
 * ↓↓↓ unrequire params ↓↓↓
 * @param {function} render
 * @param {string} type ["RELATED_IMAGES", "FAVORITE_IMAGES", "HOME"] 通常のimage listの場合、不必要。それ以外でimage list を使う際に指定する。
 * @param {any[]} additionalQParams optional. 追加のクエリパラメータをリスト形式で指定. URLJoin(url, ...additionalQParams).
 */
export const ImageListModel = withRouter((props) => {
  const { type, render, additionalQParams } = props;

  const { groupId, blogCt, order } = useViewMatchParams();
  const { ct } = useListMatchParams();
  const { orderFormat } = useListQueryString("IMAGES");

  //---------- typeごとに異なる処理はここに記述 ----------//
  let urlExcludeQparams;
  let isFluid = false; // container-fluidを指定している
  let isExcludeAds = false; // list内にAdsを表示していない
  let NotFoundComponent; // 画像が見つからなかった時に表示されるNotFoundComponentを上書き。
  switch (type) {
    // required props: {groupID, blogCt, order}
    case "RELATED_IMAGES":
      urlExcludeQparams = URLJoin(
        BASE_URL,
        "relatedImages/",
        groupId,
        blogCt,
        order
      );
      isFluid = true;
      isExcludeAds = true;
      break;

    case "FAVORITE_IMAGES":
      urlExcludeQparams = URLJoin(BASE_URL, "favorites/");
      isFluid = true;
      isExcludeAds = true;
      NotFoundComponent = (
        <div className={isSmp ? "mx-1" : "mx-3"}>
          <NotFoundMessage type="favoriteImage" margin={true} />
        </div>
      );
      break;

    case "HOME":
      urlExcludeQparams = URLJoin(BASE_URL, "home/");
      break;

    // required props: {groupID, ct}
    default:
      urlExcludeQparams = URLJoin(BASE_URL, "images/", groupId, ct);
      break;
  }
  //----------------------------------------------------//

  const [
    items,
    appendItems,
    status,
    setStatus,
    hasMoreRef,
    pageRef,
    randomSeed,
  ] = useListState();
  const urlExcludePage = URLJoin(
    urlExcludeQparams,
    orderFormat && `?sort=${orderFormat}`,
    randomSeed && `?random_seed=${randomSeed}`,
    ...(additionalQParams ? additionalQParams : [])
  );

  const [isShowTopComponent, setIsShowTopComponent] = useState(false);
  const authState = useAuthState();

  const { isLoading, request } = useAxios(
    URLJoin(urlExcludePage, `?page=${pageRef.current}`),
    "get",
    {
      thenCallback: (res) => {
        if (res.data.length > 0) {
          const newImages = res.data.map((item) => ({
            groupID: item.blog.group_id,
            blogCt: item.blog.blog_ct,
            blogTitle: item.blog.title,
            src: item.image.src,
            url: item.image.url,
            blogUrl: item.blog.url,
            officialUrl: item.blog.official_url,
            writer: item.blog.writer,
            order: item.image.order,
            isFavorite: item.image.is_favorite,
            width: item.image.width,
            height: item.image.height,
          }));
          appendItems(newImages);
          setStatus("success");
          if (res.data.length < 20) {
            hasMoreRef.current = false;
          }
        } else {
          if (pageRef.current == 1) {
            hasMoreRef.current = false;
            setStatus("image_not_found");
          } else {
            hasMoreRef.current = false;
          }
        }

        // relatedImageTitle表示
        setIsShowTopComponent && setIsShowTopComponent(true);
      },
      catchCallback: (err) => {
        if (err.response.status === 404) {
          hasMoreRef.current = false;
          setStatus("image_not_found");
        }
      },
      finallyCallback: () => {
        pageRef.current++;
      },
      didRequestCallback: (r) => {
        // console.info(r);
      },
      shouldRequestDidMount: true,
      token: authState.token,
    }
  );

  return render(
    hasMoreRef.current,
    status,
    pageRef.current,
    urlExcludePage,
    isLoading,
    request,
    items,
    isShowTopComponent,
    isFluid,
    isExcludeAds,
    NotFoundComponent
  );
});
