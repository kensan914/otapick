(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[12],{

/***/ "./src/components/pages/SettingsPage.jsx":
/*!***********************************************!*\
  !*** ./src/components/pages/SettingsPage.jsx ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./src/components/contexts/AuthContext.jsx\");\n/* harmony import */ var _settingsComponents_templates_FavMembersSettingsTemplate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../settingsComponents/templates/FavMembersSettingsTemplate */ \"./src/components/settingsComponents/templates/FavMembersSettingsTemplate.jsx\");\n/* harmony import */ var _settingsComponents_templates_SettingsTemplate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../settingsComponents/templates/SettingsTemplate */ \"./src/components/settingsComponents/templates/SettingsTemplate.jsx\");\n\n\n\n\n\nconst SettingsPage = props => {\n  const {\n    type\n  } = props;\n  const authState = Object(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_1__[\"useAuthState\"])();\n\n  if (authState.status !== \"Authenticated\") {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null); // TODO: not found\n  } // settings page追加の際、ここに追記\n\n\n  const [SETTINGS_COLLECTION] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])({\n    FAV_MEMBERS: {\n      title: \"推し設定\",\n      contentTemplate: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_settingsComponents_templates_FavMembersSettingsTemplate__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null),\n      url: \"/settings/fav-members/\"\n    },\n    TEST: {\n      title: \"テスト\",\n      contentTemplate: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_settingsComponents_templates_FavMembersSettingsTemplate__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null),\n      url: \"/settings/test/\"\n    }\n  });\n\n  if (type in SETTINGS_COLLECTION) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_settingsComponents_templates_SettingsTemplate__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n      SETTINGS_COLLECTION: SETTINGS_COLLECTION,\n      type: type\n    });\n  } else {\n    // 初期状態\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_settingsComponents_templates_SettingsTemplate__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n      SETTINGS_COLLECTION: SETTINGS_COLLECTION,\n      type: \"FAV_MEMBERS\"\n    });\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (SettingsPage);\n\n//# sourceURL=webpack:///./src/components/pages/SettingsPage.jsx?");

/***/ }),

/***/ "./src/components/settingsComponents/molecules/SettingsSelector.jsx":
/*!**************************************************************************!*\
  !*** ./src/components/settingsComponents/molecules/SettingsSelector.jsx ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactstrap */ \"./node_modules/reactstrap/es/index.js\");\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ \"./node_modules/@fortawesome/free-solid-svg-icons/index.es.js\");\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ \"./node_modules/@fortawesome/react-fontawesome/index.es.js\");\n\n\n\n\n/**\r\n * 設定画面の選択コンポーネント. imageUrlが指定されたitemは選択された際, 左にその画像が表示される.\r\n * keyが指定されていないitemsの場合, headerになる.\r\n * items: {key?: string, label: string, imageUrl?: string}[]\r\n * @param {*} props\r\n * @returns\r\n */\n\nconst SettingsSelector = props => {\n  const {\n    items,\n    setKey,\n    resetKey,\n    initKey = \"\",\n    height = 46,\n    blankLabel = \"選択されていません\"\n  } = props;\n  const [isOpen, setOpen] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(false);\n\n  const toggle = () => setOpen(!isOpen);\n\n  const [, setSelectedKey] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(initKey);\n  const [initItem] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(initKey ? items.find(elm => elm.key === initKey) : void 0);\n  const [selectedLabel, setSelectedLabel] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(initItem ? initItem.label : \"\");\n  const [selectedImageUrl, setSelectedImageUrl] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(initItem ? initItem.imageUrl : \"\");\n  const imageDiameter = height * 0.8;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"ButtonDropdown\"], {\n    className: \"settings-selector-container\",\n    direction: \"right\",\n    isOpen: isOpen,\n    toggle: toggle\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"DropdownToggle\"], {\n    className: \"settings-selector\",\n    style: {\n      height: height,\n      borderRadius: height * 0.44\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"row align-items-center px-2 pr-4\"\n  }, selectedLabel ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, selectedImageUrl && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"img\", {\n    className: \"settings-selector-image\",\n    width: imageDiameter,\n    height: imageDiameter,\n    src: selectedImageUrl,\n    alt: `${selectedLabel}のプロフィール画像`,\n    style: {\n      width: imageDiameter,\n      height: imageDiameter,\n      borderRadius: imageDiameter * 0.44\n    }\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"settings-selector-title\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"b\", null, selectedLabel))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"bold settings-selector-title\"\n  }, `- ${blankLabel} -`), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__[\"FontAwesomeIcon\"], {\n    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__[\"faAngleDown\"]\n  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"DropdownMenu\"], {\n    className: \"bold settings-selector-menu\" + (typeof props.members != \"undefined\" ? \"-members\" : \"\")\n  }, items.map((item, i) => {\n    if (typeof item.key !== \"undefined\") {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"DropdownItem\"], {\n        key: i,\n        onClick: () => {\n          setKey && setKey(item.key);\n\n          if (resetKey !== item.key) {\n            setSelectedKey(item.key);\n            setSelectedLabel(item.label);\n            setSelectedImageUrl(item.imageUrl);\n          } else {\n            setSelectedKey(\"\");\n            setSelectedLabel(\"\");\n            setSelectedImageUrl(\"\");\n          }\n        }\n      }, item.label);\n    } else {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {\n        key: i\n      }, i !== 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"DropdownItem\"], {\n        divider: true\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"DropdownItem\"], {\n        header: true\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"m-0\"\n      }, item.label)), i !== items.length && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_1__[\"DropdownItem\"], {\n        divider: true\n      }));\n    }\n  })));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (SettingsSelector);\n\n//# sourceURL=webpack:///./src/components/settingsComponents/molecules/SettingsSelector.jsx?");

/***/ }),

/***/ "./src/components/settingsComponents/molecules/SettingsSubmit.jsx":
/*!************************************************************************!*\
  !*** ./src/components/settingsComponents/molecules/SettingsSubmit.jsx ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../contexts/AuthContext */ \"./src/components/contexts/AuthContext.jsx\");\n/* harmony import */ var _modules_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../modules/axios */ \"./src/components/modules/axios.js\");\n\n\n\n\nconst SettingsSubmit = props => {\n  const {\n    url,\n    methodType = \"put\",\n    data,\n    title = \"保存\",\n    canSubmit = false,\n    thenCallback = () => void 0\n  } = props;\n  const authState = Object(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_1__[\"useAuthState\"])();\n  const [isSuccessSubmit, setIsSuccessSubmit] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(false);\n  const {\n    isLoading,\n    request\n  } = Object(_modules_axios__WEBPACK_IMPORTED_MODULE_2__[\"useAxios\"])(url, methodType, {\n    data: data,\n    thenCallback: res => {\n      thenCallback && thenCallback(res);\n      setIsSuccessSubmit(true);\n    },\n    catchCallback: err => {\n      setIsSuccessSubmit(false);\n    },\n    token: authState.token\n  });\n  let statusText = \"\";\n  if (canSubmit) statusText = \"未保存\";\n  if (isSuccessSubmit && !canSubmit) statusText = \"保存されました\";\n  if (isLoading) statusText = \"保存しています...\";\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: `d-flex row justify-content-end align-items-center py-3 settings-submit`\n  }, statusText && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"mx-3 font-weight-light settings-submit-status\"\n  }, statusText), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"button\", {\n    disabled: !canSubmit || isLoading,\n    className: `settings-submit-button rounded-pill px-4 py-2 ${canSubmit ? \"active\" : \"\"}`,\n    onClick: () => {\n      console.log(\"推した\");\n      request();\n    },\n    style: { ...(canSubmit ? {} : {\n        cursor: \"default\"\n      }),\n      ...(isLoading ? {\n        cursor: \"wait\"\n      } : {})\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"b\", null, title)));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (SettingsSubmit);\n\n//# sourceURL=webpack:///./src/components/settingsComponents/molecules/SettingsSubmit.jsx?");

/***/ }),

/***/ "./src/components/settingsComponents/molecules/settingsHeader.jsx":
/*!************************************************************************!*\
  !*** ./src/components/settingsComponents/molecules/settingsHeader.jsx ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst SettingsHeader = props => {\n  const {\n    title,\n    description,\n    className = \"\"\n  } = props;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: `settings-header ${className}`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h1\", {\n    style: {\n      fontSize: \"2rem\"\n    }\n  }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, description));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (SettingsHeader);\n\n//# sourceURL=webpack:///./src/components/settingsComponents/molecules/settingsHeader.jsx?");

/***/ }),

/***/ "./src/components/settingsComponents/templates/FavMembersSettingsTemplate.jsx":
/*!************************************************************************************!*\
  !*** ./src/components/settingsComponents/templates/FavMembersSettingsTemplate.jsx ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! reactstrap */ \"./node_modules/reactstrap/es/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _modules_env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../modules/env */ \"./src/components/modules/env.js\");\n/* harmony import */ var _molecules_settingsHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../molecules/settingsHeader */ \"./src/components/settingsComponents/molecules/settingsHeader.jsx\");\n/* harmony import */ var _molecules_SettingsSelector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../molecules/SettingsSelector */ \"./src/components/settingsComponents/molecules/SettingsSelector.jsx\");\n/* harmony import */ var _modules_axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../modules/axios */ \"./src/components/modules/axios.js\");\n/* harmony import */ var _modules_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../modules/utils */ \"./src/components/modules/utils.js\");\n/* harmony import */ var _molecules_Loader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../molecules/Loader */ \"./src/components/molecules/Loader.jsx\");\n/* harmony import */ var _molecules_SettingsSubmit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../molecules/SettingsSubmit */ \"./src/components/settingsComponents/molecules/SettingsSubmit.jsx\");\n/* harmony import */ var _contexts_ProfileContext__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../contexts/ProfileContext */ \"./src/components/contexts/ProfileContext.jsx\");\n\n\n\n\n\n\n\n\n\n\n\nconst FavMembersSettingsTemplate = () => {\n  const [favGroupIds, setFavGroupIds] = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])();\n  const [favMembers, setFavMembers] = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(); // {[groupId: GroupId]: ct}\n\n  const [canSubmit, setCanSubmit] = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(false);\n  const [putData, setPutData] = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])({\n    groups: [],\n    members: []\n  }); // { groups: GroupId[], members: {group_id: GroupId, ct: Ct}[] }\n\n  const profileState = Object(_contexts_ProfileContext__WEBPACK_IMPORTED_MODULE_9__[\"useProfileState\"])();\n  const profileDispatch = Object(_contexts_ProfileContext__WEBPACK_IMPORTED_MODULE_9__[\"useProfileDispatch\"])();\n  const [initPutData, setInitPutData] = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])({});\n\n  const genePutData = (_favGroupIds, _favMembers) => {\n    // favGroupが有効であるfavMemberのみputDataに含む\n    const shouldPutFavMembers = filterFavMembersAlsoFavGroup(_favGroupIds, _favMembers); // membersをput data用に整形\n\n    const putDataMembers = Object.entries(shouldPutFavMembers).map(([groupId, memberCt]) => ({\n      group_id: groupId,\n      ct: memberCt\n    }));\n    const _putData = {\n      groups: _favGroupIds,\n      members: putDataMembers\n    };\n    return _putData;\n  }; // groupを推していないfavMemberを除いたfavMembersを返す\n\n\n  const filterFavMembersAlsoFavGroup = (_favGroupIds, _favMembers) => {\n    return Object.fromEntries(Object.entries(_favMembers).filter(([groupIdStr]) => {\n      const groupId = groupIdStr - 0;\n      if (isNaN(groupId)) return false;\n      return _favGroupIds === null || _favGroupIds === void 0 ? void 0 : _favGroupIds.includes(groupId);\n    }));\n  };\n\n  const equalsPutData = (putData1, putData2) => {\n    if (!Object(_modules_utils__WEBPACK_IMPORTED_MODULE_6__[\"isObject\"])(putData1) || !Object(_modules_utils__WEBPACK_IMPORTED_MODULE_6__[\"isObject\"])(putData2)) {\n      return false;\n    }\n\n    if (Object.keys(putData1).length === 0 || Object.keys(putData2).length === 0) {\n      return false;\n    }\n\n    if (!Object(_modules_utils__WEBPACK_IMPORTED_MODULE_6__[\"equalsArray\"])(putData1.groups, putData2.groups, false)) return false;\n    if (putData1.members.length !== putData2.members.length) return false; // everyテスト. 全て合格でtrue\n\n    const everyResult = putData1.members.every(member1 => {\n      const someResult = putData2.members.some(member2 => {\n        return member1.group_id === member2.group_id && member1.ct === member2.ct;\n      });\n      if (!someResult) return false;else return true;\n    });\n    if (!everyResult) return false;\n    return true;\n  };\n\n  Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useEffect\"])(() => {\n    // favGroupIdsを初期化\n    let initGroupIds = [];\n\n    if (profileState.profile.favGroups) {\n      initGroupIds = profileState.profile.favGroups.map(g => g.groupId);\n    }\n\n    setFavGroupIds(initGroupIds); // favMembersを初期化\n\n    const initFavMembers = {};\n    let propertyNames = [];\n\n    if (profileState.profile.favMemberSakura) {\n      propertyNames = [...propertyNames, \"favMemberSakura\"];\n    }\n\n    if (profileState.profile.favMemberHinata) {\n      propertyNames = [...propertyNames, \"favMemberHinata\"];\n    }\n\n    propertyNames.forEach(propertyName => {\n      initFavMembers[profileState.profile[propertyName].belongingGroup] = profileState.profile[propertyName].ct;\n    });\n    setFavMembers(initFavMembers); // putDataの初期化\n\n    setInitPutData(genePutData(initGroupIds, initFavMembers));\n  }, [profileState.profile]); // putDataとcanSubmitの更新\n\n  Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useEffect\"])(() => {\n    if (typeof favGroupIds !== \"undefined\" && typeof favMembers !== \"undefined\") {\n      const _putData = genePutData(favGroupIds, favMembers);\n\n      setPutData(_putData);\n      setCanSubmit(!equalsPutData(initPutData, _putData));\n    }\n  }, [favMembers, favGroupIds === null || favGroupIds === void 0 ? void 0 : favGroupIds.length]);\n  const [members, setMembers] = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(); // {hinata: [Array(11), Array(9), Array(4)], sakura: [Array(21), Array(15)]}\n\n  Object(_modules_axios__WEBPACK_IMPORTED_MODULE_5__[\"useAxios\"])(Object(_modules_utils__WEBPACK_IMPORTED_MODULE_6__[\"URLJoin\"])(_modules_env__WEBPACK_IMPORTED_MODULE_2__[\"BASE_URL\"], \"members/\"), \"get\", {\n    thenCallback: res => {\n      const _members = Object(_modules_utils__WEBPACK_IMPORTED_MODULE_6__[\"deepCvtKeyFromSnakeToCamel\"])(res.data);\n\n      setMembers(_members);\n    },\n    shouldRequestDidMount: true\n  });\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_molecules_settingsHeader__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n    title: \"\\u63A8\\u3057\\u8A2D\\u5B9A\",\n    description: \"\\u597D\\u304D\\u306A\\u30B0\\u30EB\\u30FC\\u30D7\\u3084\\u63A8\\u3057\\u30E1\\u30F3\\u3092\\u8A2D\\u5B9A\\u3057\\u3001\\u753B\\u50CF\\u3084\\u30D6\\u30ED\\u30B0\\u306E\\u8868\\u793A\\u3092\\u30AB\\u30B9\\u30BF\\u30DE\\u30A4\\u30BA\\u3057\\u307E\\u3057\\u3087\\u3046\\u3002\\u3053\\u3053\\u3067\\u8A2D\\u5B9A\\u3057\\u305F\\u30B0\\u30EB\\u30FC\\u30D7\\u3084\\u30E1\\u30F3\\u30D0\\u30FC\\u306F\\u30D7\\u30ED\\u30D5\\u30A3\\u30FC\\u30EB\\u306B\\u8868\\u793A\\u3055\\u308C\\u307E\\u3059\\u3002\",\n    className: \"mb-5\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FavMembersEditor, {\n    members: members,\n    favGroupIds: favGroupIds,\n    setFavGroupIds: setFavGroupIds,\n    favMembers: favMembers,\n    setFavMembers: setFavMembers\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_molecules_SettingsSubmit__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {\n    url: Object(_modules_utils__WEBPACK_IMPORTED_MODULE_6__[\"URLJoin\"])(_modules_env__WEBPACK_IMPORTED_MODULE_2__[\"BASE_URL\"], \"fav-members/\"),\n    methodType: \"put\",\n    data: putData,\n    canSubmit: canSubmit,\n    thenCallback: res => {\n      const _profile = Object(_modules_utils__WEBPACK_IMPORTED_MODULE_6__[\"deepCvtKeyFromSnakeToCamel\"])(res.data);\n\n      profileDispatch({\n        type: \"SET_PROFILE\",\n        profile: _profile\n      });\n    }\n  }));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (FavMembersSettingsTemplate);\n\nconst FavMembersEditor = props => {\n  const {\n    members,\n    favGroupIds,\n    setFavGroupIds,\n    favMembers,\n    setFavMembers\n  } = props;\n  const [resetKey] = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(\"RESET\");\n\n  const handleSetFavMembers = (key, groupId) => {\n    const _favMembers = { ...favMembers\n    };\n\n    if (key === resetKey) {\n      if (groupId in _favMembers) {\n        delete _favMembers[groupId];\n      }\n    } else {\n      _favMembers[groupId] = key;\n    }\n\n    setFavMembers(_favMembers);\n  };\n\n  const toggleFavGroups = groupId => {\n    let _favGroupIds;\n\n    if (favGroupIds.includes(groupId)) {\n      _favGroupIds = favGroupIds.filter(elm => elm !== groupId);\n    } else {\n      _favGroupIds = [...favGroupIds, groupId];\n    }\n\n    setFavGroupIds(_favGroupIds);\n  };\n\n  const geneSettingsSelectorItems = (members, groupKey) => {\n    const memberListByG = members[groupKey]; // ex) [Array(11), Array(9), Array(4)]\n\n    let items = [{\n      key: resetKey,\n      label: \"リセット\"\n    }];\n    memberListByG.forEach((memberListByGeneration, i) =>\n    /* Array(11) */\n    {\n      const generation = i + 1;\n      const headerItem = {\n        label: `${generation}期生`\n      };\n      items.push(headerItem);\n      const memberItems = memberListByGeneration.map(member => {\n        return {\n          key: member.ct,\n          label: member.fullKanji,\n          imageUrl: member.image\n        };\n      });\n      items.push(...memberItems);\n    });\n    return items;\n  };\n\n  return typeof favGroupIds !== \"undefined\" && typeof favMembers !== \"undefined\" && Object.values(_modules_env__WEBPACK_IMPORTED_MODULE_2__[\"GROUPS\"]).map((groupObj, i) => {\n    const isActive = favGroupIds.includes(groupObj.id); // 櫻推し && 欅推しの時、欅Collapseをopenしない\n\n    const shouldOpenCollapse = groupObj.key !== \"keyaki\" || !favGroupIds.includes(\"1\");\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      key: i,\n      className: \"fav-members-editor-item\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"button\", {\n      className: `fav-groups-button rounded-pill px-3 py-2 ${isActive ? \"active \" + groupObj.key : \"\"}`,\n      onClick: () => {\n        toggleFavGroups(groupObj.id);\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"b\", null, groupObj.name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_0__[\"Collapse\"], {\n      isOpen: isActive && shouldOpenCollapse\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: \"fav-members-editor-body px-4 pt-3 pb-1\"\n    }, groupObj.key !== \"keyaki\" ? members ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h6\", null, \"\\u63A8\\u3057\\u30E1\\u30F3\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_molecules_SettingsSelector__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n      items: geneSettingsSelectorItems(members, groupObj.key),\n      setKey: key => {\n        handleSetFavMembers(key, groupObj.id);\n      },\n      resetKey: resetKey,\n      height: 70,\n      blankLabel: \"箱推し\",\n      initKey: String(groupObj.id) in favMembers ? favMembers[groupObj.id] : \"\"\n    })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_molecules_Loader__WEBPACK_IMPORTED_MODULE_7__[\"HorizontalLoader\"], null) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", null, \"\\u6B05\\u574246\\u306E\\u63A8\\u3057\\u30E1\\u30F3\\u306F\\u3001\\u6AFB\\u574246\\u306E\\u63A8\\u3057\\u3092\\u6709\\u52B9\\u306B\\u3059\\u308B\\u3053\\u3068\\u3067\\u8A2D\\u5B9A\\u3067\\u304D\\u307E\\u3059\\u3002\"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"hr\", null));\n  });\n};\n\n//# sourceURL=webpack:///./src/components/settingsComponents/templates/FavMembersSettingsTemplate.jsx?");

/***/ }),

/***/ "./src/components/settingsComponents/templates/SettingsTemplate.jsx":
/*!**************************************************************************!*\
  !*** ./src/components/settingsComponents/templates/SettingsTemplate.jsx ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ \"./node_modules/react-router-dom/esm/react-router-dom.js\");\n\n\n\nconst SettingsTemplate = props => {\n  const {\n    SETTINGS_COLLECTION,\n    type\n  } = props;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"container text-muted my-4\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"row\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"col-3\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"settings-menu-container p-2 shadow-sm\"\n  }, Object.entries(SETTINGS_COLLECTION).map(([_type, settingsObj], i) => {\n    let isActive = type === _type;\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__[\"Link\"], {\n      to: settingsObj.url,\n      key: i,\n      className: `d-flex settings-menu-item my-1 py-1 px-2 ${isActive ? \"active\" : \"\"}`,\n      style: {\n        textDecoration: \"none\"\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"b\", null, settingsObj.title));\n  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"col-9\"\n  }, SETTINGS_COLLECTION[type].contentTemplate)));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (SettingsTemplate);\n\n//# sourceURL=webpack:///./src/components/settingsComponents/templates/SettingsTemplate.jsx?");

/***/ })

}]);