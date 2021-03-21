(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{"./src/components/templates/ImageViewTemplate.jsx":
/*!********************************************************!*\
  !*** ./src/components/templates/ImageViewTemplate.jsx ***!
  \********************************************************/
/*! exports provided: default, getImageViewUrlComposition */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: ./src/components/Screens.jsx (referenced with import()) */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getImageViewUrlComposition", function() { return getImageViewUrlComposition; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _modules_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/utils */ "./src/components/modules/utils.js");\n/* harmony import */ var _modules_env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/env */ "./src/components/modules/env.js");\n/* harmony import */ var _organisms_ImageView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../organisms/ImageView */ "./src/components/organisms/ImageView.jsx");\n/* harmony import */ var _organisms_List_ImageList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../organisms/List/ImageList */ "./src/components/organisms/List/ImageList.jsx");\n/* harmony import */ var _atoms_BackButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../atoms/BackButton */ "./src/components/atoms/BackButton.jsx");\n/* harmony import */ var _molecules_Headline__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../molecules/Headline */ "./src/components/molecules/Headline.jsx");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");\n/* harmony import */ var _atoms_AdSense__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../atoms/AdSense */ "./src/components/atoms/AdSense.jsx");\n/* harmony import */ var _contexts_DomContext__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../contexts/DomContext */ "./src/components/contexts/DomContext.jsx");\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../contexts/AuthContext */ "./src/components/contexts/AuthContext.jsx");\n\n\n\n\n\n\n\n\n\n\n\n\nclass ImageViewTemplate extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    const groupID = props.match.params.groupID;\n    const blogCt = props.match.params.blogCt;\n    const order = props.match.params.order;\n    this.isRender = Object(_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* checkMatchParams */ "d"])(props.history, groupID, blogCt, order);\n    this.state = {\n      group: Object(_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* getGroup */ "o"])(groupID),\n      groupID: groupID,\n      blogCt: blogCt,\n      order: Number(order),\n      imageViewURL: Object(_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* URLJoin */ "a"])(_modules_env__WEBPACK_IMPORTED_MODULE_2__[/* BASE_URL */ "d"], "image/", groupID, blogCt, order),\n      blogViewURL: Object(_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* URLJoin */ "a"])(_modules_env__WEBPACK_IMPORTED_MODULE_2__[/* BASE_URL */ "d"], "blog/", groupID, blogCt)\n    };\n  }\n\n  componentDidUpdate(prevProps) {\n    if (Object(_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* checkNotCached */ "e"])(this.props)) {\n      const {\n        groupID,\n        blogCt,\n        order\n      } = getImageViewUrlComposition(this.props);\n      const prevImageViewUrlComposition = getImageViewUrlComposition(prevProps);\n      const prevGroupID = prevImageViewUrlComposition.groupID;\n      const prevBlogCt = prevImageViewUrlComposition.blogCt;\n      const prevOrder = prevImageViewUrlComposition.order; // When the image changed\n\n      if (prevGroupID !== groupID || prevBlogCt !== blogCt || prevOrder !== order) {\n        this.setState({\n          group: Object(_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* getGroup */ "o"])(groupID),\n          groupID: groupID,\n          blogCt: blogCt,\n          order: Number(order),\n          imageViewURL: Object(_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* URLJoin */ "a"])(_modules_env__WEBPACK_IMPORTED_MODULE_2__[/* BASE_URL */ "d"], "image/", groupID, blogCt, order),\n          blogViewURL: Object(_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* URLJoin */ "a"])(_modules_env__WEBPACK_IMPORTED_MODULE_2__[/* BASE_URL */ "d"], "blog/", groupID, blogCt)\n        });\n        return;\n      }\n    }\n  }\n\n  render() {\n    const prevSrc = typeof this.props.location.state === "undefined" ? null : this.props.location.state.prevSrc;\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, this.isRender && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, _modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* isMobile */ "u"] && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_molecules_Headline__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"], {\n      title: `画像詳細`\n    }), !_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* isMobile */ "u"] && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_atoms_BackButton__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"], {\n      fixed: true,\n      className: "in-image-view"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contexts_DomContext__WEBPACK_IMPORTED_MODULE_9__[/* DomStateContext */ "b"].Consumer, null, domState => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contexts_DomContext__WEBPACK_IMPORTED_MODULE_9__[/* DomDispatchContext */ "a"].Consumer, null, domDispatch => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_10__[/* AuthStateContext */ "a"].Consumer, null, authState => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_organisms_ImageView__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"], {\n      group: this.state.group,\n      groupID: this.state.groupID,\n      blogCt: this.state.blogCt,\n      order: this.state.order,\n      imageViewURL: this.state.imageViewURL,\n      blogViewURL: this.state.blogViewURL,\n      prevSrc: prevSrc,\n      domState: domState,\n      domDispatch: domDispatch,\n      authState: authState\n    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "container mt-4"\n    }, _modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* isSmp */ "w"] ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_atoms_AdSense__WEBPACK_IMPORTED_MODULE_8__[/* SquareAds */ "b"], null) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_atoms_AdSense__WEBPACK_IMPORTED_MODULE_8__[/* LandscapeAds */ "a"], {\n      height: "100px"\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "container-fluid text-muted mt-3 list-container-fluid"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_organisms_List_ImageList__WEBPACK_IMPORTED_MODULE_4__[/* default */ "b"], {\n      type: "RELATED_IMAGES",\n      topComponent: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {\n        className: "text-center related-image-title " + (_modules_utils__WEBPACK_IMPORTED_MODULE_1__[/* isSmp */ "w"] ? "mt-2" : "")\n      }, "\\u95A2\\u9023\\u753B\\u50CF")\n    }))));\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_7__["withRouter"])(ImageViewTemplate));\nconst getImageViewUrlComposition = props => {\n  const groupID = props.match.params ? props.match.params.groupID : null;\n  const blogCt = props.match.params ? props.match.params.blogCt : null;\n  const order = props.match.params ? props.match.params.order : null;\n  return {\n    groupID,\n    blogCt,\n    order\n  };\n};\n\n//# sourceURL=webpack:///./src/components/templates/ImageViewTemplate.jsx?')}}]);