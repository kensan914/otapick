import React, { useEffect, useRef, useState } from "react";
import { isMobile, watchCurrentPosition } from "../../modules/utils";
import {
  SUB_NAVBAR_HEIGHT,
  NAVBAR_HEIGHT,
  BOTTOM_NAVBAR_HEIGHT,
  TOTOP_BUTTON_M,
} from "../../modules/env";
import { withRouter } from "react-router-dom";
import { useDomState } from "../../contexts/DomContext";

/**
 * scrollState(isShowNBShadow, isShowNB, isShowSubNB, isTop)の管理。
 * scrollHandler等のイベント定義
 * navbar, subnavbar shadow付与
 * navbar, subnavbar show, hide制御
 * PCでのsubnavbar の挙動
 *
 * 注：scrollStateに忠実に従いスクロールに伴うコンポーネントの表示・非表示の責務を持つ。
 * したがって、「特定の場合に限りscrollStateに反して非表示にする」などをするべきではない。（現状そのような分岐はutils.js/watchCurrentPositionに記述）
 */
const ScrollAdmin = (props) => {
  const [isShowNBShadow, setIsShowNBShadow] = useState(false);
  const [isShowNB, setIsShowNB] = useState(true);
  const [isShowSubNB, setIsShowSubNB] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const scrollPos = useRef(0);

  const setStateList = (_stateList) => {
    "isShowNBShadow" in _stateList &&
      setIsShowNBShadow(_stateList.isShowNBShadow);
    "isShowNB" in _stateList && setIsShowNB(_stateList.isShowNB);
    "isShowSubNB" in _stateList && setIsShowSubNB(_stateList.isShowSubNB);
    "isTop" in _stateList && setIsTop(_stateList.isTop);
  };

  /** scrollHandler。スクロールごとに呼ばれスクロール関連のstateを一括更新。
   *  ex) stateList = { isShowNBShadow: null, isShowNB: null, isShowSubNB: null, isTop: null }
   **/
  const scrollHandler = () => {
    const result = watchCurrentPosition(scrollPos.current);
    // stateListのvalueが一つでもnullの場合、stateListは変更しない(window以外のスクロール時)
    const resultValues = Object.values(result.stateList);
    if (resultValues.findIndex((val) => val === null) === -1) {
      setStateList({ ...result.stateList });
    }
    scrollPos.current = result.scrollPos;
  };

  const beforeunloadHandler = () => window.scrollTo(0, 0);

  const domState = useDomState();
  useEffect(() => {
    window.addEventListener("scroll", scrollHandler, true);
    window.addEventListener("beforeunload", beforeunloadHandler, true);

    if (!isMobile) {
      if (isShowSubNB) {
        exeShowSub();
      } else {
        exeHideSub();
      }
    }

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("beforeunload", beforeunloadHandler);
    };
  }, []);

  useEffect(() => {
    if (isShowNBShadow) {
      exeAddShadow();
    } else {
      exeRemoveShadow();
    }
  }, [isShowNBShadow, props.location]);

  useEffect(() => {
    if (isShowNB) {
      exeShow();
    } else {
      exeHide();
    }
  }, [isShowNB, props.location]);

  useEffect(() => {
    if (!isMobile) {
      if (isShowSubNB) {
        exeShowSub();
      } else {
        exeHideSub();
      }
    }
  }, [isShowSubNB, props.location, Object.keys(domState.subNavbarRefs).length]);

  useEffect(() => {
    if (isTop) {
      exeHideToTop();
    } else {
      exeShowToTop();
    }
  }, [isTop, props.location]);

  useEffect(() => {
    scrollHandler();
  }, [props.location]);

  const exeSuper = (subNavbarExistFunc, subNavbarNullFunc) => {
    // cache導入によりotapick-sub-navbarが複数存在しうるため、domStateにsubNavbarRefのコレクションで管理
    const subNavbarRef = domState.subNavbarRefs[props.location.key];
    const subNavbar = subNavbarRef ? subNavbarRef.current : null;

    const navbar = document.getElementById("otapick-navbar");
    const bottomNavbar = document.getElementById("otapick-bottom-navbar");
    const toTopButton = document.getElementById("otapick-totop-button");

    // navbar and subNavbar
    if (subNavbar !== null && navbar !== null) {
      subNavbarExistFunc(subNavbar, navbar, bottomNavbar, toTopButton);
    }
    // only navbar
    else {
      subNavbarNullFunc(navbar, bottomNavbar, toTopButton);
    }
  };

  const addShadow = (elm, transition) => {
    elm.style.transition = transition + "s";
    elm.classList.add("shadow");
  };

  const removeShadow = (elm, transition) => {
    elm.style.transition = transition + "s";
    elm.classList.remove("shadow");
  };

  const show = (elm, isNavbar) => {
    elm.style.transitionTimingFunction = "ease-out";
    if (isNavbar) {
      elm.style.transition = "0.3s";
      elm.style.top = 0 + "px";
    } else {
      elm.style.transition = "0.35s";
      elm.style.top = NAVBAR_HEIGHT + "px";
    }
  };

  const hide = (elm, isNavbar) => {
    elm.style.transitionTimingFunction = "ease-out";
    if (isNavbar) {
      elm.style.transition = "0.35s";
      elm.style.top = "-" + NAVBAR_HEIGHT + "px";
    } else {
      elm.style.transition = "0.3s";
      elm.style.top = "-" + SUB_NAVBAR_HEIGHT + "px";
    }
  };

  const showBottom = (btm, totop) => {
    if (btm !== null) {
      btm.style.transitionTimingFunction = "ease-out";
      btm.style.transition = "0.3s";
      btm.style.bottom = 0 + "px";
    }
    if (totop !== null) {
      totop.style.transitionTimingFunction = "ease-out";
      totop.style.transition = "0.3s";
      totop.style.bottom = isMobile
        ? TOTOP_BUTTON_M + BOTTOM_NAVBAR_HEIGHT
        : TOTOP_BUTTON_M + "px";
    }
  };

  const hideBottom = (btm, totop) => {
    if (btm !== null) {
      btm.style.transitionTimingFunction = "ease-out";
      btm.style.transition = "0.3s";
      btm.style.bottom = "-" + BOTTOM_NAVBAR_HEIGHT + "px";
    }
    if (totop !== null) {
      totop.style.transitionTimingFunction = "ease-out";
      totop.style.transition = "0.3s";
      totop.style.bottom = TOTOP_BUTTON_M + "px";
    }
  };

  const hideSub = (elm) => {
    elm.style.transition = "0.1s";
    elm.style.transitionTimingFunction = "ease-out";
    elm.style.top = NAVBAR_HEIGHT - SUB_NAVBAR_HEIGHT + "px";
  };

  const showToTop = (elm) => {
    if (elm !== null) {
      elm.classList.remove("hide");
      elm.classList.add("show");
    }
  };

  const hideToTop = (elm) => {
    if (elm !== null) {
      elm.classList.remove("show");
      elm.classList.add("hide");
    }
  };

  const exeAddShadow = () => {
    exeSuper(
      (sub, nav) => {
        addShadow(sub, 0.3);
        removeShadow(nav, 0);
      },
      (nav) => {
        addShadow(nav, 0.3);
      }
    );
  };

  const exeRemoveShadow = () => {
    exeSuper(
      (sub, nav) => {
        removeShadow(sub, 0);
        removeShadow(nav, 0);
      },
      (nav) => removeShadow(nav, 0)
    );
  };

  const exeShow = () => {
    exeSuper(
      (sub, nav, btm, totop) => {
        show(sub, false);
        show(nav, true);
        showBottom(btm, totop);
      },
      (nav, btm, totop) => {
        show(nav, true);
        showBottom(btm, totop);
      }
    );
  };

  const exeHide = () => {
    exeSuper(
      (sub, nav, btm, totop) => {
        hide(sub, false);
        hide(nav, true);
        hideBottom(btm, totop);
      },
      (nav, btm, totop) => {
        hide(nav, true);
        hideBottom(btm, totop);
      }
    );
  };

  const exeShowSub = () => {
    exeSuper(
      (sub) => {
        show(sub, false);
      },
      () => {
        return;
      }
    );
  };

  const exeHideSub = () => {
    exeSuper(
      (sub) => {
        hideSub(sub);
      },
      () => {
        return;
      }
    );
  };

  const exeShowToTop = () => {
    exeSuper(
      (sub, nav, btm, totop) => {
        showToTop(totop);
      },
      (sub, nav, totop) => {
        showToTop(totop);
      }
    );
  };

  const exeHideToTop = () => {
    exeSuper(
      (sub, nav, btm, totop) => {
        hideToTop(totop);
      },
      (sub, nav, totop) => {
        hideToTop(totop);
      }
    );
  };

  return props.children;
};

// export default withRouter(ScrollAdmin);
export default withRouter((props) => <ScrollAdmin {...props} />);
