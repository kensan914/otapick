(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"./src/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo.jsx":
/*!******************************************************************************************!*\
  !*** ./src/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo.jsx ***!
  \******************************************************************************************/
/*! exports provided: BlogSearchListInfo */
/*! exports used: BlogSearchListInfo */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BlogSearchListInfo; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/utils */ "./src/utils/index.js");\n\n\nconst BlogSearchListInfo = props => {\n  const {\n    groupKey,\n    infoTitle,\n    numOfHit\n  } = props;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: `card otapick-card2 ${_utils__WEBPACK_IMPORTED_MODULE_1__[/* isSmp */ "t"] ? "smp mb-3" : _utils__WEBPACK_IMPORTED_MODULE_1__[/* isMobile */ "r"] ? "mb-3 mt-1" : "my-4"} ${groupKey}`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: "card-body px-4 px-sm-5 py-4"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: "row mx-2 justify-content-between"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {\n    className: "my-auto d-flex align-items-center"\n  }, !infoTitle ? "\\u00A0" : infoTitle)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", {\n    className: "info-hr"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: "row justify-content-between"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: "col-12 col-md-6 col-lg-7 col-xl-8"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: "info-description my-1 my-sm-0"\n  }, "\\u691C\\u7D22\\u7D50\\u679C\\uFF08", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, numOfHit), "\\u4EF6\\uFF09")))));\n};\n\n//# sourceURL=webpack:///./src/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo.jsx?')},"./src/pages/BlogViewPage.jsx":
/*!************************************************!*\
  !*** ./src/pages/BlogViewPage.jsx + 3 modules ***!
  \************************************************/
/*! exports provided: default */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/@fortawesome/free-solid-svg-icons/index.es.js */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/@fortawesome/react-fontawesome/index.es.js */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/axios/index.js (<- Module is not an ECMAScript module) */
/*! ModuleConcatenation bailout: Cannot concat with ./src/components/atoms/NotFound.jsx */
/*! ModuleConcatenation bailout: Cannot concat with ./src/components/atoms/TooltipComponent.jsx */
/*! ModuleConcatenation bailout: Cannot concat with ./src/components/molecules/Headline.jsx */
/*! ModuleConcatenation bailout: Cannot concat with ./src/components/molecules/ImageCard.jsx */
/*! ModuleConcatenation bailout: Cannot concat with ./src/components/molecules/Loader.jsx */
/*! ModuleConcatenation bailout: Cannot concat with ./src/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo.jsx */
/*! ModuleConcatenation bailout: Cannot concat with ./src/constants/env.js */
/*! ModuleConcatenation bailout: Cannot concat with ./src/contexts/DomContext.jsx */
/*! ModuleConcatenation bailout: Cannot concat with ./src/hooks/useAxios.js */
/*! ModuleConcatenation bailout: Cannot concat with ./src/hooks/useCacheRoute.js */
/*! ModuleConcatenation bailout: Cannot concat with ./src/hooks/useMeta.js */
/*! ModuleConcatenation bailout: Cannot concat with ./src/hooks/useView.js */
/*! ModuleConcatenation bailout: Cannot concat with ./src/utils/index.js */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/file-saver/dist/FileSaver.min.js (<- Module is not an ECMAScript module) */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/react-cookie/es6/index.js */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/react-masonry-component/lib/index.js (<- Module is not an ECMAScript module) */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/react-router-dom/esm/react-router-dom.js (<- Module is referenced from these modules with unsupported syntax: ./node_modules/react-router-cache-route/lib/index.js (referenced with cjs require)) */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/react/index.js (<- Module is not an ECMAScript module) */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// EXTERNAL MODULE: ./node_modules/react/index.js\nvar react = __webpack_require__("./node_modules/react/index.js");\nvar react_default = /*#__PURE__*/__webpack_require__.n(react);\n\n// EXTERNAL MODULE: ./node_modules/react-cookie/es6/index.js + 8 modules\nvar es6 = __webpack_require__("./node_modules/react-cookie/es6/index.js");\n\n// EXTERNAL MODULE: ./src/contexts/DomContext.jsx + 5 modules\nvar DomContext = __webpack_require__("./src/contexts/DomContext.jsx");\n\n// EXTERNAL MODULE: ./src/hooks/useAxios.js\nvar useAxios = __webpack_require__("./src/hooks/useAxios.js");\n\n// EXTERNAL MODULE: ./src/hooks/useCacheRoute.js\nvar useCacheRoute = __webpack_require__("./src/hooks/useCacheRoute.js");\n\n// EXTERNAL MODULE: ./src/components/molecules/Headline.jsx\nvar Headline = __webpack_require__("./src/components/molecules/Headline.jsx");\n\n// EXTERNAL MODULE: ./node_modules/react-router-dom/esm/react-router-dom.js\nvar react_router_dom = __webpack_require__("./node_modules/react-router-dom/esm/react-router-dom.js");\n\n// EXTERNAL MODULE: ./node_modules/@fortawesome/free-solid-svg-icons/index.es.js\nvar index_es = __webpack_require__("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");\n\n// EXTERNAL MODULE: ./node_modules/@fortawesome/react-fontawesome/index.es.js\nvar react_fontawesome_index_es = __webpack_require__("./node_modules/@fortawesome/react-fontawesome/index.es.js");\n\n// EXTERNAL MODULE: ./src/utils/index.js\nvar utils = __webpack_require__("./src/utils/index.js");\n\n// EXTERNAL MODULE: ./src/constants/env.js\nvar env = __webpack_require__("./src/constants/env.js");\n\n// EXTERNAL MODULE: ./src/components/atoms/TooltipComponent.jsx\nvar TooltipComponent = __webpack_require__("./src/components/atoms/TooltipComponent.jsx");\n\n// CONCATENATED MODULE: ./src/components/templates/BlogViewTemplate/organisms/BlogViewInfo.jsx\n\n\n\n\n\n\n\nconst BlogViewInfo = props => {\n  const {\n    groupKey,\n    infoTitle,\n    writer,\n    postDate,\n    numOfViews,\n    numOfDownloads,\n    officialUrl\n  } = props;\n  let officialLinkTitle;\n  Object.values(env["m" /* GROUPS */]).forEach(groupObj => {\n    if (groupObj.key === groupKey) officialLinkTitle = groupObj.domain;\n  });\n  return /*#__PURE__*/react_default.a.createElement("div", {\n    className: `card otapick-card2 ${utils["t" /* isSmp */] ? "smp mb-3" : utils["r" /* isMobile */] ? "mb-3 mt-1" : "my-4"} ${groupKey}`\n  }, /*#__PURE__*/react_default.a.createElement("div", {\n    className: "card-body px-4 px-sm-5 py-4"\n  }, infoTitle.length > 0 ? infoTitle.length > 50 ? /*#__PURE__*/react_default.a.createElement("h3", {\n    className: "smaller"\n  }, infoTitle) : /*#__PURE__*/react_default.a.createElement("h3", null, infoTitle) : /*#__PURE__*/react_default.a.createElement("h3", null, "\\u00A0"), /*#__PURE__*/react_default.a.createElement("div", {\n    className: "row download-info mt-3"\n  }, !Object.keys(writer).length ? /*#__PURE__*/react_default.a.createElement(react_router_dom["Link"], {\n    to: "",\n    className: `info-description ml-3 small ${groupKey}`\n  }, "\\u00A0") : /*#__PURE__*/react_default.a.createElement(react_router_dom["Link"], {\n    to: writer.url["blogs"],\n    className: `info-description ml-3 small ${groupKey}`\n  }, !writer.name ? "\\u00A0" : writer.name), /*#__PURE__*/react_default.a.createElement("p", {\n    className: "info-description ml-3 small mb-0"\n  }, postDate)), /*#__PURE__*/react_default.a.createElement("hr", {\n    className: "info-hr"\n  }), /*#__PURE__*/react_default.a.createElement("div", {\n    className: "row ml-2 ml-sm-3"\n  }, /*#__PURE__*/react_default.a.createElement("div", {\n    className: "row col-12 col-sm-7 col-md-8 col-lg-9 col-xl-10 info-description"\n  }, /*#__PURE__*/react_default.a.createElement("div", {\n    className: "d-flex align-items-center"\n  }, /*#__PURE__*/react_default.a.createElement(TooltipComponent["a" /* default */], {\n    title: "\\u95B2\\u89A7\\u6570"\n  }, /*#__PURE__*/react_default.a.createElement("div", {\n    className: "d-flex align-items-center",\n    id: "num-of-views-icon"\n  }, /*#__PURE__*/react_default.a.createElement(react_fontawesome_index_es["a" /* FontAwesomeIcon */], {\n    icon: index_es["q" /* faEye */],\n    style: {\n      color: "gray"\n    }\n  })))), "\\u00A0", /*#__PURE__*/react_default.a.createElement("div", {\n    className: ""\n  }, numOfViews), /*#__PURE__*/react_default.a.createElement("div", {\n    className: "d-flex align-items-center"\n  }, /*#__PURE__*/react_default.a.createElement(TooltipComponent["a" /* default */], {\n    title: "\\u7DCF\\u30C0\\u30A6\\u30F3\\u30ED\\u30FC\\u30C9\\u6570"\n  }, /*#__PURE__*/react_default.a.createElement("div", {\n    className: "d-flex align-items-center ml-3",\n    id: "num-of-downloads-icon"\n  }, /*#__PURE__*/react_default.a.createElement(react_fontawesome_index_es["a" /* FontAwesomeIcon */], {\n    icon: index_es["l" /* faDownload */],\n    style: {\n      color: "gray"\n    }\n  })))), "\\u00A0", /*#__PURE__*/react_default.a.createElement("div", {\n    className: ""\n  }, numOfDownloads)), /*#__PURE__*/react_default.a.createElement("div", {\n    className: "col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 info-description px-0 mt-2 mt-sm-0"\n  }, /*#__PURE__*/react_default.a.createElement(TooltipComponent["a" /* default */], {\n    title: "\\u516C\\u5F0F\\u30D6\\u30ED\\u30B0\\u3067\\u78BA\\u8A8D"\n  }, /*#__PURE__*/react_default.a.createElement("a", {\n    href: officialUrl,\n    className: groupKey,\n    target: "_blank",\n    rel: "noreferrer",\n    id: "officialLink"\n  }, /*#__PURE__*/react_default.a.createElement("div", {\n    className: "download-official-a"\n  }, /*#__PURE__*/react_default.a.createElement(react_fontawesome_index_es["a" /* FontAwesomeIcon */], {\n    icon: index_es["p" /* faExternalLinkAlt */]\n  }), "\\u00A0", officialLinkTitle)))))));\n};\n// EXTERNAL MODULE: ./node_modules/axios/index.js\nvar axios = __webpack_require__("./node_modules/axios/index.js");\nvar axios_default = /*#__PURE__*/__webpack_require__.n(axios);\n\n// EXTERNAL MODULE: ./node_modules/file-saver/dist/FileSaver.min.js\nvar FileSaver_min = __webpack_require__("./node_modules/file-saver/dist/FileSaver.min.js");\n\n// EXTERNAL MODULE: ./node_modules/react-masonry-component/lib/index.js\nvar lib = __webpack_require__("./node_modules/react-masonry-component/lib/index.js");\nvar lib_default = /*#__PURE__*/__webpack_require__.n(lib);\n\n// EXTERNAL MODULE: ./src/components/molecules/ImageCard.jsx\nvar ImageCard = __webpack_require__("./src/components/molecules/ImageCard.jsx");\n\n// CONCATENATED MODULE: ./src/components/organisms/BlogView.jsx\n\n\n\n\n\n\n\n\n\n\n\nconst BlogView = props => {\n  const {\n    group,\n    images,\n    blogApiUrl,\n    incrementNumOfDownloads,\n    putDownload,\n    mode,\n    blogUrlPath,\n    officialUrl,\n    writer,\n    blogCt,\n    blogTitle,\n    groupId,\n    cookies\n  } = props;\n  const [isCheckAll, setIsCheckAll] = Object(react["useState"])(false);\n  const [checkList, setCheckList] = Object(react["useState"])(Array(images.length).fill(false));\n  const [isShowAlert, setIsShowAlert] = Object(react["useState"])(false);\n  const domDispatch = Object(DomContext["c" /* useDomDispatch */])();\n  const location = Object(react_router_dom["useLocation"])();\n\n  const handleSubmit = e => {\n    e.preventDefault();\n\n    if (checkList.includes(true)) {\n      let orderList = [];\n\n      for (const [index, val] of checkList.entries()) {\n        if (val) orderList.push(index);\n      }\n\n      axios_default.a.post(blogApiUrl, orderList, {\n        headers: {\n          "X-CSRFToken": cookies.get("csrftoken")\n        },\n        responseType: "blob"\n      }).then(res => {\n        domDispatch({\n          type: "OPEN_GLOBAL_MODAL",\n          globalModalId: "ImageDownloadedModal"\n        });\n        setIsCheckAll(false);\n        setCheckList(Array(images.length).fill(false));\n        setIsShowAlert(false);\n        const blob = new Blob([res.data], {\n          type: res.data.type\n        });\n        const fileName = res.headers["content-disposition"].match(/filename="(.*)"/)[1];\n        Object(FileSaver_min["saveAs"])(blob, fileName);\n        incrementNumOfDownloads(-1, orderList.length);\n      });\n    } else {\n      if (!isShowAlert) setIsShowAlert(true);\n    }\n  };\n\n  const handleAllCheckChange = e => {\n    const target = e.target;\n    const value = target.checked;\n    setIsCheckAll(value);\n    setCheckList([...checkList].fill(value));\n  };\n\n  const handleCheckChange = e => {\n    const target = e.target;\n    const value = target.checked;\n    const _checkList = [...checkList];\n    _checkList[target.name] = value;\n    setCheckList(_checkList);\n  };\n\n  const changeCheck = order => {\n    const _checkList = [...checkList];\n    _checkList[order] = !_checkList[order];\n    setCheckList(_checkList);\n  };\n\n  const loadOriginalImage = () => {\n    let imageObjects = [];\n\n    for (const [index, image] of images.entries()) {\n      if (mode === "VIEW") {// view\n      } else if (mode === "DL") {\n        imageObjects.push(new Image());\n        imageObjects[index].onload = setTimeout(() => {\n          const blogImageID = geneImageID(image.order);\n          const targetImage = document.getElementById(blogImageID);\n          targetImage.style.backgroundImage = "url(" + imageObjects[index].src + ")";\n        }, env["j" /* DELAY_TIME */]);\n        imageObjects[index].src = image.src["originals"];\n      }\n    }\n  };\n\n  Object(react["useEffect"])(() => {\n    loadOriginalImage();\n  }, []);\n  Object(react["useEffect"])(() => {\n    loadOriginalImage();\n  }, [mode]); // cache導入でimageIDが複数存在しうるため（今のところBlogViewはcache対象外であるが）\n\n  const geneImageID = order => `blog-image-${groupId}_${blogCt}_${order}_${location.key}`;\n\n  if (mode === "VIEW") {\n    const options = {\n      itemSelector: ".grid-item",\n      transitionDuration: 0,\n      stagger: 0\n    };\n    return /*#__PURE__*/react_default.a.createElement("div", {\n      className: "container"\n    }, utils["r" /* isMobile */] && /*#__PURE__*/react_default.a.createElement("div", {\n      className: "alert alert-success mb-1",\n      role: "alert",\n      style: {\n        borderRadius: "1rem",\n        fontSize: 14\n      }\n    }, "\\u753B\\u50CF\\u3092\\u9577\\u62BC\\u3057\\u3057\\u3066\\u4FDD\\u5B58\\u3092\\u304A\\u3053\\u306A\\u3063\\u3066\\u304F\\u3060\\u3055\\u3044"), /*#__PURE__*/react_default.a.createElement(lib_default.a, {\n      options: options,\n      className: "mt-3 image-list-in-blog-view"\n    }, images.map(({\n      src,\n      url,\n      order,\n      isFavorite,\n      width,\n      height\n    }) => /*#__PURE__*/react_default.a.createElement("div", {\n      key: order,\n      className: "grid-item col-12 col-sm-6 my-2 my-sm-3 px-0 px-sm-2"\n    }, /*#__PURE__*/react_default.a.createElement(ImageCard["a" /* default */], {\n      groupId: groupId,\n      groupKey: group,\n      blogCt: blogCt,\n      blogTitle: blogTitle,\n      srcCollection: src,\n      urlPath: url,\n      blogUrl: blogUrlPath,\n      officialUrl: officialUrl,\n      writer: writer,\n      priorityImageId: geneImageID(order),\n      order: order,\n      initIsFavorite: isFavorite,\n      width: width,\n      height: height,\n      shouldLoadOriginal: true,\n      didMountImage: () => {\n        const blogImageID = geneImageID(order);\n        const targetImage = document.getElementById(blogImageID);\n        Object(utils["b" /* addLongPressEventListeners */])(targetImage, () => putDownload(order));\n      }\n    })))));\n  } else if (mode === "DL") {\n    return /*#__PURE__*/react_default.a.createElement(react_default.a.Fragment, null, /*#__PURE__*/react_default.a.createElement("form", {\n      onSubmit: e => handleSubmit(e)\n    }, /*#__PURE__*/react_default.a.createElement("div", {\n      className: "col-md-3 col-lg-2 ml-auto",\n      style: {\n        width: 200\n      }\n    }, /*#__PURE__*/react_default.a.createElement("div", {\n      className: "custom-control custom-checkbox"\n    }, /*#__PURE__*/react_default.a.createElement("input", {\n      name: "allCheck",\n      type: "checkbox",\n      className: "custom-control-input",\n      id: "allCheck",\n      checked: isCheckAll,\n      onChange: e => handleAllCheckChange(e)\n    }), /*#__PURE__*/react_default.a.createElement("label", {\n      className: "custom-control-label",\n      htmlFor: "allCheck"\n    }, "\\u3059\\u3079\\u3066\\u9078\\u629E"))), /*#__PURE__*/react_default.a.createElement("div", {\n      className: "container my-4"\n    }, /*#__PURE__*/react_default.a.createElement("div", {\n      className: "row text-center"\n    }, images.map((image, index) => /*#__PURE__*/react_default.a.createElement("div", {\n      key: index,\n      className: "col-6 col-md-4 col-xl-3 mb-5"\n    }, /*#__PURE__*/react_default.a.createElement("div", {\n      style: {\n        cursor: "pointer"\n      },\n      onClick: () => changeCheck(image.order)\n    }, /*#__PURE__*/react_default.a.createElement("div", {\n      className: group\n    }, /*#__PURE__*/react_default.a.createElement("div", {\n      className: "thumbnail img-thumbnail mx-auto " + (checkList[image.order] ? "checked" : "") // id={`image_${image.order}`}\n      ,\n      id: geneImageID(image.order),\n      style: {\n        background: `-webkit-image-set( url(${image.src["250x"]}) 1x, url(${image.src["500x"]}) 2x )`,\n        backgroundSize: "cover",\n        backgroundPosition: "center"\n      }\n    }, /*#__PURE__*/react_default.a.createElement("input", {\n      className: "save_img_checkbox",\n      type: "checkbox",\n      onChange: e => handleCheckChange(e),\n      name: image.order,\n      checked: checkList[image.order]\n    })))))))), isShowAlert && /*#__PURE__*/react_default.a.createElement("div", {\n      className: "alert alert-danger py-2 mb-5 mt-0",\n      role: "alert",\n      style: {\n        borderRadius: "1rem"\n      }\n    }, "\\u753B\\u50CF\\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002"), /*#__PURE__*/react_default.a.createElement("div", {\n      className: "mx-auto mb-5",\n      style: {\n        width: 150\n      }\n    }, /*#__PURE__*/react_default.a.createElement("button", {\n      type: "submit",\n      className: "gradient-btn " + group,\n      style: {\n        width: 150\n      }\n    }, /*#__PURE__*/react_default.a.createElement("b", null, "\\u4FDD\\u5B58")))));\n  }\n};\n\n/* harmony default export */ var organisms_BlogView = (Object(es6["a" /* withCookies */])(BlogView));\n// EXTERNAL MODULE: ./src/components/molecules/Loader.jsx\nvar Loader = __webpack_require__("./src/components/molecules/Loader.jsx");\n\n// EXTERNAL MODULE: ./src/components/atoms/NotFound.jsx\nvar NotFound = __webpack_require__("./src/components/atoms/NotFound.jsx");\n\n// EXTERNAL MODULE: ./src/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo.jsx\nvar BlogSearchListInfo = __webpack_require__("./src/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo.jsx");\n\n// CONCATENATED MODULE: ./src/components/templates/BlogViewTemplate/index.jsx\n\n\n\n\n\n\n\nconst BlogViewTemplate = props => {\n  const {\n    mode,\n    changeMode,\n    groupKey,\n    addedNumOfViewsOnlyBlog,\n    addedNumOfDownloadsOnlyBlog,\n    images,\n    blog,\n    status,\n    requestPutDownloadOnlyMobile,\n    incrementNumOfDownloads,\n    blogApiUrl,\n    blogUrlPath\n  } = props;\n  let contents;\n\n  if (status === "") {\n    contents = /*#__PURE__*/react_default.a.createElement(Loader["b" /* LoaderScreen */], {\n      type: "horizontal"\n    });\n  } else if (status === "success") {\n    if (images.length > 0) {\n      contents = /*#__PURE__*/react_default.a.createElement(organisms_BlogView, {\n        group: groupKey,\n        images: images,\n        blogApiUrl: blogApiUrl,\n        incrementNumOfDownloads: (order, num) => {\n          incrementNumOfDownloads(order, num);\n        },\n        putDownload: order => {\n          requestPutDownloadOnlyMobile(order);\n        },\n        mode: mode,\n        blogUrlPath: blogUrlPath,\n        officialUrl: blog.officialUrl,\n        writer: blog.writer,\n        blogCt: blog.blogCt,\n        blogTitle: blog.title,\n        groupId: blog.groupId\n      });\n    } else {\n      contents = /*#__PURE__*/react_default.a.createElement(NotFound["c" /* NotFoundMessage */], {\n        type: "image",\n        margin: true\n      });\n    }\n  } else if (status === "blog_not_found" || status === "get_image_failed") {\n    contents = /*#__PURE__*/react_default.a.createElement(NotFound["c" /* NotFoundMessage */], {\n      type: "blogFailed",\n      margin: true\n    });\n  }\n\n  return /*#__PURE__*/react_default.a.createElement("div", {\n    className: "container mt-3 text-muted"\n  }, /*#__PURE__*/react_default.a.createElement(Headline["a" /* default */], {\n    title: "\\u30D6\\u30ED\\u30B0\\u8A73\\u7D30",\n    type: "blogView",\n    mode: mode,\n    changeMode: mode => changeMode(mode)\n  }), status !== "blog_not_found" ? /*#__PURE__*/react_default.a.createElement(BlogViewInfo, {\n    groupKey: groupKey,\n    infoTitle: blog ? blog.title : "",\n    writer: blog ? blog.writer : {},\n    postDate: blog ? blog.postDate : "",\n    officialUrl: blog ? blog.officialUrl : "",\n    numOfViews: blog ? blog.numOfViews + addedNumOfViewsOnlyBlog : 0,\n    numOfDownloads: blog ? blog.numOfDownloads + addedNumOfDownloadsOnlyBlog : 0\n  }) : /*#__PURE__*/react_default.a.createElement(BlogSearchListInfo["a" /* BlogSearchListInfo */], {\n    groupKey: groupKey,\n    infoTitle: blog.title,\n    numOfHit: 0\n  }), contents);\n};\n// EXTERNAL MODULE: ./src/hooks/useView.js\nvar useView = __webpack_require__("./src/hooks/useView.js");\n\n// EXTERNAL MODULE: ./src/hooks/useMeta.js\nvar useMeta = __webpack_require__("./src/hooks/useMeta.js");\n\n// CONCATENATED MODULE: ./src/pages/BlogViewPage.jsx\n\n\n\n\n\n\n\n\n\nconst BlogViewPage = props => {\n  const {\n    cookies\n  } = props;\n  const {\n    isCachedRoute\n  } = Object(useCacheRoute["a" /* useCacheRoute */])();\n  const csrftoken = cookies.get("csrftoken");\n  const domState = Object(DomContext["d" /* useDomState */])();\n  const domDispatch = Object(DomContext["c" /* useDomDispatch */])();\n  const {\n    groupId,\n    blogCt,\n    groupKey\n  } = Object(useView["b" /* useViewMatchParams */])();\n  const {\n    blogApiUrl,\n    blogUrlPath,\n    geneImageApiUrl\n  } = Object(useView["d" /* useViewUrl */])(groupId, blogCt);\n  const [mode, setMode] = Object(react["useState"])("VIEW"); // "VIEW" | "DL"\n\n  const [accessedBlogId] = Object(react["useState"])(`${groupId}_${blogCt}`);\n  const {\n    setMeta\n  } = Object(useMeta["a" /* useMeta */])();\n\n  const setMetaVerView = (status, blogTitle, blogWriter) => {\n    switch (status) {\n      case "success":\n        setMeta(`${blogTitle}(${blogWriter})｜ブログ詳細`, `${blogWriter}のブログ「${blogTitle}」です。`);\n        break;\n\n      case "get_image_failed":\n        setMeta("Not Found Image", "");\n        break;\n\n      case "blog_not_found":\n        setMeta("Not Found Blog", "");\n        break;\n\n      case "accepted":\n        setMeta("画像取得中", "");\n        break;\n\n      default:\n        throw new Error(`the status "${status} is unexpected."`);\n    }\n  };\n\n  const [images, setImages, blog, status, viewKey, downloadKey, isReadyView] = Object(useView["a" /* useView */])(blogApiUrl, setMetaVerView);\n  const {\n    addedNumOfViewsOnlyBlog,\n    incrementNumOfViews,\n    addedNumOfDownloadsOnlyBlog,\n    incrementNumOfDownloads\n  } = Object(useView["c" /* useViewNum */])(images, setImages);\n\n  const changeMode = _mode => {\n    if (_mode !== mode) {\n      if (_mode === "VIEW" || _mode === "DL") {\n        setMode(_mode);\n      } else {\n        throw new Error(`the mode "${_mode} is unexpected."`);\n      }\n    }\n  };\n\n  const {\n    request: requestPutView\n  } = Object(useAxios["c" /* useAxios */])(blogApiUrl, "put", {\n    data: {\n      action: "view",\n      key: viewKey\n    },\n    csrftoken: csrftoken,\n    thenCallback: res => {\n      if (res.data["status"] == "success") {\n        incrementNumOfViews(-1);\n      }\n    },\n    limitRequest: 1 // 再送防止\n\n  });\n\n  const requestPutDownloadOnlyMobile = _order => {\n    const imageApiUrl = geneImageApiUrl(_order);\n    Object(useAxios["b" /* requestAxios */])(imageApiUrl, "put", {\n      data: {\n        action: "download",\n        key: downloadKey\n      },\n      csrftoken: csrftoken,\n      thenCallback: res => {\n        if (res.data["status"] == "success") {\n          incrementNumOfDownloads(-1);\n        }\n      }\n    });\n  };\n\n  Object(react["useEffect"])(() => {\n    // image viewの準備ができた\n    if (!isCachedRoute && isReadyView) {\n      var _blog$writer;\n\n      if (!domState.accessedBlogs.includes(accessedBlogId)) {\n        requestPutView();\n        domDispatch({\n          type: "ACCESS_TO_BLOG",\n          blogId: accessedBlogId\n        });\n      }\n\n      if (blog !== null && blog !== void 0 && (_blog$writer = blog.writer) !== null && _blog$writer !== void 0 && _blog$writer.name) {\n        // update meta\n        setMetaVerView(status, blog.title, blog.writer.name);\n      }\n    }\n  }, [isCachedRoute, isReadyView]);\n  return /*#__PURE__*/react_default.a.createElement(BlogViewTemplate, {\n    mode: mode,\n    changeMode: changeMode,\n    groupKey: groupKey,\n    addedNumOfViewsOnlyBlog: addedNumOfViewsOnlyBlog,\n    addedNumOfDownloadsOnlyBlog: addedNumOfDownloadsOnlyBlog,\n    images: images,\n    blog: blog,\n    status: status,\n    requestPutDownloadOnlyMobile: requestPutDownloadOnlyMobile,\n    incrementNumOfDownloads: incrementNumOfDownloads,\n    blogApiUrl: blogApiUrl,\n    blogUrlPath: blogUrlPath\n  });\n};\n\n/* harmony default export */ var pages_BlogViewPage = __webpack_exports__["default"] = (Object(es6["a" /* withCookies */])(BlogViewPage));\n\n//# sourceURL=webpack:///./src/pages/BlogViewPage.jsx_+_3_modules?')}}]);