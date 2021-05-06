import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import {
  DEBUG,
  DESCRIPTION,
  GA_TRACKING_ID,
  HOME_TITLE,
  SITE_NAME,
} from "~/constants/env";
import { useCacheRoute } from "~/hooks/useCacheRoute";

/**
 * meta情報をsetする関数setMetaを提供(ex. ブログ情報を取得時にsetMeta実行).
 * 本hooks内でmeta情報の更新の責務を担う.
 * また, gtag(GA)の送信も行う. titleが変更されたタイミングがPVをインクリメントするタイミングであるため.
 * @returns
 */
export const useMeta = () => {
  const [metaTitle, setMetaTitle] = useState();
  const [metaDescription, setMetaDescription] = useState();
  const location = useLocation();

  const setMeta = (_metaTitle, _metaDescription) => {
    typeof _metaTitle !== "undefined" && setMetaTitle(_metaTitle);
    typeof _metaDescription !== "undefined" &&
      setMetaDescription(_metaDescription);
  };

  /**
   * gtag(GA)の送信も兼ねるため重複実行はNG
   */
  const updateMeta = () => {
    if (
      typeof metaTitle !== "undefined" &&
      typeof metaDescription !== "undefined"
    ) {
      // console.log("updateMeta: ", `"${metaTitle}", `, `"${metaDescription}"`);
      // update title
      if (metaTitle !== HOME_TITLE) {
        document.title = `${metaTitle}｜${SITE_NAME}`;
      } else {
        document.title = `${SITE_NAME}｜${HOME_TITLE}`;
      }

      // update meta
      const headMetaList = document.head.children;
      for (const headMeta of headMetaList) {
        const metaName = headMeta.getAttribute("name");
        if (metaName !== null) {
          if (metaName.indexOf("description") !== -1) {
            headMeta.setAttribute("content", metaDescription + DESCRIPTION);
          }
        }
      }

      // gtag(GA). meta情報(title)が変更されたときにgtag送信
      // console.log("gtag送信: ", location.pathname);
      gtagTo(location.pathname);
    }
  };

  // meta情報がsetされたときに更新
  useEffect(() => {
    updateMeta();
  }, [metaTitle, metaDescription]);

  // cacheされたコンポ―ネント用. ブラウザバックでは自動でmetaが更新されるが、
  // ホームに一度アクセスした後、ホーム以外で左上ロゴをクリックしホームに遷移した時など
  const { isCachedRoute } = useCacheRoute();
  const isMounted = useRef(false); // didMountでは実行しない
  useEffect(() => {
    if (isMounted.current && !isCachedRoute) {
      updateMeta();
    } else {
      isMounted.current = true;
    }
  }, [isCachedRoute]);

  return { setMeta };
};

// Global site tag (gtag.js) - Google Analytics
const gtagTo = (pathname) => {
  if (!DEBUG) {
    if (!window.gtag) return;
    if (!GA_TRACKING_ID) return;

    // eslint-disable-next-line no-undef
    gtag("config", GA_TRACKING_ID, {
      page_path: pathname,
    });
  }
};
