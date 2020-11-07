import React, { createContext, useReducer, useContext, useEffect, useRef } from "react";
import { watchCurrentPosition } from "../modules/utils";


const domReducer = (prevState, action) => {
  switch (action.type) {
    case "ACCESSE_TO_BLOG":
      /** accessedBlogsにblogIDを追加
       * @param {Object} action [type, blogID] */

      return {
        ...prevState,
        accessedBlogs: [...prevState.accessedBlogs, action.blogID],
      };

    case "ACCESSE_TO_IMAGE":
      /** accessedImagesにimageIDを追加
       * @param {Object} action [type, imageID] */

      return {
        ...prevState,
        accessedImages: [...prevState.accessedImages, action.imageID],
      };

    case "SET_FOOTER_REF":
      /** set footerRef
       * @param {Object} action [type, footerRef] */

      return {
        ...prevState,
        footerRef: action.footerRef,
      };

    case "APPLY_SHOW_FOOTER":
      /** 外部からフッターを表示する。
       * @param {Object} action [type, location] */

      if (prevState.footerRef !== null) prevState.footerRef.current.applyShowFooter(action.location);
      return { ...prevState, };

    case "HANDLE_SCROLL":
      /** scrollHandler。スクロールごとに呼ばれスクロール関連のstateを一括更新。
       *  ex) stateList = { isShowNBShadow: null, isShowNB: null, isShowSubNB: null, isTop: null }
       * @param {Object} action [type] */

      const result = watchCurrentPosition(prevState.scrollPos);
      // stateListのkeyが一つでもnullの場合、stateListは初期化(画面遷移時)
      let canUpdateStateList = true;
      if (Object.values(result.stateList)[0] === null) canUpdateStateList = false;

      return {
        ...prevState,
        ...(canUpdateStateList ? result.stateList : initScrollStates),
        scrollPos: result.scrollPos,
      };

    default:
      console.error(`Not found "${action.type}" action.type.`);
      return;
  }
};


const initScrollStates = {
  isShowNBShadow: false,
  isShowNB: true,
  isShowSubNB: false,
  isTop: true,
};

const initDomState = {
  accessedBlogs: [], // ["1_34360_2341234", "2_34230_51451345"]
  accessedImages: [], // ["1_34360_0_2341234", "2_34230_3_51451345"]
  footerRef: null,
  scrollPos: 0,
  ...initScrollStates,
};

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
  const [domState, domDispatch] = useReducer(domReducer, { ...initDomState });

  useEffect(() => {
    const scrollHandler = e => domDispatch({ type: "HANDLE_SCROLL" });
    const beforeunloadHandler = e => window.scrollTo(0, 0);

    window.addEventListener("scroll", scrollHandler, true);
    window.addEventListener("beforeunload", beforeunloadHandler, true);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("beforeunload", beforeunloadHandler);
    };
  }, []);

  return (
    <DomStateContext.Provider value={domState}>
      <DomDispatchContext.Provider value={domDispatch}>
        {children}
      </DomDispatchContext.Provider>
    </DomStateContext.Provider>
  );
};

export default DomProvider;