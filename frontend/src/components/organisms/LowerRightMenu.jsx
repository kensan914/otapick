import React, { useEffect, useState } from "react";

import ToTopButton from "~/components/atoms/ToTopButton";
import { showToTopButtonUrls } from "~/constants/env";
import { useLocation } from "react-router";

export const LowerRightMenu = () => {
  const location = useLocation();

  const [isShowToTop, setIsShowToTop] = useState(false);

  const checkShowableButtons = (
    setIsShow,
    showUrls = [],
    dontShowUrls = []
  ) => {
    const isShowable = showUrls.length > 0;
    const urls = isShowable ? showUrls : dontShowUrls;

    const isMatch = urls.some((url) => {
      if (url === "/") {
        if (location.pathname === "/") {
          return true;
        }
      } else if (location.pathname.startsWith(url)) {
        return true;
      }
    });

    // isMatch: Urlsにマッチした, isShowable: 表示していいUrlsか
    // これらの排他的論理和の否定: 同じ真偽値=>true, 違う真偽値=>false
    setIsShow(!(isMatch ^ isShowable));
  };

  useEffect(() => {
    checkShowableButtons(setIsShowToTop, showToTopButtonUrls, []);
  }, [location]);

  return <>{isShowToTop && <ToTopButton />}</>;
};
