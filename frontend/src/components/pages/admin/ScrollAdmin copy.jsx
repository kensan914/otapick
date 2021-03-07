import React from "react";
import { isMobile, watchCurrentPosition } from "../../modules/utils";
import {
  SUB_NAVBAR_HEIGHT,
  NAVBAR_HEIGHT,
  BOTTOM_NAVBAR_HEIGHT,
  TOTOP_BUTTON_M,
} from "../../modules/env";
import { withRouter } from "react-router-dom";
import { DomStateContext } from "../../contexts/DomContext";

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
class ScrollAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.initScrollStates = {
      isShowNBShadow: false,
      isShowNB: true,
      isShowSubNB: false,
      isTop: true,
    };
    Object.freeze(this.initScrollStates);

    this.state = {
      ...this.initScrollStates,
    };
    this.scrollPos = 0;
  }

  /** scrollHandler。スクロールごとに呼ばれスクロール関連のstateを一括更新。
   *  ex) stateList = { isShowNBShadow: null, isShowNB: null, isShowSubNB: null, isTop: null }
   **/
  scrollHandler = (e) => {
    const result = watchCurrentPosition(this.scrollPos);
    console.error(result);
    // stateListのvalueが一つでもnullの場合、stateListは変更しない(window以外のスクロール時)
    const resultValues = Object.values(result.stateList);
    if (resultValues.findIndex((val) => val === null) === -1) {
      this.setState({ ...result.stateList });
    }
    this.scrollPos = result.scrollPos;
  };

  beforeunloadHandler = (e) => window.scrollTo(0, 0);

  componentDidMount() {
    window.addEventListener("scroll", this.scrollHandler, true);
    window.addEventListener("beforeunload", this.beforeunloadHandler, true);

    if (!isMobile) {
      console.error({ ...this.state });
      if (this.state.isShowSubNB) {
        this.exeShowSub();
      } else {
        console.error("ddss");
        this.exeHideSub();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollHandler);
    window.removeEventListener("beforeunload", this.beforeunloadHandler);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isShowNBShadow !== this.state.isShowNBShadow ||
      this.props.location !== prevProps.location
    ) {
      if (this.state.isShowNBShadow) {
        this.exeAddShadow();
      } else {
        this.exeRemoveShadow();
      }
    }

    if (
      prevState.isShowNB !== this.state.isShowNB ||
      this.props.location !== prevProps.location
    ) {
      if (isMobile) {
        if (this.state.isShowNB) {
          this.exeShow();
        } else {
          this.exeHide();
        }
      }
    }

    console.log(prevProps.domState.subNavbarRefs);
    console.log(this.props.domState.subNavbarRefs);
    if (
      prevState.isShowSubNB !== this.state.isShowSubNB ||
      this.props.location !== prevProps.location ||
      Object.keys(this.props.domState.subNavbarRefs).length !==
        Object.keys(prevProps.domState.subNavbarRefs).length
    ) {
      console.error("ppp");
      if (!isMobile) {
        if (this.state.isShowSubNB) {
          this.exeShowSub();
        } else {
          this.exeHideSub();
        }
      }
    }

    if (
      prevState.isTop !== this.state.isTop ||
      this.props.location !== prevProps.location
    ) {
      if (this.state.isTop) {
        this.exeHideToTop();
      } else {
        this.exeShowToTop();
      }
    }

    if (this.props.location !== prevProps.location) {
      this.scrollHandler();
    }
  }

  exeSuper(subNavbarExistFunc, subNavbarNullFunc) {
    // cache導入によりotapick-sub-navbarが複数存在しうるため、domStateにsubNavbarRefのコレクションで管理
    const subNavbarRef = this.props.domState.subNavbarRefs[
      this.props.location.key
    ];
    const subNavbar = subNavbarRef ? subNavbarRef.current : null;

    const navbar = document.getElementById("otapick-navbar");
    const bottomNavbar = document.getElementById("otapick-bottom-navbar");
    const toTopButton = document.getElementById("otapick-totop-button");

    console.log(navbar);
    console.log(subNavbar);

    // navbar and subNavbar
    if (subNavbar !== null && navbar !== null) {
      subNavbarExistFunc(subNavbar, navbar, bottomNavbar, toTopButton);
    }
    // only navbar
    else {
      subNavbarNullFunc(navbar, bottomNavbar, toTopButton);
    }
  }

  addShadow(elm, transition) {
    elm.style.transition = transition + "s";
    elm.classList.add("shadow");
  }

  removeShadow(elm, transition) {
    elm.style.transition = transition + "s";
    elm.classList.remove("shadow");
  }

  show(elm, isNavbar) {
    elm.style.transitionTimingFunction = "ease-out";
    if (isNavbar) {
      elm.style.transition = "0.3s";
      elm.style.top = 0 + "px";
    } else {
      elm.style.transition = "0.35s";
      elm.style.top = NAVBAR_HEIGHT + "px";
    }
  }

  hide(elm, isNavbar) {
    elm.style.transitionTimingFunction = "ease-out";
    if (isNavbar) {
      elm.style.transition = "0.35s";
      elm.style.top = "-" + NAVBAR_HEIGHT + "px";
    } else {
      elm.style.transition = "0.3s";
      elm.style.top = "-" + SUB_NAVBAR_HEIGHT + "px";
    }
  }

  showBottom(btm, totop) {
    if (btm !== null) {
      btm.style.transitionTimingFunction = "ease-out";
      btm.style.transition = "0.3s";
      btm.style.bottom = 0 + "px";
    }
    if (totop !== null) {
      totop.style.transitionTimingFunction = "ease-out";
      totop.style.transition = "0.3s";
      totop.style.bottom = TOTOP_BUTTON_M + BOTTOM_NAVBAR_HEIGHT + "px";
    }
  }

  hideBottom(btm, totop) {
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
  }

  hideSub(elm) {
    elm.style.transition = "0.1s";
    elm.style.transitionTimingFunction = "ease-out";
    elm.style.top = NAVBAR_HEIGHT - SUB_NAVBAR_HEIGHT + "px";
  }

  showToTop(elm) {
    if (elm !== null) {
      elm.classList.remove("hide");
      elm.classList.add("show");
    }
  }

  hideToTop(elm) {
    if (elm !== null) {
      elm.classList.remove("show");
      elm.classList.add("hide");
    }
  }

  exeAddShadow() {
    this.exeSuper(
      (sub, nav) => {
        this.addShadow(sub, 0.3);
        this.removeShadow(nav, 0);
      },
      (nav) => {
        this.addShadow(nav, 0.3);
      }
    );
  }

  exeRemoveShadow() {
    this.exeSuper(
      (sub, nav) => {
        this.removeShadow(sub, 0);
        this.removeShadow(nav, 0);
      },
      (nav) => this.removeShadow(nav, 0)
    );
  }

  exeShow() {
    this.exeSuper(
      (sub, nav, btm, totop) => {
        this.show(sub, false);
        this.show(nav, true);
        this.showBottom(btm, totop);
      },
      (nav, btm, totop) => {
        this.show(nav, true);
        this.showBottom(btm, totop);
      }
    );
  }

  exeHide() {
    this.exeSuper(
      (sub, nav, btm, totop) => {
        this.hide(sub, false);
        this.hide(nav, true);
        this.hideBottom(btm, totop);
      },
      (nav, btm, totop) => {
        this.hide(nav, true);
        this.hideBottom(btm, totop);
      }
    );
  }

  exeShowSub() {
    console.error("しょー");
    this.exeSuper(
      (sub) => {
        this.show(sub, false);
      },
      () => {
        return;
      }
    );
  }

  exeHideSub() {
    console.error("ハイド");
    this.exeSuper(
      (sub) => {
        console.error("ハイド2");
        this.hideSub(sub);
      },
      () => {
        console.error("ハイド3");
        return;
      }
    );
  }

  exeShowToTop() {
    this.exeSuper(
      (sub, nav, btm, totop) => {
        this.showToTop(totop);
      },
      (sub, nav, totop) => {
        this.showToTop(totop);
      }
    );
  }

  exeHideToTop() {
    this.exeSuper(
      (sub, nav, btm, totop) => {
        this.hideToTop(totop);
      },
      (sub, nav, totop) => {
        this.hideToTop(totop);
      }
    );
  }

  render() {
    return this.props.children;
  }
}

// export default withRouter(ScrollAdmin);
export default withRouter((props) => (
  <DomStateContext.Consumer>
    {(domState) => <ScrollAdmin {...props} domState={domState} />}
  </DomStateContext.Consumer>
));
