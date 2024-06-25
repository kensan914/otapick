(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"./src/components/organisms/List.jsx":
/*!*******************************************!*\
  !*** ./src/components/organisms/List.jsx ***!
  \*******************************************/
/*! exports provided: default, useListState */
/*! exports used: default, useListState */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return useListState; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");\n/* harmony import */ var react_infinite_scroller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-infinite-scroller */ "./node_modules/react-infinite-scroller/index.js");\n/* harmony import */ var react_infinite_scroller__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_infinite_scroller__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_masonry_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-masonry-component */ "./node_modules/react-masonry-component/lib/index.js");\n/* harmony import */ var react_masonry_component__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_masonry_component__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_molecules_Loader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ~/components/molecules/Loader */ "./src/components/molecules/Loader.jsx");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ~/utils */ "./src/utils/index.js");\n/* harmony import */ var _components_atoms_NotFound__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ~/components/atoms/NotFound */ "./src/components/atoms/NotFound.jsx");\n/* harmony import */ var _contexts_DomContext__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ~/contexts/DomContext */ "./src/contexts/DomContext.jsx");\n/* harmony import */ var _constants_env__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ~/constants/env */ "./src/constants/env.js");\n\n\n\n\n\n\n\n\n\nconst List = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(props => {\n  const {\n    hasMore,\n    status,\n    page,\n    urlExcludePage,\n    isLoading,\n    request,\n    topComponent,\n    NotFoundComponent,\n    children\n  } = props;\n  const domDispatch = Object(_contexts_DomContext__WEBPACK_IMPORTED_MODULE_7__[/* useDomDispatch */ "c"])();\n  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {\n    if (!hasMore) {\n      domDispatch({\n        type: "APPLY_SHOW_FOOTER",\n        location: props.location\n      });\n    }\n  }, [hasMore]);\n\n  const requestGetItems = () => {\n    if (hasMore && !isLoading) {\n      request({\n        url: Object(_utils__WEBPACK_IMPORTED_MODULE_5__[/* URLJoin */ "a"])(urlExcludePage, `?page=${page}`)\n      });\n    }\n  };\n\n  const masonryOptions = {\n    itemSelector: ".grid-item",\n    // transitionDuration: "0.1s",\n    transitionDuration: 0,\n    stagger: 0\n  };\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, topComponent, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_infinite_scroller__WEBPACK_IMPORTED_MODULE_2___default.a, {\n    hasMore: hasMore,\n    loadMore: requestGetItems,\n    initialLoad: false,\n    loader: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      key: 0,\n      style: {\n        paddingBottom: _constants_env__WEBPACK_IMPORTED_MODULE_8__[/* BOTTOM_ANCHOR_ADS_HEIGHT */ "d"]\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_molecules_Loader__WEBPACK_IMPORTED_MODULE_4__[/* HorizontalLoader */ "a"], null)),\n    className: "mb-5",\n    threshold: 500\n  }, status === "success" && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_masonry_component__WEBPACK_IMPORTED_MODULE_3___default.a, {\n    options: masonryOptions,\n    disableImagesLoaded: false\n  }, children), status === "blog_not_found" && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_atoms_NotFound__WEBPACK_IMPORTED_MODULE_6__[/* NotFoundMessage */ "c"], {\n    type: "blogFailed",\n    margin: true\n  })), status === "image_not_found" && (typeof NotFoundComponent === "undefined" ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_atoms_NotFound__WEBPACK_IMPORTED_MODULE_6__[/* NotFoundMessage */ "c"], {\n    type: "imageFailed",\n    margin: true\n  })) : NotFoundComponent)));\n});\n/* harmony default export */ __webpack_exports__["a"] = (List);\n/**\n * list componentに必要なstate等を提供\n * @returns {Array} [items, appendItems, status, setStatus, hasMoreRef, pageRef, randomSeed]\n */\n\nconst useListState = () => {\n  const [items, setItems] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);\n\n  const appendItems = newItems => {\n    setItems([...items, ...newItems]);\n  };\n\n  const [status, setStatus] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");\n  const hasMoreRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(true);\n  const pageRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(1);\n  const [randomSeed] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(Object(_utils__WEBPACK_IMPORTED_MODULE_5__[/* generateRandomSeed */ "j"])());\n  return [items, appendItems, status, setStatus, hasMoreRef, pageRef, randomSeed];\n};\n\n//# sourceURL=webpack:///./src/components/organisms/List.jsx?')},"./src/components/templates/ImageListTemplate/organisms/ImageList.jsx":
/*!****************************************************************************!*\
  !*** ./src/components/templates/ImageListTemplate/organisms/ImageList.jsx ***!
  \****************************************************************************/
/*! exports provided: default, ImageListModel */
/*! exports used: ImageListModel, default */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImageListModel; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ~/utils */ "./src/utils/index.js");\n/* harmony import */ var _constants_env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ~/constants/env */ "./src/constants/env.js");\n/* harmony import */ var _components_molecules_ImageCard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ~/components/molecules/ImageCard */ "./src/components/molecules/ImageCard.jsx");\n/* harmony import */ var _hooks_useAxios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ~/hooks/useAxios */ "./src/hooks/useAxios.js");\n/* harmony import */ var _components_organisms_List__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ~/components/organisms/List */ "./src/components/organisms/List.jsx");\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ~/contexts/AuthContext */ "./src/contexts/AuthContext.jsx");\n/* harmony import */ var _components_atoms_NotFound__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ~/components/atoms/NotFound */ "./src/components/atoms/NotFound.jsx");\n/* harmony import */ var _contexts_ProfileContext__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ~/contexts/ProfileContext */ "./src/contexts/ProfileContext.jsx");\n/* harmony import */ var _hooks_useList__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ~/hooks/useList */ "./src/hooks/useList.js");\n/* harmony import */ var _hooks_useView__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ~/hooks/useView */ "./src/hooks/useView.js");\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nconst ImageList = props => {\n  var _profileState$profile;\n\n  const {\n    topComponent\n  } = props;\n  const profileState = Object(_contexts_ProfileContext__WEBPACK_IMPORTED_MODULE_9__[/* useProfileState */ "d"])();\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ImageListModel, _extends({}, props, {\n    additionalQParams: profileState !== null && profileState !== void 0 && (_profileState$profile = profileState.profile) !== null && _profileState$profile !== void 0 && _profileState$profile.favGroups ? ["?groups=", profileState.profile.favGroups.map(group => group.groupId)] : [],\n    render: (hasMore, status, page, urlExcludePage, isLoading, request, items, isShowTopComponent, isFluid, isExcludeAds, NotFoundComponent) => {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_organisms_List__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"], {\n        hasMore: hasMore,\n        status: status,\n        page: page,\n        urlExcludePage: urlExcludePage,\n        isLoading: isLoading,\n        request: request,\n        topComponent: isShowTopComponent && status === "success" && topComponent,\n        NotFoundComponent: NotFoundComponent\n      }, items.map(({\n        groupID,\n        blogCt,\n        blogTitle,\n        src,\n        url,\n        blogUrl,\n        officialUrl,\n        writer,\n        order,\n        isFavorite,\n        width,\n        height\n      }, i) => {\n        const gridItemClassName = "grid-item " + (isFluid ? "col-6 col-md-4 col-lg-3 col-xl-2 px-1 px-sm-2 " + (_utils__WEBPACK_IMPORTED_MODULE_2__[/* isMobile */ "r"] ? "my-1 " : "my-3 ") : "col-6 col-md-4 col-lg-3 px-1 px-sm-2 " + (_utils__WEBPACK_IMPORTED_MODULE_2__[/* isMobile */ "r"] ? "my-1 " : "my-3 "));\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n          key: i\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n          className: gridItemClassName\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_molecules_ImageCard__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"], {\n          id: i,\n          groupId: groupID,\n          groupKey: Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* getGroup */ "m"])(groupID),\n          blogCt: blogCt,\n          blogTitle: blogTitle,\n          srcCollection: src,\n          urlPath: url,\n          blogUrl: blogUrl,\n          officialUrl: officialUrl,\n          writer: writer,\n          order: order,\n          initIsFavorite: isFavorite,\n          width: width,\n          height: height\n        })));\n      }));\n    }\n  }));\n};\n\n/* harmony default export */ __webpack_exports__["b"] = (ImageList);\n/**\n * ↓↓↓ unrequire params ↓↓↓\n * @param {function} render\n * @param {string} type ["RELATED_IMAGES", "FAVORITE_IMAGES", "HOME"] 通常のimage listの場合、不必要。それ以外でimage list を使う際に指定する。\n * @param {any[]} additionalQParams optional. 追加のクエリパラメータをリスト形式で指定. URLJoin(url, ...additionalQParams).\n */\n\nconst ImageListModel = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(props => {\n  const {\n    type,\n    render,\n    additionalQParams\n  } = props;\n  const {\n    groupId,\n    blogCt,\n    order\n  } = Object(_hooks_useView__WEBPACK_IMPORTED_MODULE_11__[/* useViewMatchParams */ "b"])();\n  const {\n    ct\n  } = Object(_hooks_useList__WEBPACK_IMPORTED_MODULE_10__[/* useListMatchParams */ "a"])();\n  const {\n    orderFormat\n  } = Object(_hooks_useList__WEBPACK_IMPORTED_MODULE_10__[/* useListQueryString */ "b"])("IMAGES"); //---------- typeごとに異なる処理はここに記述 ----------//\n\n  let urlExcludeQparams;\n  let isFluid = false; // container-fluidを指定している\n\n  let isExcludeAds = false; // list内にAdsを表示していない\n\n  let NotFoundComponent; // 画像が見つからなかった時に表示されるNotFoundComponentを上書き。\n\n  switch (type) {\n    // required props: {groupID, blogCt, order}\n    case "RELATED_IMAGES":\n      urlExcludeQparams = Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* URLJoin */ "a"])(_constants_env__WEBPACK_IMPORTED_MODULE_3__[/* BASE_URL */ "b"], "relatedImages/", groupId, blogCt, order);\n      isFluid = true;\n      isExcludeAds = true;\n      break;\n\n    case "FAVORITE_IMAGES":\n      urlExcludeQparams = Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* URLJoin */ "a"])(_constants_env__WEBPACK_IMPORTED_MODULE_3__[/* BASE_URL */ "b"], "favorites/");\n      isFluid = true;\n      isExcludeAds = true;\n      NotFoundComponent = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n        className: _utils__WEBPACK_IMPORTED_MODULE_2__[/* isSmp */ "t"] ? "mx-1" : "mx-3"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_atoms_NotFound__WEBPACK_IMPORTED_MODULE_8__[/* NotFoundMessage */ "c"], {\n        type: "favoriteImage",\n        margin: true\n      }));\n      break;\n\n    case "HOME":\n      urlExcludeQparams = Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* URLJoin */ "a"])(_constants_env__WEBPACK_IMPORTED_MODULE_3__[/* BASE_URL */ "b"], "home/");\n      break;\n    // required props: {groupID, ct}\n\n    default:\n      urlExcludeQparams = Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* URLJoin */ "a"])(_constants_env__WEBPACK_IMPORTED_MODULE_3__[/* BASE_URL */ "b"], "images/", groupId, ct);\n      break;\n  } //----------------------------------------------------//\n\n\n  const [items, appendItems, status, setStatus, hasMoreRef, pageRef, randomSeed] = Object(_components_organisms_List__WEBPACK_IMPORTED_MODULE_6__[/* useListState */ "b"])();\n  const urlExcludePage = Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* URLJoin */ "a"])(urlExcludeQparams, orderFormat && `?sort=${orderFormat}`, randomSeed && `?random_seed=${randomSeed}`, ...(additionalQParams ? additionalQParams : []));\n  const [isShowTopComponent, setIsShowTopComponent] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);\n  const authState = Object(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_7__[/* useAuthState */ "c"])();\n  const {\n    isLoading,\n    request\n  } = Object(_hooks_useAxios__WEBPACK_IMPORTED_MODULE_5__[/* useAxios */ "c"])(Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* URLJoin */ "a"])(urlExcludePage, `?page=${pageRef.current}`), "get", {\n    thenCallback: res => {\n      if (res.data.length > 0) {\n        const newImages = res.data.map(item => ({\n          groupID: item.blog.group_id,\n          blogCt: item.blog.blog_ct,\n          blogTitle: item.blog.title,\n          src: item.image.src,\n          url: item.image.url,\n          blogUrl: item.blog.url,\n          officialUrl: item.blog.official_url,\n          writer: item.blog.writer,\n          order: item.image.order,\n          isFavorite: item.image.is_favorite,\n          width: item.image.width,\n          height: item.image.height\n        }));\n        appendItems(newImages);\n        setStatus("success");\n\n        if (res.data.length < 20) {\n          hasMoreRef.current = false;\n        }\n      } else {\n        if (pageRef.current == 1) {\n          hasMoreRef.current = false;\n          setStatus("image_not_found");\n        } else {\n          hasMoreRef.current = false;\n        }\n      } // relatedImageTitle表示\n\n\n      setIsShowTopComponent && setIsShowTopComponent(true);\n    },\n    catchCallback: err => {\n      if (err.response.status === 404) {\n        hasMoreRef.current = false;\n        setStatus("image_not_found");\n      }\n    },\n    finallyCallback: () => {\n      pageRef.current++;\n    },\n    didRequestCallback: r => {// console.info(r);\n    },\n    shouldRequestDidMount: true,\n    token: authState.token\n  });\n  return render(hasMoreRef.current, status, pageRef.current, urlExcludePage, isLoading, request, items, isShowTopComponent, isFluid, isExcludeAds, NotFoundComponent);\n});\n\n//# sourceURL=webpack:///./src/components/templates/ImageListTemplate/organisms/ImageList.jsx?')},"./src/hooks/useList.js":
/*!******************************!*\
  !*** ./src/hooks/useList.js ***!
  \******************************/
/*! exports provided: useListMatchParams, useListQueryString, usePushHistoryList */
/*! exports used: useListMatchParams, useListQueryString, usePushHistoryList */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return useListMatchParams; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return useListQueryString; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return usePushHistoryList; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/esm/react-router.js");\n/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! query-string */ "./node_modules/query-string/index.js");\n/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(query_string__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ~/utils/index */ "./src/utils/index.js");\n\n\n\n\n/**\n * blogs・images兼用のhooks. URL(match.params)から各値を取得し返却.\n * @returns\n */\n\nconst useListMatchParams = () => {\n  var _match$params, _match$params2;\n\n  const match = Object(react_router__WEBPACK_IMPORTED_MODULE_1__[/* useRouteMatch */ "n"])();\n  const [groupId] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(match === null || match === void 0 ? void 0 : (_match$params = match.params) === null || _match$params === void 0 ? void 0 : _match$params.groupId);\n  const [ct] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(match === null || match === void 0 ? void 0 : (_match$params2 = match.params) === null || _match$params2 === void 0 ? void 0 : _match$params2.ct);\n  const [groupKey] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(Object(_utils_index__WEBPACK_IMPORTED_MODULE_3__[/* getGroup */ "m"])(groupId));\n  return {\n    groupId,\n    ct,\n    groupKey\n  };\n};\n/**\n * blogs・images兼用のhooks. QueryStringを取得し返却.\n * narrowingKeyword, narrowingPostのみblogs限定\n * @params type: "BLOGS" | "IMAGES"\n * @returns\n */\n\nconst useListQueryString = type => {\n  const location = Object(react_router__WEBPACK_IMPORTED_MODULE_1__[/* useLocation */ "l"])();\n  const qs = query_string__WEBPACK_IMPORTED_MODULE_2___default.a.parse(location.search);\n  let initSort = "";\n\n  switch (type) {\n    case "BLOGS":\n      initSort = "newer_post";\n      break;\n\n    case "IMAGES":\n      initSort = "recommend";\n      break;\n\n    default:\n      throw new Error(`the type "${type} is unexpected."`);\n  }\n\n  const [orderFormat] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(typeof qs.sort == "undefined" ? initSort : qs.sort);\n  const [narrowingKeyword] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(typeof qs.keyword == "undefined" ? "" : qs.keyword);\n  const [narrowingPost] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(typeof qs.post == "undefined" ? "" : qs.post);\n  return {\n    orderFormat,\n    narrowingKeyword,\n    narrowingPost\n  };\n};\nconst usePushHistoryList = () => {\n  const location = Object(react_router__WEBPACK_IMPORTED_MODULE_1__[/* useLocation */ "l"])();\n  const match = Object(react_router__WEBPACK_IMPORTED_MODULE_1__[/* useRouteMatch */ "n"])();\n  const history = Object(react_router__WEBPACK_IMPORTED_MODULE_1__[/* useHistory */ "k"])();\n\n  const pushHistoryList = qs => {\n    const currentQs = query_string__WEBPACK_IMPORTED_MODULE_2___default.a.parse(location.search);\n\n    if (!qs.sort) {\n      delete currentQs.keyword;\n      delete currentQs.post;\n    }\n\n    const queryParamsHash = Object.assign(currentQs, qs);\n    let queryParams = "";\n    Object.keys(queryParamsHash).forEach((qsKey, index) => {\n      if (index == 0) queryParams += `?${qsKey}=${queryParamsHash[qsKey]}`;else queryParams += `&${qsKey}=${queryParamsHash[qsKey]}`;\n    });\n    history.push(Object(_utils_index__WEBPACK_IMPORTED_MODULE_3__[/* URLJoin */ "a"])(match.url, queryParams));\n  };\n\n  return pushHistoryList;\n};\n\n//# sourceURL=webpack:///./src/hooks/useList.js?')}}]);