import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import ExceedMaxFavoriteModal from "~/components/molecules/modals/ExceedMaxFavoriteModal";
import ImageDownloadedModal from "~/components/molecules/modals/ImageDownloadedModal";
import SignUpBeforeFavoriteModal from "~/components/molecules/modals/SignUpBeforeFavoriteModal";

/**
 * GlobalModal.
 * 目的: Modalを実装する時に所々点在して実装していたところを一か所にモジュール化.
 *
 * Modalの増設方法:
 * 1. molecules/modals下に個別Modalコンポーネントを作成. propsにisOpen・toggleを受け取る. ファイル名がそのままglobalModalIdになる.
 * 2. 本コンポーネント(GlobalModal)内のswitch-caseを追加. (case `${1.で作ったファイル名}`:)
 * 3. Modalをopenしたい箇所でdomDispatch({ type: "OPEN_GLOBAL_MODAL", globalModalId: "..." });を実行.
 */
const GlobalModal = (props) => {
  const {
    globalModalId,
    isOpenGlobalModal,
    toggleGlobalModal,
    disableGlobalModal,
    INIT_GLOBAL_MODAL_ID,
  } = props;

  const location = useLocation();
  useEffect(() => {
    disableGlobalModal();
  }, [location.key]);

  switch (globalModalId) {
    case INIT_GLOBAL_MODAL_ID:
      // 初期状態
      return <></>;
    case "ExceedMaxFavoriteModal":
      return (
        <ExceedMaxFavoriteModal
          isOpen={isOpenGlobalModal}
          toggle={toggleGlobalModal}
        />
      );
    case "ImageDownloadedModal":
      return (
        <ImageDownloadedModal
          isOpen={isOpenGlobalModal}
          toggle={toggleGlobalModal}
        />
      );
    case "SignUpBeforeFavoriteModal":
      return (
        <SignUpBeforeFavoriteModal
          isOpen={isOpenGlobalModal}
          toggle={toggleGlobalModal}
        />
      );
    default:
      console.error(`Not found "${globalModalId}" globalModalId.`);
      return <></>;
  }
};

export default GlobalModal;
