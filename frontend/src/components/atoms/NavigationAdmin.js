import React from 'react';
import { isMobile } from '../tools/support';
import { SUB_NAVBAR_HEIGHT, NAVBAR_HEIGHT } from '../tools/env';
import { withRouter } from 'react-router-dom';


// navbar, subnavbar shadow付与
// navbar, subnavbar show, hide制御
// PCでのsubnavbar の挙動
class NavigationAdmin extends React.Component {
  exeSuper(subNavbarExistFunc, subNavbarNullFunc) {
    const subNavbar = document.getElementById("otapick-sub-navbar");
    const navabar = document.getElementById("otapick-navbar");
    // navbar and subNavbar
    if (subNavbar !== null && navabar !== null) {
      subNavbarExistFunc(subNavbar, navabar);
    }
    // only navbar
    else {
      subNavbarNullFunc(navabar);
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

  hideSub(elm) {
    elm.style.transition = "0s";
    elm.style.transitionTimingFunction = "ease-out";
    elm.style.top = (NAVBAR_HEIGHT - SUB_NAVBAR_HEIGHT) + "px";
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
      (sub, nav) => { this.show(sub, false); this.show(nav, true); },
      (nav) => { this.show(nav, true); });
  }

  exeHide() {
    this.exeSuper(
      (sub, nav) => { this.hide(sub, false); this.hide(nav, true); },
      (nav) => { this.hide(nav, true); });
  }

  exeShowSub() {
    this.exeSuper(
      (sub, nav) => { this.show(sub, false); },
      (nav) => { return });
  }

  exeHideSub() {
    this.exeSuper(
      (sub, nav) => { this.hideSub(sub); },
      (nav) => { return });
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

    if (prevProps.isShowNB !== this.props.isShowNB) {
      if (isMobile) {
        if (this.props.isShowNB) {
          this.exeShow();
        }
        else {
          this.exeHide();
        }
      }
    }

    if (prevProps.isShowSubNB !== this.props.isShowSubNB) {
      if (!isMobile) {
        if (this.props.isShowSubNB) {
          this.exeShowSub();
        }
        else {
          this.exeHideSub();
        }
      }
    }
  }

  render() {
    return <></>;
  }
}

export default withRouter(NavigationAdmin);