(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{"./src/components/atoms/BackButton.jsx":function(e,t,s){"use strict";var a=s("./node_modules/react/index.js"),n=s.n(a),o=s("./node_modules/react-router/esm/react-router.js"),r=s("./src/components/modules/utils.js"),l=s("./node_modules/reactstrap/es/index.js"),i=s("./node_modules/@fortawesome/react-fontawesome/index.es.js"),c=s("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");class m extends n.a.Component{constructor(...e){var t;return t=super(...e),this.goBack=()=>{r.t===this.props.location.key?this.props.history.push("/"):history.back()},t}render(){return this.props.mini?n.a.createElement(l.a,{className:"rounded-circle transparent-button-mobile "+(r.u?"mobile ":" ")+(this.props.className?this.props.className:""),id:"mobile-back-button",onClick:this.goBack},n.a.createElement(i.a,{icon:c.h})):this.props.fixed?n.a.createElement("button",{onClick:this.goBack,className:"btn btn-light rounded-circle p-0 otapick-back-button-fixed shadow-sm "+(this.props.className?this.props.className:"")},n.a.createElement(i.a,{icon:c.b,style:{color:"gray"}})):n.a.createElement("button",{onClick:this.goBack,className:"btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm "+(this.props.className?this.props.className:"")},n.a.createElement(i.a,{icon:c.b,style:{color:"gray"}}))}}t.a=Object(o.o)(m)},"./src/components/atoms/LinkButton.jsx":function(e,t,s){"use strict";var a=s("./node_modules/react/index.js"),n=s.n(a),o=s("./node_modules/react-router-dom/esm/react-router-dom.js"),r=s("./node_modules/reactstrap/es/index.js"),l=s("./src/components/modules/utils.js");t.a=e=>{const{to:t,className:s,style:a,children:i,id:c=Object(l.l)()}=e;return n.a.createElement(o.Link,{to:t,style:{textDecoration:"none"},id:c},n.a.createElement(r.a,{className:s,style:a},i))}},"./src/components/atoms/TooltipComponent.jsx":function(e,t,s){"use strict";var a=s("./node_modules/react/index.js"),n=s.n(a);t.a=e=>{const{children:t,title:s,backgroundColor:o="rgb(50, 50, 50)",placement:r="top"}=e,[l,i]=Object(a.useState)(!1);if(!s)return n.a.createElement(n.a.Fragment,null);const c=e=>n.a.createElement("div",{className:"tooltip-body rounded-pill px-2 py-1 "+e,style:{...o?{background:o}:{}}},s);return n.a.createElement("div",{className:"tooltip-container "+(l?"active":"")},n.a.createElement("span",{className:"tooltip-wrapper"},"top"===r&&c(r),n.a.createElement("div",{onMouseEnter:()=>{i(!0)},onMouseLeave:()=>{i(!1)}},t),"bottom"===r&&c(r)))}},"./src/components/molecules/Headline.jsx":function(e,t,s){"use strict";var a=s("./node_modules/react/index.js"),n=s.n(a),o=s("./src/components/atoms/BackButton.jsx"),r=s("./node_modules/reactstrap/es/index.js"),l=s("./node_modules/react-router-dom/esm/react-router-dom.js"),i=s("./node_modules/axios/index.js"),c=s.n(i),m=s("./src/components/modules/utils.js"),p=s("./src/components/modules/env.js"),u=s("./src/components/contexts/DomContext.jsx"),d=s("./src/components/atoms/LinkButton.jsx"),b=s("./node_modules/@fortawesome/react-fontawesome/index.es.js"),h=s("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),f=s("./src/components/atoms/TooltipComponent.jsx"),g=s("./src/components/contexts/ProfileContext.jsx"),y=s("./src/components/molecules/DropdownMobileFriendly.jsx");function E(){return(E=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var a in s)Object.prototype.hasOwnProperty.call(s,a)&&(e[a]=s[a])}return e}).apply(this,arguments)}class v extends n.a.Component{getChangeTypeUrl(e,t,s){return"blogs"===e?Object(m.a)("/images/",t,s):"images"===e?Object(m.a)("/blogs/",t,s):void 0}render(){const e="blogs"===this.props.type?"画像一覧に切り替えます":"ブログ一覧に切り替えます",t="blogs"===this.props.type?n.a.createElement(b.a,{icon:h.w}):n.a.createElement(b.a,{icon:h.y});return n.a.createElement(f.a,{title:e,placement:"bottom"},n.a.createElement(d.a,{to:this.getChangeTypeUrl(this.props.type,this.props.groupID,this.props.ct),className:"rounded-pill type-change-button ml-1",id:this.props.id},n.a.createElement("div",{className:"d-flex justify-content-center align-items-center",style:{color:"gray",fontSize:20}},n.a.createElement(b.a,{className:"mr-1 my-0",icon:h.o,style:{fontSize:12}}),t)))}}class j extends n.a.Component{constructor(e){super(e),this.getModeSelectButtonGroup=e=>{const t=({children:e})=>n.a.createElement(r.c,{size:"lg",className:"mt-3 mt-lg-0"},e);if("blogs"===this.props.type||"images"===this.props.type){const s=n.a.createElement(n.a.Fragment,null,n.a.createElement(r.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("recommend"===this.props.mode?"active":""),onClick:()=>this.props.history.push(`/${this.props.type}/`)},n.a.createElement("b",null,"おすすめ")),Object(m.D)(this.props.profileState.profile.favGroups).map(t=>n.a.createElement(r.a,{key:t.id,className:`rounded-pill mode-select-button ${t.key} `+(e?"fixed ":" ")+(m.u||e?" ":"d-flex align-items-center ")+(this.props.mode===t.key?"active":""),onClick:()=>this.props.history.push(`/${this.props.type}/${t.id}/`)},n.a.createElement("b",null,t.name),t.isActive&&n.a.createElement(y.a,{id:`mode-select-${this.props.type}-${t.key}`,directionOnlyPc:"down",buttonClass:`rounded-circle mode-select-dropdown-button ${e?"fixed p-0":""} ${t.key}`,buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu-members",menuSettings:[..."sakura"===t.key&&this.props.profileState.profile.favMemberSakura||"hinata"===t.key&&this.props.profileState.profile.favMemberHinata?(()=>{let e=[{type:"TITLE",label:"推しメン"}];return["favMemberSakura","favMemberHinata"].forEach(t=>{this.props.profileState.profile[t]&&(e=[...e,{type:"LINK",pathname:`/${this.props.type}/${p.n[this.props.profileState.profile[t].belongingGroup].id}/${this.props.profileState.profile[t].ct}/`,label:this.props.profileState.profile[t].fullKanji}])}),e})():[],...(()=>{let e=[];for(const[s,a]of this.state.membersCollection[t.id].entries())e=[...e,{type:"TITLE",label:s+1+"期生"}],e=[...e,...a.map(({url:e,full_kanji:t})=>({type:"LINK",pathname:e[this.props.type],label:t}))];return e})()]},n.a.createElement(b.a,{icon:h.a})))));return m.u||e?n.a.createElement(n.a.Fragment,null,s):n.a.createElement(t,null,s)}if("blogView"===this.props.type&&!m.u){const s=n.a.createElement(n.a.Fragment,null,n.a.createElement(r.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("view"===this.props.mode?"active":""),onClick:()=>this.props.changeMode("view")},n.a.createElement("b",null,"閲覧する")),n.a.createElement(r.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("download"===this.props.mode?"active":""),onClick:()=>this.props.changeMode("download")},n.a.createElement("b",null,"保存する")));return e?n.a.createElement(n.a.Fragment,null,s):n.a.createElement(t,null,s)}if("members"===this.props.type){const t=n.a.createElement(n.a.Fragment,null,Object(m.D)(this.props.profileState.profile.favGroups).map(t=>{if(t.isActive)return n.a.createElement(r.a,{key:t.id,className:`rounded-pill mode-select-button ${t.key} `+(e?"fixed ":" ")+(this.props.group===t.key?"active":""),onClick:()=>this.props.changeGroup(t.key)},n.a.createElement("b",null,t.name))}));return m.u||e?n.a.createElement(n.a.Fragment,null,t):n.a.createElement(r.c,{size:"lg"},t)}},this.getModeSelectButtonGroupVerLeft=e=>{let t;if("home"===this.props.type?t=n.a.createElement(n.a.Fragment,null,n.a.createElement(r.a,{className:"rounded-pill mode-select-button active "+(e?"fixed":""),onClick:()=>this.props.history.push("/")},n.a.createElement("b",null,"ホーム")),n.a.createElement(r.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+(m.u||e?"":"d-flex align-items-center"),onClick:()=>this.props.history.push("/images/")},n.a.createElement("b",null,"画像一覧"),n.a.createElement(y.a,{id:"mode-select-images-home",directionOnlyPc:"down",buttonClass:"rounded-circle mode-select-dropdown-button "+(e?"fixed p-0":""),buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu",menuSettings:[{type:"TITLE",label:"グループ選択"},...Object(m.D)(this.props.profileState.profile.favGroups).map(e=>({type:"LINK",pathname:`/images/${e.id}/`,label:""+e.name}))]},n.a.createElement(b.a,{icon:h.a}))),n.a.createElement(r.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+(m.u||e?"":"d-flex align-items-center"),onClick:()=>this.props.history.push("/blogs/")},n.a.createElement("b",null,"ブログ一覧"),n.a.createElement(y.a,{id:"mode-select-images-home",directionOnlyPc:"down",buttonClass:"rounded-circle mode-select-dropdown-button "+(e?"fixed p-0":""),buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu",menuSettings:[{type:"TITLE",label:"グループ選択"},...Object(m.D)(this.props.profileState.profile.favGroups).map(e=>({type:"LINK",pathname:`/blogs/${e.id}/`,label:""+e.name}))]},n.a.createElement(b.a,{icon:h.a})))):"terms"===this.props.type&&(t=n.a.createElement(n.a.Fragment,null,n.a.createElement(r.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("contact"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/contact/")},n.a.createElement("b",null,this.props.titleHash.contact)),n.a.createElement(r.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("termsOfService"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/terms-of-service/")},n.a.createElement("b",null,this.props.titleHash.termsOfService)),n.a.createElement(r.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("privacyPolicy"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/privacy-policy/")},n.a.createElement("b",null,this.props.titleHash.privacyPolicy)))),"home"===this.props.type||"terms"===this.props.type)return m.u||e?n.a.createElement(n.a.Fragment,null,t):n.a.createElement(r.c,{size:"lg",className:"ml-3 my-0"},t)},this.getTypeChangeButton=e=>{let t;if(t=e?"type-change-button-fixed":"type-change-button","blogs"===this.props.type||"images"===this.props.type)return n.a.createElement(v,{id:t,history:this.props.history,type:this.props.type,groupID:this.props.groupID,ct:this.props.ct})},this.initMembers={},Object.values(p.n).forEach(e=>this.initMembers[e.id]=[]),this.state={membersCollection:this.initMembers},this.subNavbarRef=n.a.createRef(),this.initUrl=e.match.url,this.initSearch=e.location.search,e.domDispatch({type:"SET_SUBNAVBAR_REF",subNavbarRef:this.subNavbarRef,locationKey:e.location.key})}componentDidMount(){if("blogs"===this.props.type||"images"===this.props.type){const e=Object(m.a)(p.d,"members/");c.a.get(e).then(e=>{const t=this.initMembers;Object.values(p.n).forEach(s=>{if(s.isActive){t[s.id]=[];for(const a of e.data[s.key])t[s.id].push(a.map(e=>({url:e.url,full_kanji:e.full_kanji})))}}),this.setState({membersCollection:t})}).catch(e=>{console.error(e)}).finally()}}componentDidUpdate(e){Object(m.e)(this.props)&&this.props.match.url===this.initUrl&&this.props.location.search===this.initSearch&&this.props.location.key!==e.location.key&&this.props.domDispatch({type:"SET_SUBNAVBAR_REF",subNavbarRef:this.subNavbarRef,locationKey:this.props.location.key})}render(){const e=this.getTypeChangeButton(!0),t=this.getModeSelectButtonGroupVerLeft(!0),s=this.getModeSelectButtonGroup(!0);return n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"fixed-headline border-bottom text-muted pl-0 pl-lg-3",style:{top:m.u?p.v:0,height:p.B},ref:this.subNavbarRef},n.a.createElement(o.a,{mini:!0,className:"mr-0 mr-lg-2"}),this.props.title&&(t||s)&&n.a.createElement(n.a.Fragment,null,n.a.createElement("h1",null,this.props.title),!m.u&&e,n.a.createElement("div",{className:"vertical-hr "+(m.u?"ml-3":"mx-2")})),this.props.title&&!t&&!s&&n.a.createElement(n.a.Fragment,null,n.a.createElement("h1",null,this.props.title),!m.u&&e),n.a.createElement("div",{className:"fixed-headline-contents-wrapper",style:{height:p.B,...m.u?{}:{overflow:"visible"}}},n.a.createElement("div",{className:"fixed-headline-contents-wrapper2",style:{height:p.B}},n.a.createElement("div",{className:"text-muted fixed-headline-contents"},t,s)))),!m.u&&n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"row justify-content-between mr-0"},n.a.createElement("div",{className:"d-flex align-items-center"},n.a.createElement(o.a,null),this.getModeSelectButtonGroupVerLeft(!1),this.props.title&&n.a.createElement("h3",{className:"ml-3 my-0"},this.props.title),this.getTypeChangeButton(!1)),this.getModeSelectButtonGroup(!1))))}}t.a=Object(l.withRouter)(e=>n.a.createElement(u.a.Consumer,null,t=>n.a.createElement(g.a.Consumer,null,s=>n.a.createElement(j,E({},e,{domDispatch:t,profileState:s})))))},"./src/components/pages/SettingsPage.jsx":function(e,t,s){"use strict";s.r(t);var a=s("./node_modules/react/index.js"),n=s.n(a),o=s("./src/components/contexts/AuthContext.jsx"),r=s("./node_modules/reactstrap/es/index.js"),l=s("./src/components/modules/env.js");var i=e=>{const{title:t,description:s,className:a=""}=e;return n.a.createElement("div",{className:"settings-header "+a},n.a.createElement("h2",{style:{fontSize:"2rem"}},t),n.a.createElement("p",null,s))},c=s("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),m=s("./node_modules/@fortawesome/react-fontawesome/index.es.js"),p=s("./src/components/molecules/DropdownMobileFriendly.jsx"),u=s("./src/components/modules/utils.js");var d=e=>{const{settingsSelectorId:t,items:s,setKey:o,resetKey:r,initKey:l="",height:i=46,blankLabel:d="選択されていません"}=e,[,b]=Object(a.useState)(l),[h]=Object(a.useState)(l?s.find(e=>e.key===l):void 0),[f,g]=Object(a.useState)(h?h.label:""),[y,E]=Object(a.useState)(h?h.imageUrl:""),v=.8*i;return n.a.createElement(p.a,{id:t,buttonContainerClass:"settings-selector-container",buttonClass:"settings-selector",buttonStyle:{height:i,borderRadius:.44*i},dropdownMenuClassOnlyPc:"settings-selector-menu",menuSettings:[...u.u?[{type:"TITLE",label:"推しメンを設定する"}]:[],...s.map(e=>void 0!==e.key?{type:"ONCLICK",label:e.label,onClick:()=>{o&&o(e.key),r!==e.key?(b(e.key),g(e.label),E(e.imageUrl)):(b(""),g(""),E(""))}}:{type:"TITLE",label:e.label})]},n.a.createElement("div",{className:"row align-items-center px-2 pr-4"},f?n.a.createElement(n.a.Fragment,null,y&&n.a.createElement("img",{className:"settings-selector-image",width:v,height:v,src:y,alt:f+"のプロフィール画像",style:{width:v,height:v,borderRadius:.44*v}}),n.a.createElement("div",{className:"settings-selector-title"},n.a.createElement("b",null,f))):n.a.createElement("div",{className:"bold settings-selector-title"},`- ${d} -`),n.a.createElement(m.a,{icon:c.a})))},b=s("./src/components/modules/axios.js"),h=s("./src/components/molecules/Loader.jsx");var f=e=>{const{url:t,methodType:s="put",data:r,title:l="保存",canSubmit:i=!1,thenCallback:c=(()=>{})}=e,m=Object(o.d)(),[p,d]=Object(a.useState)(!1),{isLoading:h,request:f}=Object(b.a)(t,s,{data:r,thenCallback:e=>{c&&c(e),d(!0)},catchCallback:()=>{d(!1)},token:m.token});let g="";return i&&(g="未保存"),p&&!i&&(g="保存されました"),h&&(g="保存しています..."),n.a.createElement("div",{className:"d-flex row justify-content-end align-items-center py-3 settings-submit"},g&&n.a.createElement("div",{className:"mx-3 font-weight-light settings-submit-status"},g),n.a.createElement("button",{disabled:!i||h,className:`settings-submit-button rounded-pill px-4 py-2 ${u.u?"mr-3":""} ${i?"active":""}`,onClick:()=>{f()},style:{...i?{}:{cursor:"default"},...h?{cursor:"wait"}:{}}},n.a.createElement("b",null,l)))},g=s("./src/components/contexts/ProfileContext.jsx");var y=()=>{const[e,t]=Object(a.useState)(),[s,o]=Object(a.useState)(),[r,c]=Object(a.useState)(!1),[m,p]=Object(a.useState)({groups:[],members:[]}),d=Object(g.d)(),h=Object(g.c)(),[y,v]=Object(a.useState)({}),j=(e,t)=>{const s=k(e,t);return{groups:e,members:Object.entries(s).map(([e,t])=>({group_id:e,ct:t}))}},k=(e,t)=>Object.fromEntries(Object.entries(t).filter(([t])=>{const s=t-0;return!isNaN(s)&&(null==e?void 0:e.includes(s))}));Object(a.useEffect)(()=>{let e=[];d.profile.favGroups&&(e=d.profile.favGroups.map(e=>e.groupId)),t(e);const s={};let a=[];d.profile.favMemberSakura&&(a=[...a,"favMemberSakura"]),d.profile.favMemberHinata&&(a=[...a,"favMemberHinata"]),a.forEach(e=>{s[d.profile[e].belongingGroup]=d.profile[e].ct}),o(s),v(j(e,s))},[d.profile]),Object(a.useEffect)(()=>{if(void 0!==e&&void 0!==s){const t=j(e,s);p(t),c(!((e,t)=>{if(!Object(u.v)(e)||!Object(u.v)(t))return!1;if(0===Object.keys(e).length||0===Object.keys(t).length)return!1;if(!Object(u.i)(e.groups,t.groups,!1))return!1;if(e.members.length!==t.members.length)return!1;return!!e.members.every(e=>!!t.members.some(t=>e.group_id===t.group_id&&e.ct===t.ct))})(y,t))}},[s,null==e?void 0:e.length]);const[x,N]=Object(a.useState)();return Object(b.a)(Object(u.a)(l.d,"members/"),"get",{thenCallback:e=>{const t=Object(u.g)(e.data);N(t)},shouldRequestDidMount:!0}),n.a.createElement(n.a.Fragment,null,n.a.createElement(i,{title:"推し設定",description:"好きなグループや推しメンを設定し、画像やブログの表示をカスタマイズしましょう。ここで設定したグループやメンバーはプロフィールに表示されます。",className:"mb-5"}),n.a.createElement(E,{members:x,favGroupIds:e,setFavGroupIds:t,favMembers:s,setFavMembers:o}),n.a.createElement(f,{url:Object(u.a)(l.d,"fav-members/"),methodType:"put",data:m,canSubmit:r,thenCallback:e=>{const t=Object(u.g)(e.data);h({type:"SET_PROFILE",profile:t})}}))};const E=e=>{const{members:t,favGroupIds:s,setFavGroupIds:o,favMembers:i,setFavMembers:c}=e,[m]=Object(a.useState)("RESET"),p=(e,t)=>{const s=e[t];let a=[{key:m,label:"リセット"}];return s.forEach((e,t)=>{const s={label:t+1+"期生"};a.push(s);const n=e.map(e=>({key:e.ct,label:e.fullKanji,imageUrl:e.image}));a.push(...n)}),a};return void 0!==s&&void 0!==i&&Object.values(l.n).map((e,a)=>{const l=s.includes(e.id),u="keyaki"!==e.key||!s.includes(1);return n.a.createElement("div",{key:a,className:"fav-members-editor-item"},n.a.createElement("button",{className:"fav-groups-button rounded-pill px-3 py-2 "+(l?"active "+e.key:""),onClick:()=>{(e=>{let t;t=s.includes(e)?s.filter(t=>t!==e):[...s,e],o(t)})(e.id)}},n.a.createElement("b",null,e.name)),n.a.createElement(r.d,{isOpen:l&&u},n.a.createElement("div",{className:"fav-members-editor-body px-4 pt-3 pb-1"},"keyaki"!==e.key?t?n.a.createElement("div",null,n.a.createElement("h6",null,"推しメン"),n.a.createElement(d,{settingsSelectorId:"settings-selector-fav-members-"+e.key,items:p(t,e.key),setKey:t=>{((e,t)=>{const s={...i};e===m?t in s&&delete s[t]:s[t]=e,c(s)})(t,e.id)},resetKey:m,height:70,blankLabel:"箱推し",initKey:String(e.id)in i?i[e.id]:""})):n.a.createElement(h.b,null):n.a.createElement("div",null,"欅坂46の推しメンは、櫻坂46の推しを有効にすることで設定できます。"))),n.a.createElement("hr",null))})};var v=s("./node_modules/react-router-dom/esm/react-router-dom.js"),j=s("./src/components/molecules/Headline.jsx");var k=e=>{const{SETTINGS_COLLECTION:t,type:s}=e;return n.a.createElement("div",{className:"container text-muted "+(u.u?"":"mt-3")},n.a.createElement(j.a,{title:"設定"}),n.a.createElement("div",{className:"my-1 mb-lg-4"},n.a.createElement("div",{className:"row"},n.a.createElement("div",{className:"col-lg-3"},n.a.createElement("div",{className:"settings-menu-container p-2 shadow-sm mb-3 mb-lg-0"},Object.entries(t).map(([e,t],a)=>{let o=s===e;return n.a.createElement(v.Link,{to:t.url,key:a,className:"d-flex settings-menu-item my-1 py-1 px-2 "+(o?"active":""),style:{textDecoration:"none"}},n.a.createElement("b",null,t.title))}))),n.a.createElement("div",{className:"col-lg-9"},t[s].contentTemplate))))};t.default=e=>{const{type:t}=e;if("Authenticated"!==Object(o.d)().status)return n.a.createElement(n.a.Fragment,null);const[s]=Object(a.useState)({FAV_MEMBERS:{title:"推し設定",contentTemplate:n.a.createElement(y,null),url:"/settings/fav-members/"}});return t in s?n.a.createElement(k,{SETTINGS_COLLECTION:s,type:t}):n.a.createElement(k,{SETTINGS_COLLECTION:s,type:"FAV_MEMBERS"})}}}]);