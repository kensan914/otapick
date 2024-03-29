import React, { createContext, useReducer, useContext } from "react";

import GlobalModal from "~/components/molecules/modals/GlobalModal";

const domReducer = (prevState, action) => {
  let _favoriteState;

  switch (action.type) {
    case "ACCESS_TO_BLOG":
      /** accessedBlogsにblogIDを追加
       * @param {Object} action [type, blogId] */

      return {
        ...prevState,
        accessedBlogs: [...prevState.accessedBlogs, action.blogId],
      };

    case "ACCESS_TO_IMAGE":
      /** accessedImagesにimageIDを追加
       * @param {Object} action [type, imageId] */

      return {
        ...prevState,
        accessedImages: [...prevState.accessedImages, action.imageId],
      };

    case "SET_FOOTER_REF":
      /** set footerRef
       * @param {Object} action [type, footerRef] */

      return {
        ...prevState,
        footerRef: action.footerRef,
      };

    case "SET_SUBNAVBAR_REF": /** set subNavbarRef
     * @param {Object} action [type, subNavbarRef, locationKey] */ {
      const _subNavbarRefs = prevState.subNavbarRefs;
      _subNavbarRefs[action.locationKey] = action.subNavbarRef;

      return {
        ...prevState,
        subNavbarRefs: _subNavbarRefs,
      };
    }

    case "APPLY_SHOW_FOOTER":
      /** 外部からフッターを表示する。
       * @param {Object} action [type, location] */

      if (prevState.footerRef?.current)
        prevState.footerRef.current.applyShowFooter(action.location);
      return { ...prevState };

    case "INIT_FAVORITE":
      /** init favoriteState. 既にfavoriteStateにimageが存在する場合は、上書きしない
       * @param {Object} action [type, imageID, isFavorite] */

      _favoriteState = prevState.favoriteState;
      if (!(action.imageID in _favoriteState)) {
        _favoriteState[action.imageID] = action.isFavorite;
      }

      return {
        ...prevState,
        favoriteState: _favoriteState,
      };

    case "SET_FAVORITE":
      /** set favorite
       * @param {Object} action [type, imageId, isFavorite] */

      _favoriteState = prevState.favoriteState;
      _favoriteState[action.imageId] = action.isFavorite;

      return {
        ...prevState,
        favoriteState: _favoriteState,
      };

    case "OPEN_GLOBAL_MODAL":
      /** open global modal
       * @param {Object} action [type, globalModalId] */

      if (!action.globalModalId || typeof action.globalModalId !== "string")
        return { ...prevState };

      return {
        ...prevState,
        isOpenGlobalModal: true,
        globalModalId: action.globalModalId,
      };

    case "DISABLE_GLOBAL_MODAL":
      /** アニメーションなしに即消しする際に. Modal open時にブラウザバックしたときなど.
       * @param {Object} action [type] */

      return {
        ...prevState,
        isOpenGlobalModal: false,
        globalModalId: INIT_GLOBAL_MODAL_ID,
      };

    case "TOGGLE_GLOBAL_MODAL":
      /** toggle global modal
       * @param {Object} action [type] */

      return {
        ...prevState,
        isOpenGlobalModal: !prevState.isOpenGlobalModal,
      };

    default:
      console.error(`Not found "${action.type}" action.type.`);
      return;
  }
};

const INIT_GLOBAL_MODAL_ID = "INIT";
const initDomState = Object.freeze({
  accessedBlogs: [], // ["1_34360_2341234", "2_34230_51451345"] （`${groupId}_${blogCt}_${location.key}`）
  accessedImages: [], // ["3-33452-3.452875...", "2-34339-1.b1a66..."] （`${groupId}-${blogCt}-${order}.${mountごとのuuid4}`）
  footerRef: null,

  // ↓scrollAdmin用。cache導入によりsubNavbarが複数存在しうる。
  // また、id(`otapick-sub-navbar-${location.key}`)で管理していたが、遷移してからid反映にラグがあるためrefで管理
  subNavbarRefs: {},

  // { `${groupID}-${blogCt}-${order}`: {boolean}, }
  // ex) { "1-34360-0" : true, "2-34230-3": false, }
  favoriteState: {},

  // global modal
  isOpenGlobalModal: false,
  globalModalId: INIT_GLOBAL_MODAL_ID,
});

export const DomStateContext = createContext({ ...initDomState });
export const DomDispatchContext = createContext(undefined);

export const useDomState = () => {
  const context = useContext(DomStateContext);
  return context;
};
export const useDomDispatch = () => {
  const context = useContext(DomDispatchContext);
  return context;
};

const DomProvider = ({ children }) => {
  const [domState, domDispatch] = useReducer(domReducer, {
    ...initDomState,
  });

  return (
    <DomStateContext.Provider value={domState}>
      <DomDispatchContext.Provider value={domDispatch}>
        {children}
        <GlobalModal
          globalModalId={domState.globalModalId}
          isOpenGlobalModal={domState.isOpenGlobalModal}
          toggleGlobalModal={() => domDispatch({ type: "TOGGLE_GLOBAL_MODAL" })}
          disableGlobalModal={() =>
            domDispatch({ type: "DISABLE_GLOBAL_MODAL" })
          }
          INIT_GLOBAL_MODAL_ID={INIT_GLOBAL_MODAL_ID}
        />
      </DomDispatchContext.Provider>
    </DomStateContext.Provider>
  );
};

export default DomProvider;
