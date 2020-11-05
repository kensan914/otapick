import React, { useEffect, useState } from "react";
import { HorizontalLoader } from "../../molecules/Loader";
import Masonry from "react-masonry-component";
import InfiniteScroll from "react-infinite-scroller";
import { URLJoin, generateRandomSeed } from "../../modules/utils";
import { withRouter } from "react-router-dom";
import { NotFoundMessage } from "../../atoms/NotFound";
import { useDomDispatch } from "../../contexts/DomContext";
import { useHistoryDispatch, useHistoryState, initListState } from "../../contexts/HistoryContext";


const List = withRouter((props) => {
  const { hasMore, status, page, urlExcludePage, isLoading, request, topComponent, children } = props;

  const domDispatch = useDomDispatch();

  useEffect(() => {
    if (!hasMore) {
      domDispatch({ type: "APPLY_SHOW_FOOTER", location: props.location });
    }
  }, [hasMore]);

  useEffect(() => {
    for (const elm of document.getElementsByClassName("adsbygoogle")) {
      if (!elm.classList.contains(props.location.key)) {
        elm.remove();
      }
    }
  }, [props.location]);

  const requestGetItems = () => {
    if (hasMore && !isLoading) {
      request({ url: URLJoin(urlExcludePage, `?page=${page}`) });
    }
  }

  const masonryOptions = {
    itemSelector: ".grid-item",
    // transitionDuration: "0.1s",
    transitionDuration: 0,
    stagger: 0
  };

  return (
    <>
      {topComponent}
      <InfiniteScroll
        hasMore={hasMore}
        loadMore={requestGetItems}
        initialLoad={false}
        loader={<HorizontalLoader key={0} />}
        className="mb-5"
      >
        {status === "success" &&
          <Masonry
            options={masonryOptions}
            disableImagesLoaded={false}
          // updateOnEachImageLoad={true}
          >
            {children}
          </Masonry>
        }
        {status === "blog_not_found" &&
          <div><NotFoundMessage type="blogFailed" margin={true} /></div>
        }
        {(status === "image_not_found") &&
          <div><NotFoundMessage type="imageFailed" margin={true} /></div>
        }
      </InfiniteScroll >
    </>
  );
});


export default List;


/**
 * list componentに必要なstateを提供。useAxios()呼び出し以前に実行する。
 * @param {string} locationKey
 * @param {func} generateUrlExcludePage randomSeedを引数にとり、urlExcludePageを生成する関数。
 */
export const useListState = (locationKey, generateUrlExcludePage) => {
  const historyState = useHistoryState();
  const historyDispatch = useHistoryDispatch();

  const isExistListState = Boolean(historyState.listStates[locationKey]);

  const [urlExcludePage, setUrlExcludePage] = useState();
  useEffect(() => {
    if (!isExistListState) {
      const randomSeed = generateRandomSeed();
      setUrlExcludePage(generateUrlExcludePage(randomSeed));
      historyDispatch({ type: "INIT_LIST_STATE", locationKey: locationKey, randomSeed: randomSeed });
    } else {
      setUrlExcludePage(generateUrlExcludePage(historyState.listStates[locationKey].randomSeed));
    }
  }, [locationKey]);

  const items = isExistListState ? historyState.listStates[locationKey].items : initListState.items;
  const hasMore = isExistListState ? historyState.listStates[locationKey].hasMore : initListState.hasMore;
  const status = isExistListState ? historyState.listStates[locationKey].status : initListState.status;
  const page = isExistListState ? historyState.listStates[locationKey].page : initListState.page;

  return [items, hasMore, status, page, urlExcludePage];
};


/**
 * list componentにおけるpage=1のリクエストを担当。useAxios()呼び出し後に実行し、生成したrequestを引数に渡す。
 * @param {string} locationKey
 * @param {string} request useAxios()により生成したrequest関数。
 * @param {string} urlExcludePage pageクエリパラメータを除外したitemsのGETリクエストURL。このstateが変化した時、requestが実行される。
 */
export const useListDidMountRequest = (locationKey, request, urlExcludePage) => {
  const historyState = useHistoryState();

  useEffect(() => {
    if (urlExcludePage) {
      if (!historyState.listStates[locationKey] || historyState.listStates[locationKey].items.length <= 0) {
        request();
      }
    }
  }, [urlExcludePage]);
}