import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import lottie from "lottie-web";

import { checkNotCached, isMobile, URLJoin } from "../modules/utils";
import { withCookies } from "react-cookie";
import { BASE_URL, GROUPS } from "../modules/env";
import { useAxios } from "../modules/axios";
import { useAuthState } from "../contexts/AuthContext";
import { withRouter } from "react-router-dom";
import { useDomDispatch } from "../contexts/DomContext";

/**
 * propsのisShowMenu, cardHeightがundefinedの場合、image viewに切り替わる。
 */
const FavoriteButton = withCookies((props) => {
  const {
    groupID,
    blogCt,
    order,
    isFavorite,
    setIsFavorite,
    group,
    isShowMenu,
    cardHeight,
  } = props;

  const [lottieName] = useState(`favoritebutton-${groupID}-${blogCt}-${order}`);

  const animationContainer = useRef(null);
  const authState = useAuthState();
  const domDispatch = useDomDispatch();

  const url = URLJoin(BASE_URL, "favorites/", groupID, blogCt, order);
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
        domDispatch({
          type: "OPEN_GLOBAL_MODAL",
          globalModalId: "ExceedMaxFavoriteModal",
        });
      }
    },
    token: authState.token,
    csrftoken: props.cookies.get("csrftoken"),
  });
  const { request: requestDeleteFavorite } = useAxios(url, "delete", {
    thenCallback: () => {
      setIsFavorite(false);
    },
    catchCallback: () => {
      setIsFavorite(true);
    },
    token: authState.token,
    csrftoken: props.cookies.get("csrftoken"),
  });

  // Init lottie
  let bookmarkAnimationData;
  Object.values(GROUPS).forEach((groupObj) => {
    if (groupObj.key === group)
      bookmarkAnimationData = groupObj.bookmarkAnimationData;
  });
  useEffect(() => {
    lottie.loadAnimation({
      container: animationContainer.current,
      animationData: bookmarkAnimationData,
      loop: false,
      autoplay: false,
      name: lottieName,
    });
    lottie.setSpeed(1.8, lottieName);
  }, []);

  const goToAndStopIsFavorite = (_lottieName) => {
    lottie.goToAndStop(1000, true, _lottieName);
  };

  const goToAndStopNotFavorite = (_lottieName) => {
    lottie.goToAndStop(0, true, _lottieName);
  };

  const isAnimating = useRef(false);
  // didMount・画面遷移時、またはisFavoriteが変化した時にデザイン適用
  useEffect(() => {
    // アニメーションを中断してデザイン変更してしまうのを防ぐ
    if (isFavorite) {
      if (!isAnimating.current && checkNotCached(props)) {
        goToAndStopIsFavorite(lottieName);
      }
    } else {
      goToAndStopNotFavorite(lottieName);
    }
  }, [isFavorite, props.location]);

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

  // image view
  if (typeof isShowMenu === "undefined" && typeof cardHeight === "undefined") {
    return (
      <Button
        className={`rounded-circle p-0 image-view-favorite-button ${
          isMobile ? "mobile" : ""
        }`}
        title={
          isFavorite
            ? "この画像をマイフォルダから削除する"
            : "この画像をマイフォルダに追加する"
        }
        onClick={onClickFavoriteButton}
      >
        <div
          ref={animationContainer}
          className={`${
            isFavorite
              ? "lottie-favorite-shadow lottie-favorite-image-view"
              : "lottie-favorite-image-view-deactive"
          }`}
        />
      </Button>
    );
  }
  // image list
  else {
    // 画像ロード後に表示。また、menuが非表示でもお気に入り登録されていればアイコンのみ表示される。
    const isShowFavoriteButton = cardHeight > 0 && (isFavorite || isShowMenu);

    return (
      <Button
        className={`rounded-circle p-0 ${
          isShowMenu
            ? "image-card-favorite-button"
            : "image-card-favorite-button-transparent"
        }`}
        title={
          isFavorite
            ? "この画像をマイフォルダから削除する"
            : "この画像をマイフォルダに追加する"
        }
        onClick={onClickFavoriteButton}
        style={{ display: isShowFavoriteButton ? "block" : "none" }}
      >
        <div
          ref={animationContainer}
          className={`${
            isFavorite
              ? "lottie-favorite-shadow lottie-favorite"
              : "lottie-favorite-deactive"
          }`}
        />
      </Button>
    );
  }
});

export default withRouter(FavoriteButton);
