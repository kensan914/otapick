import React, { useEffect, useRef, useState } from "react";
import { HorizontalLoader } from "../../molecules/Loader";
import Masonry from "react-masonry-component";
import InfiniteScroll from "react-infinite-scroller";
import { URLJoin, generateRandomSeed, isMobile } from "../../modules/utils";
import { withRouter } from "react-router-dom";
import { NotFoundMessage } from "../../atoms/NotFound";
import { useDomDispatch } from "../../contexts/DomContext";
import { BOTTOM_ANCHOR_ADS_HEIGHT } from "../../modules/env";

const List = withRouter((props) => {
  const {
    hasMore,
    status,
    page,
    urlExcludePage,
    isLoading,
    request,
    topComponent,
    NotFoundComponent,
    children,
  } = props;
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
  };

  const masonryOptions = {
    itemSelector: ".grid-item",
    // transitionDuration: "0.1s",
    transitionDuration: 0,
    stagger: 0,
  };

  return (
    <>
      {topComponent}
      <InfiniteScroll
        hasMore={hasMore}
        loadMore={requestGetItems}
        initialLoad={false}
        loader={
          <div
            key={0}
            style={{ paddingBottom: isMobile ? BOTTOM_ANCHOR_ADS_HEIGHT : 0 }}
          >
            <HorizontalLoader />
          </div>
        }
        className="mb-5"
        threshold={500}
      >
        {status === "success" && (
          <Masonry options={masonryOptions} disableImagesLoaded={false}>
            {children}
          </Masonry>
        )}
        {status === "blog_not_found" && (
          <div>
            <NotFoundMessage type="blogFailed" margin={true} />
          </div>
        )}
        {status === "image_not_found" &&
          (typeof NotFoundComponent === "undefined" ? (
            <div>
              <NotFoundMessage type="imageFailed" margin={true} />
            </div>
          ) : (
            NotFoundComponent
          ))}
      </InfiniteScroll>
    </>
  );
});

export default List;

/**
 * list componentに必要なstate等を提供
 * @returns {Array} [items, appendItems, status, setStatus, hasMoreRef, pageRef, randomSeed]
 */
export const useListState = () => {
  const [items, setItems] = useState([]);
  const appendItems = (newItems) => {
    setItems([...items, ...newItems]);
    // setItems(items.concat(newItems));
  };

  const [status, setStatus] = useState("");
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const [randomSeed] = useState(generateRandomSeed());

  return [
    items,
    appendItems,
    status,
    setStatus,
    hasMoreRef,
    pageRef,
    randomSeed,
  ];
};
