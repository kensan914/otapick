(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{"./node_modules/query-string/index.js":function(e,t,r){"use strict";var n=r("./node_modules/strict-uri-encode/index.js"),o=r("./node_modules/object-assign/index.js");function s(e,t){return t.encode?t.strict?n(e):encodeURIComponent(e):e}t.extract=function(e){return e.split("?")[1]||""},t.parse=function(e,t){var r=function(e){var t;switch(e.arrayFormat){case"index":return function(e,r,n){t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return function(e,r,n){t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};default:return function(e,t,r){void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t=o({arrayFormat:"none"},t)),n=Object.create(null);return"string"!=typeof e?n:(e=e.trim().replace(/^(\?|#|&)/,""))?(e.split("&").forEach((function(e){var t=e.replace(/\+/g," ").split("="),o=t.shift(),s=t.length>0?t.join("="):void 0;s=void 0===s?null:decodeURIComponent(s),r(decodeURIComponent(o),s,n)})),Object.keys(n).sort().reduce((function(e,t){var r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((function(e,t){return Number(e)-Number(t)})).map((function(e){return t[e]})):t}(r):e[t]=r,e}),Object.create(null))):n},t.stringify=function(e,t){var r=function(e){switch(e.arrayFormat){case"index":return function(t,r,n){return null===r?[s(t,e),"[",n,"]"].join(""):[s(t,e),"[",s(n,e),"]=",s(r,e)].join("")};case"bracket":return function(t,r){return null===r?s(t,e):[s(t,e),"[]=",s(r,e)].join("")};default:return function(t,r){return null===r?s(t,e):[s(t,e),"=",s(r,e)].join("")}}}(t=o({encode:!0,strict:!0,arrayFormat:"none"},t));return e?Object.keys(e).sort().map((function(n){var o=e[n];if(void 0===o)return"";if(null===o)return s(n,t);if(Array.isArray(o)){var a=[];return o.slice().forEach((function(e){void 0!==e&&a.push(r(n,e,a.length))})),a.join("&")}return s(n,t)+"="+s(o,t)})).filter((function(e){return e.length>0})).join("&"):""}},"./node_modules/react-infinite-scroller/dist/InfiniteScroll.js":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=r("./node_modules/react/index.js"),s=i(o),a=i(r("./node_modules/prop-types/index.js"));function i(e){return e&&e.__esModule?e:{default:e}}var l=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.scrollListener=r.scrollListener.bind(r),r.eventListenerOptions=r.eventListenerOptions.bind(r),r.mousewheelListener=r.mousewheelListener.bind(r),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),n(t,[{key:"componentDidMount",value:function(){this.pageLoaded=this.props.pageStart,this.options=this.eventListenerOptions(),this.attachScrollListener()}},{key:"componentDidUpdate",value:function(){if(this.props.isReverse&&this.loadMore){var e=this.getParentElement(this.scrollComponent);e.scrollTop=e.scrollHeight-this.beforeScrollHeight+this.beforeScrollTop,this.loadMore=!1}this.attachScrollListener()}},{key:"componentWillUnmount",value:function(){this.detachScrollListener(),this.detachMousewheelListener()}},{key:"isPassiveSupported",value:function(){var e=!1,t={get passive(){e=!0}};try{document.addEventListener("test",null,t),document.removeEventListener("test",null,t)}catch(e){}return e}},{key:"eventListenerOptions",value:function(){var e=this.props.useCapture;return this.isPassiveSupported()&&(e={useCapture:this.props.useCapture,passive:!0}),e}},{key:"setDefaultLoader",value:function(e){this.defaultLoader=e}},{key:"detachMousewheelListener",value:function(){var e=window;!1===this.props.useWindow&&(e=this.scrollComponent.parentNode),e.removeEventListener("mousewheel",this.mousewheelListener,this.options?this.options:this.props.useCapture)}},{key:"detachScrollListener",value:function(){var e=window;!1===this.props.useWindow&&(e=this.getParentElement(this.scrollComponent)),e.removeEventListener("scroll",this.scrollListener,this.options?this.options:this.props.useCapture),e.removeEventListener("resize",this.scrollListener,this.options?this.options:this.props.useCapture)}},{key:"getParentElement",value:function(e){var t=this.props.getScrollParent&&this.props.getScrollParent();return null!=t?t:e&&e.parentNode}},{key:"filterProps",value:function(e){return e}},{key:"attachScrollListener",value:function(){var e=this.getParentElement(this.scrollComponent);if(this.props.hasMore&&e){var t=window;!1===this.props.useWindow&&(t=e),t.addEventListener("mousewheel",this.mousewheelListener,this.options?this.options:this.props.useCapture),t.addEventListener("scroll",this.scrollListener,this.options?this.options:this.props.useCapture),t.addEventListener("resize",this.scrollListener,this.options?this.options:this.props.useCapture),this.props.initialLoad&&this.scrollListener()}}},{key:"mousewheelListener",value:function(e){1!==e.deltaY||this.isPassiveSupported()||e.preventDefault()}},{key:"scrollListener",value:function(){var e=this.scrollComponent,t=window,r=this.getParentElement(e),n=void 0;if(this.props.useWindow){var o=document.documentElement||document.body.parentNode||document.body,s=void 0!==t.pageYOffset?t.pageYOffset:o.scrollTop;n=this.props.isReverse?s:this.calculateOffset(e,s)}else n=this.props.isReverse?r.scrollTop:e.scrollHeight-r.scrollTop-r.clientHeight;n<Number(this.props.threshold)&&e&&null!==e.offsetParent&&(this.detachScrollListener(),this.beforeScrollHeight=r.scrollHeight,this.beforeScrollTop=r.scrollTop,"function"==typeof this.props.loadMore&&(this.props.loadMore(this.pageLoaded+=1),this.loadMore=!0))}},{key:"calculateOffset",value:function(e,t){return e?this.calculateTopPosition(e)+(e.offsetHeight-t-window.innerHeight):0}},{key:"calculateTopPosition",value:function(e){return e?e.offsetTop+this.calculateTopPosition(e.offsetParent):0}},{key:"render",value:function(){var e=this,t=this.filterProps(this.props),r=t.children,n=t.element,o=t.hasMore,a=(t.initialLoad,t.isReverse),i=t.loader,l=(t.loadMore,t.pageStart,t.ref),c=(t.threshold,t.useCapture,t.useWindow,t.getScrollParent,function(e,t){var r={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(r[n]=e[n]);return r}(t,["children","element","hasMore","initialLoad","isReverse","loader","loadMore","pageStart","ref","threshold","useCapture","useWindow","getScrollParent"]));c.ref=function(t){e.scrollComponent=t,l&&l(t)};var u=[r];return o&&(i?a?u.unshift(i):u.push(i):this.defaultLoader&&(a?u.unshift(this.defaultLoader):u.push(this.defaultLoader))),s.default.createElement(n,c,u)}}]),t}(o.Component);l.propTypes={children:a.default.node.isRequired,element:a.default.node,hasMore:a.default.bool,initialLoad:a.default.bool,isReverse:a.default.bool,loader:a.default.node,loadMore:a.default.func.isRequired,pageStart:a.default.number,ref:a.default.func,getScrollParent:a.default.func,threshold:a.default.number,useCapture:a.default.bool,useWindow:a.default.bool},l.defaultProps={element:"div",hasMore:!1,initialLoad:!0,pageStart:0,ref:null,threshold:250,useWindow:!0,isReverse:!1,useCapture:!1,loader:null,getScrollParent:null},t.default=l,e.exports=t.default},"./node_modules/react-infinite-scroller/index.js":function(e,t,r){e.exports=r("./node_modules/react-infinite-scroller/dist/InfiniteScroll.js")},"./node_modules/strict-uri-encode/index.js":function(e,t,r){"use strict";e.exports=function(e){return encodeURIComponent(e).replace(/[!'()*]/g,(function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}))}},"./src/components/organisms/List.jsx":function(e,t,r){"use strict";r.d(t,"b",(function(){return g}));var n=r("./node_modules/react/index.js"),o=r.n(n),s=r("./node_modules/react-router-dom/esm/react-router-dom.js"),a=r("./node_modules/react-infinite-scroller/index.js"),i=r.n(a),l=r("./node_modules/react-masonry-component/lib/index.js"),c=r.n(l),u=r("./src/components/molecules/Loader.jsx"),d=r("./src/utils/index.js"),m=r("./src/components/atoms/NotFound.jsx"),p=r("./src/contexts/DomContext.jsx"),f=r("./src/constants/env.js");const h=Object(s.withRouter)(e=>{const{hasMore:t,status:r,page:s,urlExcludePage:a,isLoading:l,request:h,topComponent:g,NotFoundComponent:b,children:v}=e,j=Object(p.c)();Object(n.useEffect)(()=>{t||j({type:"APPLY_SHOW_FOOTER",location:e.location})},[t]);return o.a.createElement(o.a.Fragment,null,g,o.a.createElement(i.a,{hasMore:t,loadMore:()=>{t&&!l&&h({url:Object(d.a)(a,"?page="+s)})},initialLoad:!1,loader:o.a.createElement("div",{key:0,style:{paddingBottom:d.r?f.d:0}},o.a.createElement(u.a,null)),className:"mb-5",threshold:500},"success"===r&&o.a.createElement(c.a,{options:{itemSelector:".grid-item",transitionDuration:0,stagger:0},disableImagesLoaded:!1},v),"blog_not_found"===r&&o.a.createElement("div",null,o.a.createElement(m.c,{type:"blogFailed",margin:!0})),"image_not_found"===r&&(void 0===b?o.a.createElement("div",null,o.a.createElement(m.c,{type:"imageFailed",margin:!0})):b)))});t.a=h;const g=()=>{const[e,t]=Object(n.useState)([]),[r,o]=Object(n.useState)(""),s=Object(n.useRef)(!0),a=Object(n.useRef)(1),[i]=Object(n.useState)(Object(d.j)());return[e,r=>{t([...e,...r])},r,o,s,a,i]}},"./src/components/templates/ImageListTemplate/organisms/ImageList.jsx":function(e,t,r){"use strict";r.d(t,"a",(function(){return b}));var n=r("./node_modules/react/index.js"),o=r.n(n),s=r("./node_modules/react-router-dom/esm/react-router-dom.js"),a=r("./src/utils/index.js"),i=r("./src/constants/env.js"),l=r("./src/components/molecules/ImageCard.jsx"),c=r("./src/hooks/useAxios.js"),u=r("./src/components/organisms/List.jsx"),d=r("./src/contexts/AuthContext.jsx"),m=r("./src/components/atoms/NotFound.jsx"),p=r("./src/contexts/ProfileContext.jsx"),f=r("./src/hooks/useList.js"),h=r("./src/hooks/useView.js");function g(){return(g=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}t.b=e=>{var t;const{topComponent:r}=e,n=Object(p.d)();return o.a.createElement(b,g({},e,{additionalQParams:null!=n&&null!==(t=n.profile)&&void 0!==t&&t.favGroups?["?groups=",n.profile.favGroups.map(e=>e.groupId)]:[],render:(e,t,n,s,i,c,d,m,p,f,h)=>o.a.createElement(u.a,{hasMore:e,status:t,page:n,urlExcludePage:s,isLoading:i,request:c,topComponent:m&&"success"===t&&r,NotFoundComponent:h},d.map(({groupID:e,blogCt:t,blogTitle:r,src:n,url:s,blogUrl:i,officialUrl:c,writer:u,order:d,isFavorite:m,width:f,height:h},g)=>{const b="grid-item "+(p?"col-6 col-md-4 col-lg-3 col-xl-2 px-1 px-sm-2 "+(a.r?"my-1 ":"my-3 "):"col-6 col-md-4 col-lg-3 px-1 px-sm-2 "+(a.r?"my-1 ":"my-3 "));return o.a.createElement("div",{key:g},o.a.createElement("div",{className:b},o.a.createElement(l.a,{id:g,groupId:e,groupKey:Object(a.m)(e),blogCt:t,blogTitle:r,srcCollection:n,urlPath:s,blogUrl:i,officialUrl:c,writer:u,order:d,initIsFavorite:m,width:f,height:h})))}))}))};const b=Object(s.withRouter)(e=>{const{type:t,render:r,additionalQParams:s}=e,{groupId:l,blogCt:p,order:g}=Object(h.b)(),{ct:b}=Object(f.a)(),{orderFormat:v}=Object(f.b)("IMAGES");let j,y,E=!1,O=!1;switch(t){case"RELATED_IMAGES":j=Object(a.a)(i.b,"relatedImages/",l,p,g),E=!0,O=!0;break;case"FAVORITE_IMAGES":j=Object(a.a)(i.b,"favorites/"),E=!0,O=!0,y=o.a.createElement("div",{className:a.t?"mx-1":"mx-3"},o.a.createElement(m.c,{type:"favoriteImage",margin:!0}));break;case"HOME":j=Object(a.a)(i.b,"home/");break;default:j=Object(a.a)(i.b,"images/",l,b)}const[x,w,L,k,C,S,N]=Object(u.b)(),_=Object(a.a)(j,v&&"?sort="+v,N&&"?random_seed="+N,...s||[]),[P,M]=Object(n.useState)(!1),I=Object(d.c)(),{isLoading:R,request:T}=Object(c.b)(Object(a.a)(_,"?page="+S.current),"get",{thenCallback:e=>{if(e.data.length>0){const t=e.data.map(e=>({groupID:e.blog.group_id,blogCt:e.blog.blog_ct,blogTitle:e.blog.title,src:e.image.src,url:e.image.url,blogUrl:e.blog.url,officialUrl:e.blog.official_url,writer:e.blog.writer,order:e.image.order,isFavorite:e.image.is_favorite,width:e.image.width,height:e.image.height}));w(t),k("success"),e.data.length<20&&(C.current=!1)}else 1==S.current?(C.current=!1,k("image_not_found")):C.current=!1;M&&M(!0)},catchCallback:e=>{404===e.response.status&&(C.current=!1,k("image_not_found"))},finallyCallback:()=>{S.current++},didRequestCallback:e=>{},shouldRequestDidMount:!0,token:I.token});return r(C.current,L,S.current,_,R,T,x,P,E,O,y)})},"./src/hooks/useList.js":function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return c})),r.d(t,"c",(function(){return u}));var n=r("./node_modules/react/index.js"),o=r("./node_modules/react-router/esm/react-router.js"),s=r("./node_modules/query-string/index.js"),a=r.n(s),i=r("./src/utils/index.js");const l=()=>{var e,t;const r=Object(o.n)(),[s]=Object(n.useState)(null==r||null===(e=r.params)||void 0===e?void 0:e.groupId),[a]=Object(n.useState)(null==r||null===(t=r.params)||void 0===t?void 0:t.ct),[l]=Object(n.useState)(Object(i.m)(s));return{groupId:s,ct:a,groupKey:l}},c=e=>{const t=Object(o.l)(),r=a.a.parse(t.search);let s="";switch(e){case"BLOGS":s="newer_post";break;case"IMAGES":s="recommend";break;default:throw new Error(`the type "${e} is unexpected."`)}const[i]=Object(n.useState)(void 0===r.sort?s:r.sort),[l]=Object(n.useState)(void 0===r.keyword?"":r.keyword),[c]=Object(n.useState)(void 0===r.post?"":r.post);return{orderFormat:i,narrowingKeyword:l,narrowingPost:c}},u=()=>{const e=Object(o.l)(),t=Object(o.n)(),r=Object(o.k)();return n=>{const o=a.a.parse(e.search);n.sort||(delete o.keyword,delete o.post);const s=Object.assign(o,n);let l="";Object.keys(s).forEach((e,t)=>{l+=0==t?`?${e}=${s[e]}`:`&${e}=${s[e]}`}),r.push(Object(i.a)(t.url,l))}}},"./src/pages/UsersDetailPage.jsx":function(e,t,r){"use strict";r.r(t);var n=r("./node_modules/react/index.js"),o=r.n(n),s=r("./node_modules/react-router-dom/esm/react-router-dom.js"),a=r("./src/contexts/ProfileContext.jsx"),i=r("./src/hooks/useAxios.js"),l=r("./src/constants/env.js"),c=r("./src/utils/index.js"),u=r("./src/components/molecules/Loader.jsx"),d=r("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),m=r("./node_modules/@fortawesome/react-fontawesome/index.es.js"),p=r("./src/components/atoms/LinkButton.jsx"),f=r("./src/contexts/AuthContext.jsx");var h=e=>{const{username:t,favoriteListKey:r}=e,s=Object(f.c)(),[a,u]=Object(n.useState)(0),[h,g]=Object(n.useState)(0);return Object(i.b)(Object(c.a)(l.b,"favorites/info/"),"get",{thenCallback:(e,t)=>{u(t.favoritesNum),g(t.maxFavoritesNum)},token:s.token,shouldRequestDidMount:!0}),o.a.createElement("div",{className:"row mt-4 mt-sm-5 mx-0 mx-sm-3 mx-md-0"},o.a.createElement(p.a,{to:{pathname:`/users/${t}/`,state:{accessKey:r}},className:`rounded-pill profile-mode-select-button active ${c.r?"mobile":""} ${c.t?"ml-0":"ml-3"}`},o.a.createElement(m.a,{icon:d.r,className:"mr-2"}),o.a.createElement("b",null,"マイフォルダ"),o.a.createElement("div",{className:"ml-2 px-1 rounded-pill profile-mode-select-button-badge"},o.a.createElement("b",null,a),"/"+h)))},g=r("./src/components/templates/ImageListTemplate/organisms/ImageList.jsx"),b=r("./src/components/atoms/TooltipComponent.jsx");var v=e=>{const{items:t=[],diameter:r=45,direction:a="left",isOverlap:i=!0,hasBorder:l=!1}=e,[u,d]=Object(n.useState)(Array(t.length).fill(!1)),m=(e,t)=>{const r=[...u];t&&r.fill(!1),r[e]=t,d(r)},p=1.14*r,f=i?.27*r:0,h="right"===a;return o.a.createElement("div",{className:"d-flex align-items-center avatar-sequence-container "+(l?"border-top border-light rounded-pill p-1 shadow-sm":"")},t.map((e,n)=>{const a="avatar-sequence-item-"+n;return o.a.createElement("div",{key:n,id:a,className:"avatar-sequence-item d-flex justify-content-center",style:{position:"relative",zIndex:u[n]?t.length:t.length-n,...h?{order:-n,left:f*n}:{right:f*n}},onMouseEnter:()=>{m(n,!0)},onMouseLeave:()=>{m(n,!1)}},(()=>{const t=o.a.createElement(s.Link,{to:e.url},o.a.createElement("div",{className:"rounded-circle avatar-sequence-image-wrapper d-flex justify-content-center align-items-center",style:{width:p,height:p}},o.a.createElement("div",{className:"rounded-circle avatar-sequence-image-hover-wrapper",style:{width:r,height:r,...u[n]?{opacity:.2}:{opacity:0}}}),e.contentsNode?o.a.createElement("div",{className:"rounded-circle avatar-sequence-image d-flex justify-content-center align-items-center",style:{width:r,height:r,backgroundColor:e.backgroundColor?e.backgroundColor:"white"}},e.contentsNode):o.a.createElement("img",{className:"rounded-circle avatar-sequence-image",width:r,height:r,style:{width:r,height:r},src:e.imageUrl,alt:e.alt})));return c.r?t:o.a.createElement(b.a,{title:e.alt},t)})())}))};var j=e=>{const{imageUrl:t,size:r}=e,n=r||(c.t?80:120),s=n+n/9;return o.a.createElement("div",{className:"profile-icon-wrapper rounded-circle",style:{height:s,width:s}},o.a.createElement("img",{className:"profile-icon-image rounded-circle",src:t,style:{height:n,width:n}}))},y=r("./src/components/molecules/DropdownMobileFriendly.jsx");var E=e=>{const{profile:t={},isMe:r}=e,n=c.t?16:26,s=null!=t&&t.favGroups?t.favGroups.map(e=>{var t;return{url:`/images/${e.groupId}/`,alt:e.name,backgroundColor:null===(t=l.m[e.groupId])||void 0===t?void 0:t.color,contentsNode:o.a.createElement("div",{className:"saka-mark"})}}):[],a=e=>t[e]?{url:`/images/${l.m[t[e].belongingGroup].id}/${t[e].ct}/`,imageUrl:t[e].image,alt:t[e].fullKanji}:{},i=a("favMemberSakura"),u=a("favMemberHinata");return o.a.createElement("div",{className:"my-2 my-sm-4"},o.a.createElement("div",{className:"d-flex justify-content-center pb-3"},!c.r&&o.a.createElement("div",{className:"d-flex justify-content-end align-items-end",style:{flex:1}},o.a.createElement(v,{direction:"right",items:[...s,...r?[{url:"/settings/fav-members/",alt:"推しグループを編集する",backgroundColor:"whitesmoke",contentsNode:o.a.createElement(m.a,{icon:d.A,color:"gray"})}]:[]]})),o.a.createElement("div",{className:"mx-2"},o.a.createElement(j,{imageUrl:t.image})),!c.r&&o.a.createElement("div",{className:"d-flex align-items-end",style:{flex:1}},o.a.createElement(v,{direction:"left",items:[...Object.keys(i).length?[i]:[],...Object.keys(u).length?[u]:[],...r?[{url:"/settings/fav-members/",alt:"推しメンを編集する",backgroundColor:"whitesmoke",contentsNode:o.a.createElement(m.a,{icon:d.A,color:"gray"})}]:[]]}))),o.a.createElement("div",{className:"d-flex align-items-center flex-column"},o.a.createElement("h1",{className:"profile-title pb-0 pb-sm-2 m-0 text-center",style:{fontSize:n}},t.name),o.a.createElement("div",{className:""},"@",t.username)),c.r&&(()=>{const e=[...Object.keys(i).length?[i]:[],...Object.keys(u).length?[u]:[],...s];return o.a.createElement("div",{className:"d-flex justify-content-center align-items-center mt-2"},o.a.createElement("div",{className:"d-flex justify-content-center align-items-center border-top border-light rounded-pill p-1 shadow-sm"},o.a.createElement("div",{className:"pl-3 pr-2"},o.a.createElement(b.a,{title:"推し"},o.a.createElement(m.a,{icon:d.u,color:"#ff7f7f",size:"lg"}))),o.a.createElement("div",{className:"mobile-fav-members-contents-wrapper border border-light rounded-pill",style:{maxWidth:.65*window.innerWidth}},e.length>0?o.a.createElement(v,{direction:"left",isOverlap:!1,items:e}):o.a.createElement("div",{className:"py-1 px-2"},r?"推しを設定して画像やブログの表示をカスタマイズしましょう！":"推し未設定")),r&&e.length>0?o.a.createElement(y.a,{id:"fav-member-dropdown",buttonClass:"rounded-circle fav-member-dropdown-button d-flex justify-content-center align-items-center mx-1 border-0",buttonStyle:{width:45,height:45},menuSettings:[{type:"TITLE",label:"推し"},{type:"LINK",pathname:"/settings/fav-members/",state:{},label:"推しを設定する",icon:d.H},Object.keys(i).length?{type:"LINK",pathname:i.url,state:{},label:`「${i.alt}」の画像一覧へ`,icon:d.w}:{},Object.keys(u).length?{type:"LINK",pathname:u.url,state:{},label:`「${u.alt}」の画像一覧へ`,icon:d.w}:{},...s.map(e=>({type:"LINK",pathname:e.url,state:{},label:`「${e.alt}」の画像一覧へ`,icon:d.w}))]},o.a.createElement(m.a,{icon:d.a,color:"gray"})):o.a.createElement(p.a,{to:"/settings/fav-members/",className:"rounded-circle avatar-sequence-image d-flex justify-content-center align-items-center mx-1 border-0",style:{width:45,height:45,backgroundColor:"white"}},o.a.createElement(m.a,{icon:d.A,color:"gray"}))))})())};var O=e=>{const{profile:t={},username:r,isMe:s,isLoading:a,accessKey:i,isReadyProfile:l}=e,[d,m]=Object(n.useState)(i);return Object(n.useEffect)(()=>{d!==i&&void 0!==i&&m(i)},[i]),o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"container mt-3 text-muted"},a?o.a.createElement(u.a,null):o.a.createElement(E,{profile:t,isMe:s})),s?o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"container-fluid mt-3 text-muted"},o.a.createElement(h,{username:r,favoriteListKey:d,key:d})),o.a.createElement("div",{className:"container-fluid text-muted mt-3 list-container-fluid favorite-images-container "+(c.t?"smp":"")},o.a.createElement(g.b,{key:d,type:"FAVORITE_IMAGES"}))):o.a.createElement("div",{style:{marginTop:300}}))},x=r("./src/hooks/useMeta.js");t.default=()=>{var e;const t=Object(a.d)(),r=Object(s.useLocation)(),u=null==r||null===(e=r.state)||void 0===e?void 0:e.accessKey,{setMeta:d}=Object(x.a)(),m=Object(s.useParams)(),[p]=Object(n.useState)(null==m?void 0:m.username),f=t.profile.username===p,[h,g]=Object(n.useState)(!1),[b,v]=Object(n.useState)(),{isLoading:j,request:y}=Object(i.b)(Object(c.a)(l.b,"users/",p),"get",{thenCallback:(e,t)=>{const r=t;v(r),d(`${r.name}(@${r.username})`,"")}});return Object(n.useEffect)(()=>{f?v({...t.profile}):y()},[p]),Object(n.useEffect)(()=>{f&&(v({...t.profile}),d(`${t.profile.name}(@${t.profile.username})`,""))},[t.profile]),Object(n.useEffect)(()=>{void 0===b||h||g(!0)},[b]),o.a.createElement(O,{isLoading:j,profile:b,username:p,isMe:f,accessKey:u,isReadyProfile:h})}}}]);