(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{132:function(e,t,a){"use strict";var s=a(0),r=a.n(s);t.a=e=>{const{children:t,title:a,backgroundColor:l="rgb(50, 50, 50)",placement:n="top"}=e,[i,o]=Object(s.useState)(!1);if(!a)return r.a.createElement(r.a.Fragment,null);const c=e=>r.a.createElement("div",{className:"tooltip-body rounded-pill px-2 py-1 "+e,style:{...l?{background:l}:{}}},a);return r.a.createElement("div",{className:"tooltip-container "+(i?"active":"")},r.a.createElement("span",{className:"tooltip-wrapper"},"top"===n&&c(n),r.a.createElement("div",{onMouseEnter:()=>{o(!0)},onMouseLeave:()=>{o(!1)}},t),"bottom"===n&&c(n)))}},133:function(e,t,a){"use strict";var s=a(0),r=a.n(s),l=a(135),n=a(128),i=a(127),o=a(130),c=a(131),m=a(160),p=a(18),u=a(11),d=a(26),h=a.n(d),g=a(3),b=a(4),f=a(9),E=a(51),y=a(27),v=a(136),N=a(7),k=a(8),x=a(132);function w(){return(w=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(e[s]=a[s])}return e}).apply(this,arguments)}const j=e=>{const[t,a]=Object(s.useState)(!1);let l=[];if(void 0!==e.members)for(const[t,a]of e.members.entries())l.push(r.a.createElement("div",{key:"dropdown-menu-contents-m-"+t},r.a.createElement(n.a,{header:!0},r.a.createElement("div",{className:"m-0"},t+1+"期生")),r.a.createElement(n.a,{divider:!0}),a.map(({url:t,full_kanji:a},s)=>r.a.createElement(n.a,{key:s,tag:f.Link,to:t[e.type]},a)),t!=e.members.length-1&&r.a.createElement(n.a,{divider:!0})));else l.push(r.a.createElement("div",{key:"dropdown-menu-contents-g"},r.a.createElement(n.a,{header:!0},"グループ選択"),r.a.createElement(n.a,{divider:!0}),Object.values(b.n).map(t=>r.a.createElement(n.a,{key:t.id,tag:f.Link,to:`/${e.type}/${t.id}/`},""+t.name))));return r.a.createElement(i.a,{direction:"right",isOpen:t,toggle:()=>a(!t),onClick:e=>e.stopPropagation(),className:"mode-select-dropdown-button-super "+(e.fixed?"fixed":"")},r.a.createElement(o.a,{className:"rounded-circle mode-select-dropdown-button "+(e.fixed?"fixed p-0 ":" ")+e.group},r.a.createElement(N.a,{icon:k.a})),r.a.createElement(c.a,{className:"bold mode-select-dropdown-menu"+(void 0!==e.members?"-members":"")},l))};class O extends r.a.Component{getChangeTypeUrl(e,t,a){return"blogs"===e?Object(g.a)("/images/",t,a):"images"===e?Object(g.a)("/blogs/",t,a):void 0}render(){const e="blogs"===this.props.type?"画像一覧に切り替えます":"ブログ一覧に切り替えます",t="blogs"===this.props.type?r.a.createElement(N.a,{icon:k.v}):r.a.createElement(N.a,{icon:k.x});return r.a.createElement(x.a,{title:e,placement:"bottom"},r.a.createElement(v.a,{to:this.getChangeTypeUrl(this.props.type,this.props.groupID,this.props.ct),className:"rounded-pill type-change-button ml-1",id:this.props.id},r.a.createElement("div",{className:"d-flex justify-content-center align-items-center",style:{color:"gray",fontSize:20}},r.a.createElement(N.a,{className:"mr-1 my-0",icon:k.n,style:{fontSize:12}}),t)))}}class C extends r.a.Component{constructor(e){super(e),this.getModeSelectButtonGroup=e=>{const t=({children:e})=>r.a.createElement(m.a,{size:"lg",className:"mt-3 mt-lg-0"},e);if("blogs"===this.props.type||"images"===this.props.type){const a=r.a.createElement(r.a.Fragment,null,r.a.createElement(p.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("recommend"===this.props.mode?"active":""),onClick:()=>this.props.history.push(`/${this.props.type}/`)},r.a.createElement("b",null,"おすすめ")),Object.values(b.n).map(t=>r.a.createElement(p.a,{key:t.id,className:`rounded-pill mode-select-button ${t.key} `+(e?"fixed ":" ")+(g.s||e?" ":"d-flex align-items-center ")+(this.props.mode===t.key?"active":""),onClick:()=>this.props.history.push(`/${this.props.type}/${t.id}`)},r.a.createElement("b",null,t.name),t.isActive&&(e?r.a.createElement(E.b,{id:"modeSelect"+t.key,type:"modeSelect",members:this.state.membersCollection[t.id],group:t.key,blogsORimages:this.props.type}):r.a.createElement(j,{group:t.key,members:this.state.membersCollection[t.id],type:this.props.type,fixed:e})))));return g.s||e?r.a.createElement(r.a.Fragment,null,a):r.a.createElement(t,null,a)}if("blogView"===this.props.type&&!g.s){const a=r.a.createElement(r.a.Fragment,null,r.a.createElement(p.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("view"===this.props.mode?"active":""),onClick:()=>this.props.changeMode("view")},r.a.createElement("b",null,"閲覧する")),r.a.createElement(p.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("download"===this.props.mode?"active":""),onClick:()=>this.props.changeMode("download")},r.a.createElement("b",null,"保存する")));return e?r.a.createElement(r.a.Fragment,null,a):r.a.createElement(t,null,a)}if("members"===this.props.type){const t=r.a.createElement(r.a.Fragment,null,Object.values(b.n).map(t=>{if(t.isActive)return r.a.createElement(p.a,{key:t.id,className:`rounded-pill mode-select-button ${t.key} `+(e?"fixed ":" ")+(this.props.group===t.key?"active":""),onClick:()=>this.props.changeGroup(t.key)},r.a.createElement("b",null,t.name))}));return g.s||e?r.a.createElement(r.a.Fragment,null,t):r.a.createElement(m.a,{size:"lg"},t)}},this.getModeSelectButtonGroupVerLeft=e=>{let t;if("home"===this.props.type?t=r.a.createElement(r.a.Fragment,null,r.a.createElement(p.a,{className:"rounded-pill mode-select-button active "+(e?"fixed":""),onClick:()=>this.props.history.push("/")},r.a.createElement("b",null,"ホーム")),r.a.createElement(p.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+(g.s||e?"":"d-flex align-items-center"),onClick:()=>this.props.history.push("/images/")},r.a.createElement("b",null,"画像一覧"),e?r.a.createElement(E.b,{id:"modeSelectVewHomeImages",type:"modeSelectVewHome",blogsORimages:"images"}):r.a.createElement(j,{type:"images",fixed:e})),r.a.createElement(p.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+(g.s||e?"":"d-flex align-items-center"),onClick:()=>this.props.history.push("/blogs/")},r.a.createElement("b",null,"ブログ一覧"),e?r.a.createElement(E.b,{id:"modeSelectVewHomeBlogs",type:"modeSelectVewHome",blogsORimages:"blogs"}):r.a.createElement(j,{type:"blogs",fixed:e}))):"terms"===this.props.type&&(t=r.a.createElement(r.a.Fragment,null,r.a.createElement(p.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("contact"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/contact/")},r.a.createElement("b",null,this.props.titleHash.contact)),r.a.createElement(p.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("termsOfService"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/terms-of-service/")},r.a.createElement("b",null,this.props.titleHash.termsOfService)),r.a.createElement(p.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("privacyPolicy"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/privacy-policy/")},r.a.createElement("b",null,this.props.titleHash.privacyPolicy)))),"home"===this.props.type||"terms"===this.props.type)return g.s||e?r.a.createElement(r.a.Fragment,null,t):r.a.createElement(m.a,{size:"lg",className:"ml-3 my-0"},t)},this.getTypeChangeButton=e=>{let t;if(t=e?"type-change-button-fixed":"type-change-button","blogs"===this.props.type||"images"===this.props.type)return r.a.createElement(O,{id:t,history:this.props.history,type:this.props.type,groupID:this.props.groupID,ct:this.props.ct})},this.initMembers={},Object.values(b.n).forEach(e=>this.initMembers[e.id]=[]),this.state={membersCollection:this.initMembers},this.subNavbarRef=r.a.createRef(),this.InitUrl=e.match.url,e.domDispatch({type:"SET_SUBNAVBAR_REF",subNavbarRef:this.subNavbarRef,locationKey:e.location.key})}componentDidMount(){if("blogs"===this.props.type||"images"===this.props.type){const e=Object(g.a)(b.d,"members/");h.a.get(e).then(e=>{const t=this.initMembers;Object.values(b.n).forEach(a=>{if(a.isActive){t[a.id]=[];for(const s of e.data[a.key])t[a.id].push(s.map(e=>({url:e.url,full_kanji:e.full_kanji})))}}),this.setState({membersCollection:t})}).catch(e=>{console.log(e)}).finally()}}componentDidUpdate(e){Object(g.e)(this.props)&&this.props.match.url===this.InitUrl&&this.props.location.key!==e.location.key&&this.props.domDispatch({type:"SET_SUBNAVBAR_REF",subNavbarRef:this.subNavbarRef,locationKey:this.props.location.key})}render(){const e=this.getTypeChangeButton(!0),t=this.getModeSelectButtonGroupVerLeft(!0),a=this.getModeSelectButtonGroup(!0);return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"fixed-headline border-bottom text-muted pl-0 pl-lg-3",style:{top:g.s?b.v:0,height:b.A},ref:this.subNavbarRef},r.a.createElement(l.a,{mini:!0,className:"mr-0 mr-lg-2"}),this.props.title&&(t||a)&&r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,this.props.title),!g.s&&e,r.a.createElement("div",{className:"vertical-hr "+(g.s?"ml-3":"mx-2")})),this.props.title&&!t&&!a&&r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,this.props.title),!g.s&&e),r.a.createElement("div",{className:"fixed-headline-contents-wrapper",style:{height:b.A}},r.a.createElement("div",{className:"fixed-headline-contents-wrapper2",style:{height:b.A}},r.a.createElement("div",{className:"text-muted fixed-headline-contents"},t,a)))),!g.s&&r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"row justify-content-between mr-0"},r.a.createElement("div",{className:"d-flex align-items-center"},r.a.createElement(l.a,null),this.getModeSelectButtonGroupVerLeft(!1),this.props.title&&r.a.createElement("h3",{className:"ml-3 my-0"},this.props.title),this.getTypeChangeButton(!1)),this.getModeSelectButtonGroup(!1))))}}t.a=Object(u.o)(e=>r.a.createElement(y.a.Consumer,null,t=>r.a.createElement(C,w({},e,{domDispatch:t}))))},135:function(e,t,a){"use strict";var s=a(0),r=a.n(s),l=a(11),n=a(3),i=a(18),o=a(7),c=a(8);class m extends r.a.Component{constructor(...e){var t;return t=super(...e),this.goBack=()=>{n.r===this.props.location.key?this.props.history.push("/"):history.back()},t}render(){return this.props.mini?r.a.createElement(i.a,{className:"rounded-circle transparent-button-mobile "+(n.s?"mobile ":" ")+(this.props.className?this.props.className:""),id:"mobile-back-button",onClick:this.goBack},r.a.createElement(o.a,{icon:c.h})):this.props.fixed?r.a.createElement("button",{onClick:this.goBack,className:"btn btn-light rounded-circle p-0 otapick-back-button-fixed shadow-sm "+(this.props.className?this.props.className:"")},r.a.createElement(o.a,{icon:c.b,style:{color:"gray"}})):r.a.createElement("button",{onClick:this.goBack,className:"btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm "+(this.props.className?this.props.className:"")},r.a.createElement(o.a,{icon:c.b,style:{color:"gray"}}))}}t.a=Object(l.o)(m)},136:function(e,t,a){"use strict";var s=a(0),r=a.n(s),l=a(9),n=a(18),i=a(3);t.a=e=>{const{to:t,className:a,style:s,children:o,id:c=Object(i.j)()}=e;return r.a.createElement(l.Link,{to:t,style:{textDecoration:"none"},id:c},r.a.createElement(n.a,{className:a,style:s},o))}},145:function(e,t,a){"use strict";var s=a(0),r=a.n(s),l=a(180),n=a(130),i=a(131),o=a(128),c=a(9),m=a(11),p=a(3),u=a(51),d=a(7),h=a(8);const g=e=>r.a.createElement(l.a,{className:"text-center mx-auto py-3",style:{overflowY:"visible"}},r.a.createElement("div",{className:"card-detail-button-super"},r.a.createElement(n.a,{color:"light",className:"p-0 card-detail-button rounded-circle"},r.a.createElement(d.a,{icon:h.c,style:{color:"gray"}})),r.a.createElement(i.a,{className:"bold"},r.a.createElement(o.a,{tag:c.Link,to:e.url.images},"画像一覧へ"),r.a.createElement(o.a,{tag:c.Link,to:e.url.blogs},"ブログ一覧へ"),r.a.createElement(o.a,{href:e.officialUrl,target:"_blank"},"公式サイトで確認"))));class b extends r.a.Component{render(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"member-card mx-auto "+this.props.belongingGroup},r.a.createElement(c.Link,{to:this.props.url.images,style:{textDecoration:"none"}},r.a.createElement("div",{className:"member-card-header "+(p.s?"":"pc")},r.a.createElement("div",{className:"member-card-overlay",style:{backgroundImage:`url(${this.props.image})`}}),r.a.createElement("img",{src:this.props.image,className:"mb-3 mb-sm-4",alt:Object(p.i)(this.props.belongingGroup,this.props.lastKanji+this.props.firstKanji,"member")}),r.a.createElement("h4",{className:"m-0"},this.props.lastKanji," ",this.props.firstKanji),r.a.createElement("p",{style:{color:"whitesmoke"}},this.props.lastKana," ",this.props.firstKana))),r.a.createElement("svg",{className:"waves",viewBox:"0 24 150 28",preserveAspectRatio:"none",shapeRendering:"auto"},r.a.createElement("defs",null,r.a.createElement("path",{id:"gentle-wave",d:"M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"})),r.a.createElement("g",{className:"parallax"},r.a.createElement("use",{xlinkHref:"#gentle-wave",x:this.props.wavesVals[0],y:"0",fill:"rgba(255,255,255,0.7)"}),r.a.createElement("use",{xlinkHref:"#gentle-wave",x:this.props.wavesVals[1],y:"3",fill:"rgba(255,255,255,0.5)"}),r.a.createElement("use",{xlinkHref:"#gentle-wave",x:this.props.wavesVals[2],y:"5",fill:"rgba(255,255,255,0.3)"}),r.a.createElement("use",{xlinkHref:"#gentle-wave",x:this.props.wavesVals[3],y:"7",fill:"rgba(255,255,255)"}))),r.a.createElement("div",{className:"member-card-body"},p.s?r.a.createElement(u.a,{id:this.props.id,type:"memberCard",title:`${this.props.lastKanji} ${this.props.firstKanji}`,url:this.props.url,officialUrl:this.props.officialUrl,className:"mx-auto py-3"}):r.a.createElement(g,{url:this.props.url,officialUrl:this.props.officialUrl}))),this.props.message&&r.a.createElement("div",{className:"card-message mx-auto py-2"},r.a.createElement(d.a,{icon:h.j,style:{color:"gold"}})," ",r.a.createElement("b",null,this.props.message)))}}t.a=Object(m.o)(b)},146:function(e,t,a){"use strict";var s=a(147),r=a(53);function l(e,t){return t.encode?t.strict?s(e):encodeURIComponent(e):e}t.extract=function(e){return e.split("?")[1]||""},t.parse=function(e,t){var a=function(e){var t;switch(e.arrayFormat){case"index":return function(e,a,s){t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===s[e]&&(s[e]={}),s[e][t[1]]=a):s[e]=a};case"bracket":return function(e,a,s){t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==s[e]?s[e]=[].concat(s[e],a):s[e]=[a]:s[e]=a};default:return function(e,t,a){void 0!==a[e]?a[e]=[].concat(a[e],t):a[e]=t}}}(t=r({arrayFormat:"none"},t)),s=Object.create(null);return"string"!=typeof e?s:(e=e.trim().replace(/^(\?|#|&)/,""))?(e.split("&").forEach((function(e){var t=e.replace(/\+/g," ").split("="),r=t.shift(),l=t.length>0?t.join("="):void 0;l=void 0===l?null:decodeURIComponent(l),a(decodeURIComponent(r),l,s)})),Object.keys(s).sort().reduce((function(e,t){var a=s[t];return Boolean(a)&&"object"==typeof a&&!Array.isArray(a)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((function(e,t){return Number(e)-Number(t)})).map((function(e){return t[e]})):t}(a):e[t]=a,e}),Object.create(null))):s},t.stringify=function(e,t){var a=function(e){switch(e.arrayFormat){case"index":return function(t,a,s){return null===a?[l(t,e),"[",s,"]"].join(""):[l(t,e),"[",l(s,e),"]=",l(a,e)].join("")};case"bracket":return function(t,a){return null===a?l(t,e):[l(t,e),"[]=",l(a,e)].join("")};default:return function(t,a){return null===a?l(t,e):[l(t,e),"=",l(a,e)].join("")}}}(t=r({encode:!0,strict:!0,arrayFormat:"none"},t));return e?Object.keys(e).sort().map((function(s){var r=e[s];if(void 0===r)return"";if(null===r)return l(s,t);if(Array.isArray(r)){var n=[];return r.slice().forEach((function(e){void 0!==e&&n.push(a(s,e,n.length))})),n.join("&")}return l(s,t)+"="+l(r,t)})).filter((function(e){return e.length>0})).join("&"):""}},147:function(e,t,a){"use strict";e.exports=function(e){return encodeURIComponent(e).replace(/[!'()*]/g,(function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}))}},148:function(e,t,a){"use strict";a.d(t,"a",(function(){return v}));var s=a(0),r=a.n(s),l=a(180),n=a(130),i=a(131),o=a(128),c=a(9),m=a(11),p=a(3),u=a(51),d=a(8),h=a(7),g=a(4),b=a(132);function f(){return(f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(e[s]=a[s])}return e}).apply(this,arguments)}const E=e=>r.a.createElement(l.a,{className:"col-4 text-center",style:{overflowY:"visible"}},r.a.createElement("div",{className:"card-detail-button-super"},r.a.createElement(n.a,{color:"light",className:"p-0 card-detail-button rounded-circle"},r.a.createElement(h.a,{icon:d.c,style:{color:"gray"}})),r.a.createElement(i.a,{className:"bold"},r.a.createElement(o.a,{tag:c.Link,to:e.url},"ダウンロードページへ"),r.a.createElement(o.a,{href:e.officialUrl,target:"_blank"},"公式ブログで確認"))));class y extends r.a.Component{constructor(e){super(e),this.state={mountedBlogCard:!1,isLoadImage:!1},this.src=p.t?this.props.thumbnail["250x"]:"",this.srcset=p.t?"":`${this.props.thumbnail["250x"]} 1x, ${this.props.thumbnail["500x"]} 2x`}componentDidMount(){if(this.setState({mountedBlogCard:!0}),!this.props.orderly){const e=new Image;e.onload=()=>{this.setState({isLoadImage:!0})},e.src=this.src,e.srcset=this.srcset}}render(){var e;const t=Number.isFinite(this.props.width)&&this.props.width>0?this.props.width:250,a=Number.isFinite(this.props.height)&&this.props.height>0?this.props.height:250,s=null===(e=g.n[this.props.groupID])||void 0===e?void 0:e.key;return r.a.createElement("div",{className:"otapick_card "+this.props.group},r.a.createElement("div",{className:"card border border-top-0"},r.a.createElement("div",{className:"l-thumbnail"},r.a.createElement(c.Link,{to:this.props.url},r.a.createElement("figure",{className:p.s?"thumbnail-wrapper-mobile":"thumbnail-wrapper"},this.props.orderly?r.a.createElement("img",{className:"card-img-top newpost-thumbnail",style:{borderRadius:"0"},src:this.props.thumbnail["500x"],alt:Object(p.i)(this.props.group,this.props.writer.name,"thumbnail")}):this.state.isLoadImage?r.a.createElement("img",{className:"card-img-top",style:{borderRadius:"0"},src:this.src,srcSet:this.srcset,alt:Object(p.i)(this.props.group,this.props.writer.name,"thumbnail")}):r.a.createElement("div",{className:"image-card-preload-img-wrapper"},r.a.createElement("div",{className:"image-card-preload-img "+s,style:{backgroundColor:"lightgray",paddingTop:a/t*100+"%"}})))),!p.s&&r.a.createElement("span",{className:"more-button"},r.a.createElement("div",{className:"row justify-content-around"},r.a.createElement(b.a,{title:"公式ブログで確認"},r.a.createElement("div",{className:"col-4 p-0 mr-2",id:"to-official-page-"+this.props.id},r.a.createElement("a",{rel:"noreferrer",href:this.props.officialUrl,style:{color:"white"},target:"_blank"},r.a.createElement(h.a,{icon:d.o})))),r.a.createElement(b.a,{title:"ダウンロードページへ"},r.a.createElement("div",{className:"col-4 p-0 ml-2",id:"to-download-page-"+this.props.id},r.a.createElement(c.Link,{to:this.props.url,style:{color:"white"}},r.a.createElement(h.a,{icon:d.k}))))))),r.a.createElement("div",{className:"card-body pb-0 px-3 px-sm-4 pt-3"},r.a.createElement(c.Link,{to:this.props.url,style:{color:"dimgray"}},r.a.createElement("h6",{className:"card-title blog-title "+(this.props.orderly?"omit-title":"")},this.props.title?this.props.title:" ")),r.a.createElement("div",{className:"row"},r.a.createElement(c.Link,{to:this.props.writer.url.blogs,className:"card-text ml-3 small mb-2 pb-0 card-info writer-name "+this.props.group},this.props.writer.name),r.a.createElement("p",{className:"card-text ml-3 small mb-2 pb-0 card-info"},this.props.postDate)),r.a.createElement("div",{className:"container mb-2"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-4 card-parameter d-flex justify-content-center align-items-center"},r.a.createElement("div",{className:"row justify-content-around"},r.a.createElement("div",{className:"d-flex align-items-center"},r.a.createElement(h.a,{icon:d.p,style:{color:"gray"}}))," ",r.a.createElement("div",{className:"card-parameter-num"},Object(p.z)(this.props.numOfViews)))),p.s?r.a.createElement(u.a,{id:this.props.id,type:"blogCard",title:`${this.props.title}（${this.props.writer.name}）`,url:this.props.url,officialUrl:this.props.officialUrl,writer:this.props.writer,className:"col-4"}):r.a.createElement(E,{url:this.props.url,officialUrl:this.props.officialUrl}),r.a.createElement("div",{className:"col-4 card-parameter d-flex justify-content-center align-items-center"},r.a.createElement("div",{className:"row justify-content-around"},r.a.createElement("div",{className:"d-flex align-items-center"},r.a.createElement(h.a,{icon:d.k,style:{color:"gray"}}))," ",r.a.createElement("div",{className:"card-parameter-num"},Object(p.z)(this.props.numOfDownloads)))))))))}}const v=Object(m.o)(e=>r.a.createElement("div",{className:"otapick-card-back blog-card col-6 col-md-4 col-lg-3 mb-3 px-2 px-sm-3"},r.a.createElement(y,f({},e,{orderly:!0}))));class N extends r.a.Component{render(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"otapick-card-back"},r.a.createElement(y,f({},this.props,{orderly:!1}))),this.props.message&&r.a.createElement("div",{className:"card-message mx-auto py-2"},r.a.createElement(h.a,{icon:d.j,style:{color:"gold"}})," ",r.a.createElement("b",null,this.props.message)))}}t.b=r.a.memo(Object(m.o)(N))},160:function(e,t,a){"use strict";var s=a(2),r=a(6),l=a(0),n=a.n(l),i=a(1),o=a.n(i),c=a(14),m=a.n(c),p=a(5),u={tag:p.p,"aria-label":o.a.string,className:o.a.string,cssModule:o.a.object,role:o.a.string,size:o.a.string,vertical:o.a.bool},d=function(e){var t=e.className,a=e.cssModule,l=e.size,i=e.vertical,o=e.tag,c=Object(r.a)(e,["className","cssModule","size","vertical","tag"]),u=Object(p.l)(m()(t,!!l&&"btn-group-"+l,i?"btn-group-vertical":"btn-group"),a);return n.a.createElement(o,Object(s.a)({},c,{className:u}))};d.propTypes=u,d.defaultProps={tag:"div",role:"group"},t.a=d},179:function(e,t,a){"use strict";var s=a(0),r=a.n(s),l=a(3);class n extends r.a.Component{constructor(e){super(e)}render(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"card otapick-card2 "+(l.t?"smp mb-3 ":l.s?"mb-3 mt-1 ":"my-4 ")+this.props.group},r.a.createElement("div",{className:"card-body px-4 px-sm-5 py-4"},r.a.createElement("div",{className:"row mx-2 justify-content-between"},r.a.createElement("h2",{className:"my-auto d-flex align-items-center"},this.props.title?this.props.title:" ")),r.a.createElement("hr",{className:"info-hr"}),r.a.createElement("div",{className:"row justify-content-between"},r.a.createElement("div",{className:"col-12 col-md-6 col-lg-7 col-xl-8"},r.a.createElement("div",{className:"info-description my-1 my-sm-0"},"検索結果（",r.a.createElement("b",null,this.props.numOfHit),"件）"))))))}}t.a=n},180:function(e,t,a){"use strict";a.d(t,"a",(function(){return h}));var s=a(52),r=a(2),l=a(15),n=a(10),i=a(0),o=a.n(i),c=a(1),m=a.n(c),p=a(55),u=a(5),d=["defaultOpen"],h=function(e){function t(t){var a;return(a=e.call(this,t)||this).state={isOpen:t.defaultOpen||!1},a.toggle=a.toggle.bind(Object(l.a)(a)),a}Object(n.a)(t,e);var a=t.prototype;return a.toggle=function(e){this.setState({isOpen:!this.state.isOpen}),this.props.onToggle&&this.props.onToggle(e,!this.state.isOpen)},a.render=function(){return o.a.createElement(p.a,Object(r.a)({isOpen:this.state.isOpen,toggle:this.toggle},Object(u.m)(this.props,d)))},t}(i.Component);h.propTypes=Object(s.a)({defaultOpen:m.a.bool,onToggle:m.a.func},p.a.propTypes)},353:function(e,t,a){"use strict";a.r(t);var s=a(0),r=a.n(s),l=a(179),n=a(133),i=a(3),o=a(148),c=a(26),m=a.n(c),p=a(146),u=a.n(p),d=a(145),h=a(41),g=a(11),b=a(4),f=a(28);class E extends r.a.Component{constructor(e){super(e),this.initState={groupID:0,group:"",title:"",numOfHit:0,blogs:[],members:[],searchStatus:"",searchType:"",wavesVals:[]},this.state=this.initState,this.search()}search(){const e=Object(i.a)(b.d,"search/");setTimeout(()=>{m.a.get(e,{params:{q:u.a.parse(this.props.location.search).q,...i.s?{mobile:"true"}:{}}}).then(e=>{if("success"===e.data.status&&"url"===e.data.type){1==e.data.items.length&&this.props.history.replace(e.data.items[0].url);const t=e.data.items.map(e=>({blogCt:e.blog_ct,title:e.title,postDate:e.post_date,writer:e.writer,numOfViews:e.num_of_views,numOfDownloads:e.num_of_downloads,thumbnail:e.thumbnail,url:e.url,officialUrl:e.official_url}));this.setState({groupID:e.data.group_id,group:Object(i.m)(e.data.group_id),title:e.data.title,numOfHit:e.data.num_of_hit,blogs:t,members:[],searchStatus:e.data.status,searchType:e.data.type}),Object(i.D)({title:e.data.title+"｜ブログ検索結果",description:""})}else if("success"===e.data.status&&"member"===e.data.type){const t=e.data.items.map(e=>({image:e.image,url:e.url,officialUrl:e.official_url,ct:e.ct,lastKanji:e.last_kanji,firstKanji:e.first_kanji,lastKana:e.last_kana,firstKana:e.first_kana,belongingGroup:Object(i.m)(e.belonging_group)}));this.setState({groupID:0,group:"",title:`"${u.a.parse(this.props.location.search).q}"`,numOfHit:e.data.num_of_hit,members:t,blogs:[],searchStatus:e.data.status,searchType:e.data.type,wavesVals:Object(i.l)()}),Object(i.D)({title:`"${u.a.parse(this.props.location.search).q}"｜メンバー検索結果`,description:""})}else{let t;t="url"===e.data.type?"ブログが見つかりませんでした。":"member"===e.data.type?"メンバーが見つかりませんでした。":"条件に合う結果が見つかりませんでした。",this.setState({groupID:0,group:"",title:t,numOfHit:0,blogs:[],members:[],searchStatus:e.data.status,searchType:e.data.type}),"url"===e.data.type?Object(i.D)({title:"Not Found Blog",description:""}):"member"===e.data.type?Object(i.D)({title:"Not Found Member",description:""}):Object(i.D)({title:"Not Found",description:""})}}).catch(e=>{console.log(e)}).finally(()=>{Object(i.q)(this.props.location.pathname)})},b.k)}componentDidUpdate(e){e.location.search!==this.props.location.search&&(this.setState(this.initState),this.search())}render(){let e,t;return e=this.state.blogs.length>0?this.state.blogs.map(({blogCt:e,title:t,postDate:a,writer:s,numOfViews:l,numOfDownloads:n,thumbnail:i,url:c,officialUrl:m},p)=>r.a.createElement(o.a,{key:p,id:p,groupID:this.state.groupID,group:this.state.group,blogCt:e,thumbnail:i,title:t,writer:s,postDate:a,numOfViews:l,numOfDownloads:n,url:c,officialUrl:m})):this.state.members.length>0?this.state.members.map(({image:e,url:t,officialUrl:a,ct:s,lastKanji:l,firstKanji:n,lastKana:i,firstKana:o,belongingGroup:c},m)=>r.a.createElement("div",{key:m,className:"col-6 col-md-4 col-xl-3 my-2 px-1 px-sm-3"},r.a.createElement(d.a,{ct:s,image:e,url:t,officialUrl:a,lastKanji:l,firstKanji:n,lastKana:i,firstKana:o,belongingGroup:c,wavesVals:this.state.wavesVals}))):null,t=null!==e&&"success"===this.state.searchStatus?r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row mb-5",style:{marginTop:"2rem"}},e)):"url"===this.state.searchType?r.a.createElement("div",{className:"pb-5"},r.a.createElement(h.c,{type:"blog"})):"member"===this.state.searchType?r.a.createElement("div",{className:"pb-5"},r.a.createElement(h.c,{type:"member"})):r.a.createElement(f.c,{type:"horizontal"}),r.a.createElement("div",{className:"container mt-3 text-muted"},r.a.createElement(n.a,{title:"検索"}),r.a.createElement(l.a,{group:this.state.group,title:this.state.title,numOfHit:this.state.numOfHit}),t)}}t.default=Object(g.o)(E)}}]);