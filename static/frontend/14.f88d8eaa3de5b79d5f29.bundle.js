(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{"./src/hooks/useMeta.js":function(e,t,o){"use strict";o.d(t,"a",(function(){return u}));var s=o("./node_modules/react/index.js"),c=o("./node_modules/react-router/esm/react-router.js"),n=o("./src/constants/env.js"),r=o("./src/hooks/useCacheRoute.js");const u=()=>{const[e,t]=Object(s.useState)(),[o,u]=Object(s.useState)(),i=Object(c.l)(),d=()=>{if(void 0!==e&&void 0!==o){e!==n.n?document.title=`${e}｜${n.y}`:document.title=`${n.y}｜${n.n}`;const t=document.head.children;for(const e of t){const t=e.getAttribute("name");null!==t&&-1!==t.indexOf("description")&&e.setAttribute("content",o+n.k)}a(i.pathname)}};Object(s.useEffect)(()=>{d()},[e,o]);const{isCachedRoute:j}=Object(r.a)(),f=Object(s.useRef)(!1);return Object(s.useEffect)(()=>{f.current&&!j?d():f.current=!0},[j]),{setMeta:(e,o)=>{void 0!==e&&t(e),void 0!==o&&u(o)}}},a=e=>{if(!n.i){if(!window.gtag)return;if(!n.l)return;gtag("config",n.l,{page_path:e})}}},"./src/pages/NotFound404Page.jsx":function(e,t,o){"use strict";o.r(t);var s=o("./node_modules/react/index.js"),c=o.n(s),n=o("./node_modules/react-router-dom/esm/react-router-dom.js"),r=o("./src/components/atoms/NotFound.jsx"),u=o("./src/utils/index.js"),a=o("./src/constants/env.js"),i=o("./src/contexts/DomContext.jsx"),d=o("./src/hooks/useMeta.js");t.default=e=>{const{footerRef:t}=e,o=Object(n.useLocation)(),j=Object(i.c)(),{setMeta:f}=Object(d.a)();return Object(s.useEffect)(()=>(null!==t&&j({type:"APPLY_SHOW_FOOTER",location:o}),u.r&&Object(u.w)(a.t),f("404 Page Not Found",""),()=>{u.r&&Object(u.w)(a.t+a.z)})),Object(s.useEffect)(()=>{null!==t&&j({type:"APPLY_SHOW_FOOTER",location:o})},[t]),c.a.createElement("div",{className:"container mt-3 text-muted py-5"},c.a.createElement(r.c,{type:"404",margin:!0}))}}}]);