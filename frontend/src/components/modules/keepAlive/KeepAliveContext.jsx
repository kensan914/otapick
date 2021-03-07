import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useRef,
} from "react";
import * as ReactDOM from "react-dom";
import createStoreElement from "./utils/createStoreElement";

const keepAliveReducer = (prevState, action) => {
  let _listStates = { ...prevState.listStates };
  switch (action.type) {
    case "INIT_LIST_STATE":
      /** listStatesに初期化したlistStateを追加。
       * @param {Object} action [type, locationKey, randomSeed] */

      _listStates[action.locationKey] = {
        ...initListState,
        randomSeed: action.randomSeed,
      };

      return {
        ...prevState,
        listStates: _listStates,
      };

    case "APPEND_LIST_ITEMS":
      /** listStateにitemsを追加。
       * @param {Object} action [type, locationKey, items] */

      _listStates[action.locationKey].items = (_listStates[action.locationKey]
        .items
        ? _listStates[action.locationKey].items
        : []
      ).concat(action.items);

      return {
        ...prevState,
        listStates: _listStates,
      };

    case "SET_LIST_HAS_MORE":
      /** listStateのhasMoreを変更。
       * @param {Object} action [type, locationKey, hasMore] */

      _listStates[action.locationKey].hasMore = action.hasMore;

      return {
        ...prevState,
        listStates: _listStates,
      };

    case "SET_LIST_STATUS":
      /** listStateのstatusを変更。
       * @param {Object} action [type, locationKey, status] */

      _listStates[action.locationKey].status = action.status;

      return {
        ...prevState,
        listStates: _listStates,
      };

    case "INCREMENT_LIST_PAGE":
      /** listStateのpageをインクリメント。
       * @param {Object} action [type, locationKey] */

      _listStates[action.locationKey].page += 1;

      return {
        ...prevState,
        listStates: _listStates,
      };

    case "APPEND_LIST_ADDITIONAL_ITEMS":
      /** listStateにadditionalItems, additionalItemsStartPageを追加。
       * @param {Object} action [type, locationKey, additionalItems, additionalItemsStartPage] */

      _listStates[action.locationKey].additionalItems = (_listStates[
        action.locationKey
      ].additionalItems
        ? _listStates[action.locationKey].additionalItems
        : []
      ).concat(action.additionalItems);
      _listStates[action.locationKey].additionalItemsStartPage =
        action.additionalItemsStartPage;

      return {
        ...prevState,
        listStates: _listStates,
      };

    // case "SET_CACHE":
    //   const _caches = prevState.caches;
    //   _caches[action.locationKey] = action.value;

    //   return {
    //     ...prevState,
    //     caches: _caches,
    //   };

    default:
      console.error(`Not found "${action.type}" action.type.`);
      return;
  }
};

export const initListState = {
  randomSeed: "",
  items: [],
  hasMore: true,
  status: "",
  page: 1,
  additionalItems: [],
  additionalItemsStartPage: 1,
};
Object.freeze(initListState);

const initStoreElement = createStoreElement();

const initKeepAliveState = {
  listStates: {},
  storeNode: initStoreElement,
  // caches: {},
};
Object.freeze(initKeepAliveState);

const KeepAliveStateContext = createContext({ ...initKeepAliveState });
const KeepAliveDispatchContext = createContext(undefined);

export const useKeepAliveState = () => {
  const context = useContext(KeepAliveStateContext);
  return context;
};
export const useKeepAliveDispatch = () => {
  const context = useContext(KeepAliveDispatchContext);
  return context;
};

const KeepAliveProvider = ({ children }) => {
  const caches = useRef({});
  const setCaches = (locationKey, value) => {
    caches.current[locationKey] = value;
  };
  const [keepAliveState, keepAliveDispatch] = useReducer(keepAliveReducer, {
    ...initKeepAliveState,
    setCaches,
  });

  useEffect(() => {
    return () => {
      document.body.removeChild(keepAliveState.storeNode);
    };
  }, []);

  return (
    <KeepAliveStateContext.Provider value={keepAliveState}>
      <KeepAliveDispatchContext.Provider value={keepAliveDispatch}>
        {children}
        {/* {ReactDOM.createPortal(
          Object.values(caches.current).map((currentCache, locationKey) => {
            const {
              keepAlive,
              children,
              lifecycle,
            } = currentCache;
            let cacheChildren = children;
            // if (lifecycle === LIFECYCLE.MOUNTED && !keepAlive) {
            //   // If the cache was last enabled, then the components of this keepAlive package are used,
            //   // and the cache is not enabled, the UI needs to be reset.
            //   cacheChildren = null;
            //   this.needRerender = true;
            //   currentCache.lifecycle = LIFECYCLE.UPDATING;
            // }
            // current true, previous true | undefined, keepAlive false, not cache
            // current true, previous true | undefined, keepAlive true, cache

            // current true, previous false, keepAlive true, cache
            // current true, previous false, keepAlive false, not cache
            return (
              cacheChildren
                ? (
                  <React.Fragment key={locationKey}>
                    {cacheChildren}
                  </React.Fragment>
                )
                : null
            );
          }),
          keepAliveState.storeNode
        )} */}
      </KeepAliveDispatchContext.Provider>
    </KeepAliveStateContext.Provider>
  );
};

export default KeepAliveProvider;
