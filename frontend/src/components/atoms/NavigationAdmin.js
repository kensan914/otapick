import React from 'react';
import { isMobile } from '../tools/support';
import { SUB_NAVBAR_HEIGHT, NAVBAR_HEIGHT, BOTTOM_NAVBAR_HEIGHT, TOTOP_BUTTON_M } from '../tools/env';
import { withRouter } from 'react-router-dom';


// navbar, subnavbar shadow付与
// navbar, subnavbar show, hide制御
// PCでのsubnavbar の挙動
class NavigationAdmin extends React.Component {
  exeSuper(subNavbarExistFunc, subNavbarNullFunc) {
    const subNavbar = document.getElementById("otapick-sub-navbar");
    const navabar = document.getElementById("otapick-navbar");
    const bottmNavbar = document.getElementById("otapick-bottom-navbar");
    const toTopButton = document.getElementById("otapick-totop-button");
    // navbar and subNavbar
    if (subNavbar !== null && navabar !== null) {
      subNavbarExistFunc(subNavbar, navabar, bottmNavbar, toTopButton);
    }
    // only navbar
    else {
      subNavbarNullFunc(navabar, bottmNavbar, toTopButton);
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
    elm.style.top = (NAVBAR_HEIGHT - SUB_NAVBAR_HEIGHT) + "px";
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
      (sub, nav) => { this.addShadow(sub, 0.3); this.removeShadow(nav, 0); },
      (nav) => { this.addShadow(nav, 0.3); });
  }

  exeRemoveShadow() {
    this.exeSuper(
      (sub, nav) => { this.removeShadow(sub, 0); this.removeShadow(nav, 0); },
      (nav) => this.removeShadow(nav, 0));
  }

  exeShow() {
    this.exeSuper(
      (sub, nav, btm, totop) => { this.show(sub, false); this.show(nav, true); this.showBottom(btm, totop); },
      (nav, btm, totop) => { this.show(nav, true); this.showBottom(btm, totop) });
  }

  exeHide() {
    this.exeSuper(
      (sub, nav, btm, totop) => { this.hide(sub, false); this.hide(nav, true); this.hideBottom(btm, totop); },
      (nav, btm, totop) => { this.hide(nav, true); this.hideBottom(btm, totop); });
  }

  exeShowSub() {
    this.exeSuper(
      (sub) => { this.show(sub, false); },
      () => { return });
  }

  exeHideSub() {
    this.exeSuper(
      (sub) => { this.hideSub(sub); },
      () => { return });
  }

  exeShowToTop() {
    this.exeSuper(
      (sub, nav, btm, totop) => { this.showToTop(totop); },
      (sub, nav, totop) => { this.showToTop(totop); });
  }

  exeHideToTop() {
    this.exeSuper(
      (sub, nav, btm, totop) => { this.hideToTop(totop); },
      (sub, nav, totop) => { this.hideToTop(totop); });
  }

  componentDidMount() {
    if (!isMobile) {
      if (this.props.isShowSubNB) {
        this.exeShowSub();
      }
      else {
        this.exeHideSub();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isShowNBShadow !== this.props.isShowNBShadow || this.props.location !== prevProps.location) {
      if (this.props.isShowNBShadow) {
        this.exeAddShadow();
      }
      else {
        this.exeRemoveShadow();
      }
    }

    if (prevProps.isShowNB !== this.props.isShowNB || this.props.location !== prevProps.location) {
      if (isMobile) {
        if (this.props.isShowNB) {
          this.exeShow();
        }
        else {
          this.exeHide();
        }
      }
    }

    if (prevProps.isShowSubNB !== this.props.isShowSubNB || this.props.location !== prevProps.location) {
      if (!isMobile) {
        if (this.props.isShowSubNB) {
          this.exeShowSub();
        }
        else {
          this.exeHideSub();
        }
      }
    }

    if (prevProps.isTop !== this.props.isTop || this.props.location !== prevProps.location) {
      if (this.props.isTop) {
        this.exeHideToTop();
      }
      else {
        this.exeShowToTop();
      }
    }

    if (this.props.location !== prevProps.location) {
      this.props.scrollHandler();
    }
  }

  render() {
    return <></>;
  }
}

export default withRouter(NavigationAdmin);