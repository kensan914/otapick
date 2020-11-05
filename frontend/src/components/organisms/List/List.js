import React, { useEffect, useRef, useState } from "react";
import { HorizontalLoader } from "../../molecules/Loader";
import Masonry from "react-masonry-component";
import InfiniteScroll from "react-infinite-scroller";
import { URLJoin, generateRandomSeed, generateKeepAliveName } from "../../modules/utils";
import { withRouter } from "react-router-dom";
import { NotFoundMessage } from "../../atoms/NotFound";
import { useDomDispatch } from "../../contexts/DomContext";


const List = withRouter((props) => {
  const { hasMore, status, page, urlExcludePage, isLoading, request, topComponent, children, keepAliveName } = props;

  const domDispatch = useDomDispatch();

  useEffect(() => {
    // KeepAliveにより、UnMountされずにDOM上に保存されているコンポーネントは、裏でcomponentDidUpdateが常に働いているため、
    // このようにそのページのlocation.keyと照合して適切に実行制限をかけてあげる必要がある。
    if (keepAliveName === generateKeepAliveName(props.location.key)) {
      if (!hasMore) {
        domDispatch({ type: "APPLY_SHOW_FOOTER", location: props.location });
      }
    }
  }, [hasMore]);

  useEffect(() => {
    for (const elm of document.getElementsByClassName("adsbygoogle")) {
      if (!elm.classList.contains(generateKeepAliveName(props.location.key))) {
        elm.remove();
      }
    }
  }, [props.location]);

  const requestGetItems = () => {
    // TODO(TODOで検索): ブラウザバックなどでkeepaliveを使用し、描画すると再レンダー（断言はできないが）して一時的にheightが縮まることでここが呼ばれrequestされてしまう。 
    console.log("fff");
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
          <Masonry options={masonryOptions}>
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
 * list componentに必要なstateを提供
 */
export const useList = () => {
  const [randomSeed] = useState(generateRandomSeed());
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState("");
  const page = useRef(1);
  const incrPage = () => page.current++;

  return [randomSeed, items, setItems, hasMore, setHasMore, status, setStatus, page.current, incrPage];
};