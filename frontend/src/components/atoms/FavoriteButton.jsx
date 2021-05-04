import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import lottie from "lottie-web";

import { generateUuid4, isMobile, isSmp, URLJoin } from "~/utils";
import { BASE_URL, GROUPS } from "~/constants/env";
import { useAxios } from "~/hooks/useAxios";
import { useAuthState } from "~/contexts/AuthContext";
import { useDomDispatch } from "~/contexts/DomContext";
import { useCacheRoute } from "~/hooks/useCacheRoute";

export const useFavoriteButton = (
  groupId,
  blogCt,
  order,
  setIsFavorite,
  isFavorite,
  csrftoken,
  endWorkDropdownMenuMobile // optional
) => {
  const [lottieName] = useState(generateUuid4()); // 同じ画像であっても一意な値をつけたいためuuid

  const authState = useAuthState();
  const domDispatch = useDomDispatch();
  const { cacheRoute } = useCacheRoute();

  const isAnimating = useRef(false);

  const url = URLJoin(BASE_URL, "favorites/", groupId, blogCt, order);
  const { request: requestPutFavorite } = useAxios(url, "put", {
    thenCallback: () => {
      setIsFavorite(true);
    },
    catchCallback: (err) => {
      setIsFavorite(false);
      if (
        err.response.status === 409 &&
        err.response.data.status === "exceed_max_num"
      ) {
        goToAndStopNotFavorite(lottieName);
        endWorkDropdownMenuMobile && endWorkDropdownMenuMobile();
        domDispatch({
          type: "OPEN_GLOBAL_MODAL",
          globalModalId: "ExceedMaxFavoriteModal",
        });
      }

      if (err.response.status === 401) {
        // 未サインアップ・実際はリクエスト以前でcatchされるため呼ばれない
        setIsFavorite(false);
        goToAndStopNotFavorite(lottieName);
        endWorkDropdownMenuMobile && endWorkDropdownMenuMobile();
        domDispatch({
          type: "OPEN_GLOBAL_MODAL",
          globalModalId: "SignUpBeforeFavoriteModal",
        });
      }
    },
    token: authState.token,
    csrftoken: csrftoken,
  });
  const { request: requestDeleteFavorite } = useAxios(url, "delete", {
    thenCallback: () => {
      setIsFavorite(false);
    },
    catchCallback: () => {
      setIsFavorite(true);
    },
    token: authState.token,
    csrftoken: csrftoken,
  });

  const goToAndStopIsFavorite = (_lottieName) => {
    lottie.goToAndStop(1000, true, _lottieName);
  };

  const goToAndStopNotFavorite = (_lottieName) => {
    lottie.goToAndStop(0, true, _lottieName);
  };

  // didMount・画面遷移時、またはisFavoriteが変化した時にデザイン適用
  useEffect(() => {
    if (!cacheRoute) {
      // アニメーションを中断してデザイン変更してしまうのを防ぐ
      if (isFavorite) {
        if (!isAnimating.current) {
          goToAndStopIsFavorite(lottieName);
        }
      } else {
        goToAndStopNotFavorite(lottieName);
      }
    }
  }, [isFavorite, cacheRoute]);

  const onClickFavoriteButton = () => {
    // マイフォルダに追加
    if (!isFavorite) {
      lottie.play(lottieName);
      // 1秒間isAnimatingをtrueにして、アニメーション中断を防ぐ
      isAnimating.current = true;
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
      requestPutFavorite();
    }
    // マイフォルダから取り出す
    else {
      requestDeleteFavorite();
    }
  };

  return [onClickFavoriteButton, lottieName];
};

/**
 * propsのisShowMenu, cardHeightがundefinedの場合、image viewに切り替わる。
 */
const FavoriteButton = (props, ref) => {
  const {
    isFavorite,
    groupKey,
    lottieName,
    isShowMenu,
    cardHeight,
    type,

    onClickFavoriteButton,
  } = props;

  const animationContainerRef = useRef(null);

  // Init lottie
  let bookmarkAnimationData;
  Object.values(GROUPS).forEach((groupObj) => {
    if (groupObj.key === groupKey)
      bookmarkAnimationData = groupObj.bookmarkAnimationData;
  });
  useEffect(() => {
    if (animationContainerRef.current) {
      lottie.loadAnimation({
        container: animationContainerRef.current,
        animationData: bookmarkAnimationData,
        loop: false,
        autoplay: false,
        name: lottieName,
      });
      lottie.setSpeed(1.8, lottieName);
      if (isFavorite) lottie.goToAndStop(1000, true, lottieName);
    }
  }, []);

  const title = isFavorite
    ? "マイフォルダから削除する"
    : "マイフォルダに追加する";

  // image card(mobile)のmenu
  if (type === "image-card-detail-menu") {
    return (
      <Button
        className={`px-0 d-flex flex-row align-items-center image-card-detail-menu-favorite-button text-muted`}
        title={title}
        onClick={onClickFavoriteButton}
      >
        <div
          ref={animationContainerRef}
          className={`ml-1 mr-3 mb-0 ${
            isFavorite
              ? "lottie-favorite-shadow lottie-favorite-image-view image-card-detail-menu-favorite"
              : "lottie-favorite-image-view-deactive image-card-detail-menu-favorite"
          }`}
        />
        <b>{title}</b>
      </Button>
    );
  }
  // image view
  else if (type === "image-view") {
    return (
      <Button
        className={`rounded-circle p-0 image-view-favorite-button ${
          isMobile ? "mobile" : ""
        }`}
        title={title}
        onClick={onClickFavoriteButton}
      >
        <div
          ref={animationContainerRef}
          className={`${
            isFavorite
              ? "lottie-favorite-shadow lottie-favorite-image-view"
              : "lottie-favorite-image-view-deactive"
          }`}
        />
      </Button>
    );
  }
  // image card
  else if (type === "image-card") {
    // 画像ロード後に表示。また、menuが非表示でもお気に入り登録されていればアイコンのみ表示される。
    const isShowFavoriteButton = cardHeight > 0 && (isFavorite || isShowMenu);

    return (
      <Button
        className={`rounded-circle p-0 ${isSmp ? "smp" : ""} ${
          isShowMenu
            ? "image-card-favorite-button"
            : "image-card-favorite-button-transparent"
        }`}
        title={title}
        onClick={onClickFavoriteButton}
        style={{ display: isShowFavoriteButton ? "block" : "none" }}
      >
        <div
          ref={animationContainerRef}
          className={`${
            isFavorite
              ? "lottie-favorite-shadow lottie-favorite"
              : "lottie-favorite-deactive"
          }`}
        />
      </Button>
    );
  }
};

export default React.forwardRef(FavoriteButton);
