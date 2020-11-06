import React, { createContext, useReducer, useContext } from "react";


const historyReducer = (prevState, action) => {
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

      _listStates[action.locationKey].items = (_listStates[action.locationKey].items ? _listStates[action.locationKey].items : []).concat(action.items);

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

      _listStates[action.locationKey].additionalItems = (_listStates[action.locationKey].additionalItems ? _listStates[action.locationKey].additionalItems : []).concat(action.additionalItems);
      _listStates[action.locationKey].additionalItemsStartPage = action.additionalItemsStartPage;

      return {
        ...prevState,
        listStates: _listStates,
      };

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

const initHistoryState = {
  listStates: {},
};

const HistoryStateContext = createContext({ ...initHistoryState });
const HistoryDispatchContext = createContext(undefined);

export const useHistoryState = () => {
  const context = useContext(HistoryStateContext);
  return context;
};
export const useHistoryDispatch = () => {
  const context = useContext(HistoryDispatchContext);
  return context;
};

const HistoryProvider = ({ children }) => {
  const [historyState, historyDispatch] = useReducer(historyReducer, { ...initHistoryState });

  return (
    <HistoryStateContext.Provider value={historyState}>
      <HistoryDispatchContext.Provider value={historyDispatch}>
        {children}
      </HistoryDispatchContext.Provider>
    </HistoryStateContext.Provider>
  );
};

export default HistoryProvider;