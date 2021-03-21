(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"./src/components/atoms/BackButton.jsx":
/*!*********************************************!*\
  !*** ./src/components/atoms/BackButton.jsx ***!
  \*********************************************/
/*! exports provided: default */
/*! exports used: default */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/esm/react-router.js");\n/* harmony import */ var _modules_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/utils */ "./src/components/modules/utils.js");\n/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");\n\n\n\n\n\n\n\nclass BackButton extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(...args) {\n    var _temp;\n\n    return _temp = super(...args), this.goBack = () => {\n      if (_modules_utils__WEBPACK_IMPORTED_MODULE_2__[/* initLocationKey */ "t"] === this.props.location.key) {\n        this.props.history.push("/");\n      } else {\n        history.back();\n      }\n    }, _temp;\n  }\n\n  render() {\n    if (this.props.mini) {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_3__[/* Button */ "a"], {\n        className: "rounded-circle transparent-button-mobile " + (_modules_utils__WEBPACK_IMPORTED_MODULE_2__[/* isMobile */ "u"] ? "mobile " : " ") + (this.props.className ? this.props.className : ""),\n        id: "mobile-back-button",\n        onClick: this.goBack\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__[/* FontAwesomeIcon */ "a"], {\n        icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__[/* faChevronLeft */ "h"]\n      }));\n    } else if (this.props.fixed) {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {\n        onClick: this.goBack,\n        className: "btn btn-light rounded-circle p-0 otapick-back-button-fixed shadow-sm " + (this.props.className ? this.props.className : "")\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__[/* FontAwesomeIcon */ "a"], {\n        icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__[/* faArrowLeft */ "b"],\n        style: {\n          color: "gray"\n        }\n      }));\n    } else {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {\n        onClick: this.goBack,\n        className: "btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm " + (this.props.className ? this.props.className : "")\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__[/* FontAwesomeIcon */ "a"], {\n        icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__[/* faArrowLeft */ "b"],\n        style: {\n          color: "gray"\n        }\n      }));\n    }\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__["a"] = (Object(react_router__WEBPACK_IMPORTED_MODULE_1__[/* withRouter */ "o"])(BackButton));\n\n//# sourceURL=webpack:///./src/components/atoms/BackButton.jsx?')},"./src/components/atoms/LinkButton.jsx":
/*!*********************************************!*\
  !*** ./src/components/atoms/LinkButton.jsx ***!
  \*********************************************/
/*! exports provided: default */
/*! exports used: default */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");\n/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");\n/* harmony import */ var _modules_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modules/utils */ "./src/components/modules/utils.js");\n\n\n\n\n/**\n * buttonタグとLinkコンポーネントを併用したい際に\n */\n\nconst LinkButton = props => {\n  const {\n    to,\n    className,\n    style,\n    children,\n    id = Object(_modules_utils__WEBPACK_IMPORTED_MODULE_3__[/* generateRandomSeed */ "l"])()\n  } = props;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {\n    to: to,\n    style: {\n      textDecoration: "none"\n    },\n    id: id\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n    className: className,\n    style: style\n  }, children));\n};\n\n/* harmony default export */ __webpack_exports__["a"] = (LinkButton);\n\n//# sourceURL=webpack:///./src/components/atoms/LinkButton.jsx?')},"./src/components/atoms/TooltipComponent.jsx":
/*!***************************************************!*\
  !*** ./src/components/atoms/TooltipComponent.jsx ***!
  \***************************************************/
/*! exports provided: default */
/*! exports used: default */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst TooltipComponent = props => {\n  const {\n    children,\n    title,\n    backgroundColor = "rgb(50, 50, 50)",\n    placement = "top"\n    /* ?: "bottom"|"top" */\n\n  } = props;\n  const [tooltipOpen, setTooltipOpen] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);\n  if (!title) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null);\n\n  const renderTooltipBody = placement => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: `tooltip-body rounded-pill px-2 py-1 ${placement}`,\n    style: { ...(backgroundColor ? {\n        background: backgroundColor\n      } : {})\n    }\n  }, title);\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: `tooltip-container ${tooltipOpen ? "active" : ""}`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {\n    className: "tooltip-wrapper"\n  }, placement === "top" && renderTooltipBody(placement), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    onMouseEnter: () => {\n      setTooltipOpen(true);\n    },\n    onMouseLeave: () => {\n      setTooltipOpen(false);\n    }\n  }, children), placement === "bottom" && renderTooltipBody(placement)));\n};\n\n/* harmony default export */ __webpack_exports__["a"] = (TooltipComponent);\n\n//# sourceURL=webpack:///./src/components/atoms/TooltipComponent.jsx?')},"./src/components/molecules/Headline.jsx":
/*!***********************************************!*\
  !*** ./src/components/molecules/Headline.jsx ***!
  \***********************************************/
/*! exports provided: TypeChangeButton, default */
/*! exports used: default */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* unused harmony export TypeChangeButton */\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _atoms_BackButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../atoms/BackButton */ "./src/components/atoms/BackButton.jsx");\n/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _modules_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../modules/utils */ "./src/components/modules/utils.js");\n/* harmony import */ var _modules_env__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../modules/env */ "./src/components/modules/env.js");\n/* harmony import */ var _MobileMenu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./MobileMenu */ "./src/components/molecules/MobileMenu.jsx");\n/* harmony import */ var _contexts_DomContext__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../contexts/DomContext */ "./src/components/contexts/DomContext.jsx");\n/* harmony import */ var _atoms_LinkButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../atoms/LinkButton */ "./src/components/atoms/LinkButton.jsx");\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");\n/* harmony import */ var _atoms_TooltipComponent__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../atoms/TooltipComponent */ "./src/components/atoms/TooltipComponent.jsx");\n/* harmony import */ var _contexts_ProfileContext__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../contexts/ProfileContext */ "./src/components/contexts/ProfileContext.jsx");\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nconst ModeSelectButtonDropdown = props => {\n  const {\n    members,\n    type,\n    groupKey\n  } = props;\n  const [dropdownOpen, setOpen] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);\n\n  const toggle = () => setOpen(!dropdownOpen);\n\n  const profileState = Object(_contexts_ProfileContext__WEBPACK_IMPORTED_MODULE_13__[/* useProfileState */ "d"])();\n  let contents = [];\n\n  if (typeof members !== "undefined") {\n    // 推しメン\n    if (groupKey === "sakura" && profileState.profile.favMemberSakura || groupKey === "hinata" && profileState.profile.favMemberHinata) {\n      const renderDropdownItem = propertyName => {\n        if (profileState.profile[propertyName]) {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n            tag: react_router_dom__WEBPACK_IMPORTED_MODULE_3__["Link"],\n            to: `/${type}/${_modules_env__WEBPACK_IMPORTED_MODULE_6__[/* GROUPS */ "n"][profileState.profile[propertyName].belongingGroup].id}/${profileState.profile[propertyName].ct}/`\n          }, profileState.profile[propertyName].fullKanji);\n        } else {\n          return null;\n        }\n      };\n\n      contents.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n        header: true\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n        className: "m-0"\n      }, "\\u63A8\\u3057\\u30E1\\u30F3")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n        divider: true\n      }), groupKey === "sakura" && renderDropdownItem("favMemberSakura"), groupKey === "hinata" && renderDropdownItem("favMemberHinata"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n        divider: true\n      })));\n    }\n\n    for (const [index, membersDividedByGeneration] of members.entries()) {\n      contents.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n        key: "dropdown-menu-contents-m-" + index\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n        header: true\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n        className: "m-0"\n      }, `${index + 1}期生`)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n        divider: true\n      }), membersDividedByGeneration.map(({\n        url,\n        full_kanji\n      }, j) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n        key: j,\n        tag: react_router_dom__WEBPACK_IMPORTED_MODULE_3__["Link"],\n        to: url[type]\n      }, full_kanji)), index != members.length - 1 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n        divider: true\n      })));\n    }\n  } else {\n    contents.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      key: "dropdown-menu-contents-g"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n      header: true\n    }, "\\u30B0\\u30EB\\u30FC\\u30D7\\u9078\\u629E"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n      divider: true\n    }), Object(_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* sortGROUPSByFav */ "D"])(profileState.profile.favGroups).map(groupObj => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownItem */ "e"], {\n      key: groupObj.id,\n      tag: react_router_dom__WEBPACK_IMPORTED_MODULE_3__["Link"],\n      to: `/${type}/${groupObj.id}/`\n    }, `${groupObj.name}`))));\n  }\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* ButtonDropdown */ "b"], {\n    direction: "right",\n    isOpen: dropdownOpen,\n    toggle: toggle,\n    onClick: e => e.stopPropagation(),\n    className: "mode-select-dropdown-button-super " + (props.fixed ? "fixed" : "")\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownToggle */ "g"], {\n    className: "rounded-circle mode-select-dropdown-button " + (props.fixed ? "fixed p-0 " : " ") + props.group\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__[/* FontAwesomeIcon */ "a"], {\n    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__[/* faAngleDown */ "a"]\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* DropdownMenu */ "f"], {\n    className: "bold mode-select-dropdown-menu" + (typeof props.members != "undefined" ? "-members" : "")\n  }, contents));\n};\n\nclass TypeChangeButton extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  getChangeTypeUrl(currentType, groupID, ct) {\n    // let url;\n    if (currentType === "blogs") {\n      return Object(_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* URLJoin */ "a"])("/images/", groupID, ct);\n    } else if (currentType === "images") {\n      return Object(_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* URLJoin */ "a"])("/blogs/", groupID, ct);\n    } // this.props.history.push(url);\n\n  }\n\n  render() {\n    const tooltipTitle = this.props.type === "blogs" ? "画像一覧に切り替えます" : "ブログ一覧に切り替えます";\n    const exchangeIcon = this.props.type === "blogs" ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__[/* FontAwesomeIcon */ "a"], {\n      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__[/* faImages */ "v"]\n    }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__[/* FontAwesomeIcon */ "a"], {\n      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__[/* faNewspaper */ "x"]\n    });\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_atoms_TooltipComponent__WEBPACK_IMPORTED_MODULE_12__[/* default */ "a"], {\n      title: tooltipTitle,\n      placement: "bottom"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_atoms_LinkButton__WEBPACK_IMPORTED_MODULE_9__[/* default */ "a"], {\n      to: this.getChangeTypeUrl(this.props.type, this.props.groupID, this.props.ct),\n      className: "rounded-pill type-change-button ml-1",\n      id: this.props.id\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "d-flex justify-content-center align-items-center",\n      style: {\n        color: "gray",\n        fontSize: 20\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__[/* FontAwesomeIcon */ "a"], {\n      className: "mr-1 my-0",\n      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__[/* faExchangeAlt */ "n"],\n      style: {\n        fontSize: 12\n      }\n    }), exchangeIcon)));\n  }\n\n}\n\nclass Headline extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n\n    this.getModeSelectButtonGroup = fixed => {\n      const ButtonGroupPC = ({\n        children\n      }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* ButtonGroup */ "c"], {\n        size: "lg",\n        className: "mt-3 mt-lg-0"\n      }, children);\n\n      if (this.props.type === "blogs" || this.props.type === "images") {\n        const contents = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "recommend" ? "active" : ""),\n          onClick: () => this.props.history.push(`/${this.props.type}/`)\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "\\u304A\\u3059\\u3059\\u3081")), Object(_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* sortGROUPSByFav */ "D"])(this.props.profileState.profile.favGroups).map(groupObj =>\n        /*#__PURE__*/\n        // <LinkButton\n        //   key={groupObj.id}\n        //   className={`rounded-pill mode-select-button ${groupObj.key} ` + (fixed ? "fixed " : " ") + ((!isMobile && !fixed) ? "d-flex align-items-center " : " ") + (this.props.mode === groupObj.key ? "active" : "")}\n        //   to={`/${this.props.type}/${groupObj.id}`}\n        // >\n        //   <h5 className="m-0">{groupObj.name}</h5>\n        //   {groupObj.isActive && (fixed\n        //     ? <MobileTopMenu id={`modeSelect${groupObj.key}`} type="modeSelect" members={this.state.membersCollection[groupObj.id]} group={groupObj.key} blogsORimages={this.props.type} />\n        //     : <ModeSelectButtonDropdown group={groupObj.key} members={this.state.membersCollection[groupObj.id]} type={this.props.type} fixed={fixed} />\n        //   )}\n        // </LinkButton>\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          key: groupObj.id,\n          className: `rounded-pill mode-select-button ${groupObj.key} ` + (fixed ? "fixed " : " ") + (!_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] && !fixed ? "d-flex align-items-center " : " ") + (this.props.mode === groupObj.key ? "active" : ""),\n          onClick: () => this.props.history.push(`/${this.props.type}/${groupObj.id}/`)\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, groupObj.name), groupObj.isActive && (fixed ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_MobileMenu__WEBPACK_IMPORTED_MODULE_7__[/* MobileTopMenu */ "b"], {\n          id: `modeSelect${groupObj.key}`,\n          type: "modeSelect",\n          members: this.state.membersCollection[groupObj.id],\n          groupKey: groupObj.key,\n          blogsORimages: this.props.type,\n          profileState: this.props.profileState\n        }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModeSelectButtonDropdown, {\n          groupKey: groupObj.key,\n          members: this.state.membersCollection[groupObj.id],\n          type: this.props.type,\n          fixed: fixed\n        })))));\n\n        if (_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] || fixed) {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, contents);\n        } else {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ButtonGroupPC, null, contents);\n        }\n      } else if (this.props.type === "blogView" && !_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"]) {\n        const contents = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "view" ? "active" : ""),\n          onClick: () => this.props.changeMode("view")\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "\\u95B2\\u89A7\\u3059\\u308B")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "download" ? "active" : ""),\n          onClick: () => this.props.changeMode("download")\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "\\u4FDD\\u5B58\\u3059\\u308B")));\n\n        if (fixed) {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, contents);\n        } else {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ButtonGroupPC, null, contents);\n        }\n      } else if (this.props.type === "members") {\n        const contents = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, Object(_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* sortGROUPSByFav */ "D"])(this.props.profileState.profile.favGroups).map(groupObj => {\n          if (groupObj.isActive) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n            key: groupObj.id,\n            className: `rounded-pill mode-select-button ${groupObj.key} ` + (fixed ? "fixed " : " ") + (this.props.group === groupObj.key ? "active" : ""),\n            onClick: () => this.props.changeGroup(groupObj.key)\n          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, groupObj.name));\n        }));\n\n        if (_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] || fixed) {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, contents);\n        } else {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* ButtonGroup */ "c"], {\n            size: "lg"\n          }, contents);\n        }\n      }\n    };\n\n    this.getModeSelectButtonGroupVerLeft = fixed => {\n      let contents;\n\n      if (this.props.type === "home") {\n        contents = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button active " + (fixed ? "fixed" : ""),\n          onClick: () => this.props.history.push("/")\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "\\u30DB\\u30FC\\u30E0")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (!_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] && !fixed ? "d-flex align-items-center" : ""),\n          onClick: () => this.props.history.push("/images/")\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "\\u753B\\u50CF\\u4E00\\u89A7"), fixed ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_MobileMenu__WEBPACK_IMPORTED_MODULE_7__[/* MobileTopMenu */ "b"], {\n          id: "modeSelectVewHomeImages",\n          type: "modeSelectVewHome",\n          blogsORimages: "images",\n          profileState: this.props.profileState\n        }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModeSelectButtonDropdown, {\n          type: "images",\n          fixed: fixed\n        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (!_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] && !fixed ? "d-flex align-items-center" : ""),\n          onClick: () => this.props.history.push("/blogs/")\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "\\u30D6\\u30ED\\u30B0\\u4E00\\u89A7"), fixed ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_MobileMenu__WEBPACK_IMPORTED_MODULE_7__[/* MobileTopMenu */ "b"], {\n          id: "modeSelectVewHomeBlogs",\n          type: "modeSelectVewHome",\n          blogsORimages: "blogs",\n          profileState: this.props.profileState\n        }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModeSelectButtonDropdown, {\n          type: "blogs",\n          fixed: fixed\n        })));\n      } else if (this.props.type === "terms") {\n        contents = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "contact" ? "active" : ""),\n          onClick: () => this.props.history.push("/contact/")\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, this.props.titleHash["contact"])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "termsOfService" ? "active" : ""),\n          onClick: () => this.props.history.push("/terms-of-service/")\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, this.props.titleHash["termsOfService"])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* Button */ "a"], {\n          className: "rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "privacyPolicy" ? "active" : ""),\n          onClick: () => this.props.history.push("/privacy-policy/")\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, this.props.titleHash["privacyPolicy"])));\n      }\n\n      if (this.props.type === "home" || this.props.type === "terms") {\n        if (_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] || fixed) {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, contents);\n        } else {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__[/* ButtonGroup */ "c"], {\n            size: "lg",\n            className: "ml-3 my-0"\n          }, contents);\n        }\n      }\n    };\n\n    this.getTypeChangeButton = fixed => {\n      let typeChangeButtonID;\n      if (fixed) typeChangeButtonID = "type-change-button-fixed";else typeChangeButtonID = "type-change-button";\n\n      if (this.props.type === "blogs" || this.props.type === "images") {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TypeChangeButton, {\n          id: typeChangeButtonID,\n          history: this.props.history,\n          type: this.props.type,\n          groupID: this.props.groupID,\n          ct: this.props.ct\n        });\n      }\n    };\n\n    this.initMembers = {};\n    Object.values(_modules_env__WEBPACK_IMPORTED_MODULE_6__[/* GROUPS */ "n"]).forEach(group => this.initMembers[group.id] = []);\n    this.state = {\n      membersCollection: this.initMembers // {"1": [[1期生], [2期生]], "2": [[1期生], [2期生], [3期生]]}\n\n    }; // scrollAdminに使用。cacheされた時、裏でprops.location.keyが暗黙に変化し、全てのheadlineが同じidになってしまうため、グローバルstateで管理\n\n    this.subNavbarRef = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();\n    this.InitUrl = props.match.url;\n    props.domDispatch({\n      type: "SET_SUBNAVBAR_REF",\n      subNavbarRef: this.subNavbarRef,\n      locationKey: props.location.key\n    });\n  }\n\n  componentDidMount() {\n    if (this.props.type === "blogs" || this.props.type === "images") {\n      const url = Object(_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* URLJoin */ "a"])(_modules_env__WEBPACK_IMPORTED_MODULE_6__[/* BASE_URL */ "d"], "members/");\n      axios__WEBPACK_IMPORTED_MODULE_4___default.a.get(url).then(res => {\n        const _membersCollection = this.initMembers;\n        Object.values(_modules_env__WEBPACK_IMPORTED_MODULE_6__[/* GROUPS */ "n"]).forEach(groupObj => {\n          if (groupObj.isActive) {\n            _membersCollection[groupObj.id] = [];\n\n            for (const membersByGene of res.data[groupObj.key]) {\n              _membersCollection[groupObj.id].push(membersByGene.map(member => ({\n                url: member.url,\n                full_kanji: member.full_kanji\n              })));\n            }\n          }\n        });\n        this.setState({\n          membersCollection: _membersCollection\n        });\n      }).catch(err => {\n        console.error(err);\n      }).finally();\n    }\n  }\n\n  componentDidUpdate(prevProps) {\n    // "/"から"/"の遷移など、route(url)が変化せずComponentがそのままの場合\n    if (Object(_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* checkNotCached */ "e"])(this.props) && this.props.match.url === this.InitUrl) {\n      if (this.props.location.key !== prevProps.location.key) {\n        this.props.domDispatch({\n          type: "SET_SUBNAVBAR_REF",\n          subNavbarRef: this.subNavbarRef,\n          locationKey: this.props.location.key\n        });\n      }\n    }\n  }\n\n  render() {\n    const fixedTypeChangeButton = this.getTypeChangeButton(true);\n    const fixedModeSelectButtonGroupVerLeft = this.getModeSelectButtonGroupVerLeft(true);\n    const fixedModeSelectButtonGroup = this.getModeSelectButtonGroup(true);\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "fixed-headline border-bottom text-muted pl-0 pl-lg-3" // Headlineのtop初期状態: mobileはNAVBAR_HEIGHT, PCでは0\n      ,\n      style: {\n        top: _modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] ? _modules_env__WEBPACK_IMPORTED_MODULE_6__[/* NAVBAR_HEIGHT */ "v"] : 0,\n        height: _modules_env__WEBPACK_IMPORTED_MODULE_6__[/* SUB_NAVBAR_HEIGHT */ "B"]\n      },\n      ref: this.subNavbarRef\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_atoms_BackButton__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"], {\n      mini: true,\n      className: "mr-0 mr-lg-2"\n    }), this.props.title && (fixedModeSelectButtonGroupVerLeft || fixedModeSelectButtonGroup) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, this.props.title), !_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] && fixedTypeChangeButton, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "vertical-hr " + (_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] ? "ml-3" : "mx-2")\n    })), this.props.title && !fixedModeSelectButtonGroupVerLeft && !fixedModeSelectButtonGroup && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, this.props.title), !_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] && fixedTypeChangeButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "fixed-headline-contents-wrapper",\n      style: {\n        height: _modules_env__WEBPACK_IMPORTED_MODULE_6__[/* SUB_NAVBAR_HEIGHT */ "B"]\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "fixed-headline-contents-wrapper2",\n      style: {\n        height: _modules_env__WEBPACK_IMPORTED_MODULE_6__[/* SUB_NAVBAR_HEIGHT */ "B"]\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "text-muted fixed-headline-contents"\n    }, fixedModeSelectButtonGroupVerLeft, fixedModeSelectButtonGroup)))), !_modules_utils__WEBPACK_IMPORTED_MODULE_5__[/* isMobile */ "u"] && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "row justify-content-between mr-0"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n      className: "d-flex align-items-center"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_atoms_BackButton__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"], null), this.getModeSelectButtonGroupVerLeft(false), this.props.title && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {\n      className: "ml-3 my-0"\n    }, this.props.title), this.getTypeChangeButton(false)), this.getModeSelectButtonGroup(false))));\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__["a"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_3__["withRouter"])(props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contexts_DomContext__WEBPACK_IMPORTED_MODULE_8__[/* DomDispatchContext */ "a"].Consumer, null, domDispatch => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contexts_ProfileContext__WEBPACK_IMPORTED_MODULE_13__[/* ProfileStateContext */ "a"].Consumer, null, profileState => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Headline, _extends({}, props, {\n  domDispatch: domDispatch,\n  profileState: profileState\n}))))));\n\n//# sourceURL=webpack:///./src/components/molecules/Headline.jsx?')}}]);