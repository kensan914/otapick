(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"./src/components/atoms/BackButton.jsx":function(e,t,a){"use strict";var s=a("./node_modules/react/index.js"),o=a.n(s),l=a("./node_modules/react-router/esm/react-router.js"),n=a("./node_modules/reactstrap/es/index.js"),r=a("./node_modules/@fortawesome/react-fontawesome/index.es.js"),c=a("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),i=a("./src/utils/index.js");class m extends o.a.Component{constructor(...e){var t;return t=super(...e),this.goBack=()=>{i.q===this.props.location.key?this.props.history.push("/"):history.back()},t}render(){return this.props.mini?o.a.createElement(n.a,{className:"rounded-circle transparent-button-mobile "+(i.r?"mobile ":" ")+(this.props.className?this.props.className:""),id:"mobile-back-button",onClick:this.goBack},o.a.createElement(r.a,{icon:c.h})):this.props.fixed?o.a.createElement("button",{onClick:this.goBack,className:"btn btn-light rounded-circle p-0 otapick-back-button-fixed shadow-sm "+(this.props.className?this.props.className:"")},o.a.createElement(r.a,{icon:c.b,style:{color:"gray"}})):o.a.createElement("button",{onClick:this.goBack,className:"btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm "+(this.props.className?this.props.className:"")},o.a.createElement(r.a,{icon:c.b,style:{color:"gray"}}))}}t.a=Object(l.o)(m)},"./src/components/molecules/Headline.jsx":function(e,t,a){"use strict";var s=a("./node_modules/react/index.js"),o=a.n(s),l=a("./node_modules/reactstrap/es/index.js"),n=a("./node_modules/react-router-dom/esm/react-router-dom.js"),r=a("./node_modules/axios/index.js"),c=a.n(r),i=a("./node_modules/@fortawesome/react-fontawesome/index.es.js"),m=a("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),d=a("./src/components/atoms/BackButton.jsx"),p=a("./src/utils/index.js"),u=a("./src/constants/env.js"),h=a("./src/contexts/DomContext.jsx"),b=a("./src/components/atoms/LinkButton.jsx"),g=a("./src/components/atoms/TooltipComponent.jsx"),f=a("./src/contexts/ProfileContext.jsx"),y=a("./src/components/molecules/DropdownMobileFriendly.jsx");function E(){return(E=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(e[s]=a[s])}return e}).apply(this,arguments)}class x extends o.a.Component{getChangeTypeUrl(e,t,a){return"blogs"===e?Object(p.a)("/images/",t,a):"images"===e?Object(p.a)("/blogs/",t,a):void 0}render(){const e="blogs"===this.props.type?"画像一覧に切り替えます":"ブログ一覧に切り替えます",t="blogs"===this.props.type?o.a.createElement(i.a,{icon:m.v}):o.a.createElement(i.a,{icon:m.x});return o.a.createElement(g.a,{title:e,placement:"bottom"},o.a.createElement(b.a,{to:this.getChangeTypeUrl(this.props.type,this.props.groupID,this.props.ct),className:"rounded-pill type-change-button ml-1",id:this.props.id},o.a.createElement("div",{className:"d-flex justify-content-center align-items-center",style:{color:"gray",fontSize:20}},o.a.createElement(i.a,{className:"mr-1 my-0",icon:m.o,style:{fontSize:12}}),t)))}}class v extends o.a.Component{constructor(e){super(e),this.getModeSelectButtonGroup=e=>{const t=({children:e})=>o.a.createElement(l.c,{size:"lg",className:"mt-3 mt-lg-0"},e);if("blogs"===this.props.type||"images"===this.props.type){const a=o.a.createElement(o.a.Fragment,null,o.a.createElement(l.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("recommend"===this.props.mode?"active":""),onClick:()=>this.props.history.push(`/${this.props.type}/`)},o.a.createElement("b",null,"おすすめ")),Object(p.A)(this.props.profileState.profile.favGroups).map(t=>o.a.createElement(l.a,{key:t.id,className:`rounded-pill mode-select-button ${t.key} `+(e?"fixed ":" ")+(p.r||e?" ":"d-flex align-items-center ")+(this.props.mode===t.key?"active":""),onClick:()=>this.props.history.push(`/${this.props.type}/${t.id}/`)},o.a.createElement("b",null,t.name),t.isActive&&o.a.createElement(y.a,{id:`mode-select-${this.props.type}-${t.key}`,directionOnlyPc:"down",buttonClass:`rounded-circle mode-select-dropdown-button ${e?"fixed p-0":""} ${t.key}`,buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu-members",menuSettings:[..."sakura"===t.key&&this.props.profileState.profile.favMemberSakura||"hinata"===t.key&&this.props.profileState.profile.favMemberHinata?(()=>{let e=[{type:"TITLE",label:"推しメン"}];return["favMemberSakura","favMemberHinata"].forEach(t=>{this.props.profileState.profile[t]&&(e=[...e,{type:"LINK",pathname:`/${this.props.type}/${u.m[this.props.profileState.profile[t].belongingGroup].id}/${this.props.profileState.profile[t].ct}/`,label:this.props.profileState.profile[t].fullKanji}])}),e})():[],...(()=>{let e=[],a=!1;const s=(e,a,s)=>(e=[...e,{type:"TITLE",label:s?"その他":a+"期生"}],e=[...e,...this.state.membersCollection[t.id][a].map(({url:e,full_kanji:t})=>({type:"LINK",pathname:e[this.props.type],label:t}))]);return Object.keys(this.state.membersCollection[t.id]).forEach(o=>{o!=t.otherMemberGeneration?e=s(e,o):a=!0}),a&&(e=s(e,t.otherMemberGeneration,!0)),e})()]},o.a.createElement(i.a,{icon:m.a})))));return p.r||e?o.a.createElement(o.a.Fragment,null,a):o.a.createElement(t,null,a)}if("blogView"===this.props.type&&!p.r){const a=o.a.createElement(o.a.Fragment,null,o.a.createElement(l.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("VIEW"===this.props.mode?"active":""),onClick:()=>this.props.changeMode("VIEW")},o.a.createElement("b",null,"閲覧する")),o.a.createElement(l.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("DL"===this.props.mode?"active":""),onClick:()=>this.props.changeMode("DL")},o.a.createElement("b",null,"保存する")));return e?o.a.createElement(o.a.Fragment,null,a):o.a.createElement(t,null,a)}if("members"===this.props.type){const t=o.a.createElement(o.a.Fragment,null,Object(p.A)(this.props.profileState.profile.favGroups).map(t=>{if(t.isActive)return o.a.createElement(l.a,{key:t.id,className:`rounded-pill mode-select-button ${t.key} ${e?"fixed":""} ${this.props.group===t.key?"active":""}`,onClick:()=>{this.props.history.push("/members/?group="+t.key)}},o.a.createElement("b",null,t.name))}));return p.r||e?o.a.createElement(o.a.Fragment,null,t):o.a.createElement(l.c,{size:"lg"},t)}},this.getModeSelectButtonGroupVerLeft=e=>{let t;if("home"===this.props.type?t=o.a.createElement(o.a.Fragment,null,o.a.createElement(l.a,{className:"rounded-pill mode-select-button active "+(e?"fixed":""),onClick:()=>this.props.history.push("/")},o.a.createElement("b",null,"ホーム")),o.a.createElement(l.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+(p.r||e?"":"d-flex align-items-center"),onClick:()=>this.props.history.push("/images/")},o.a.createElement("b",null,"画像一覧"),o.a.createElement(y.a,{id:"mode-select-images-home",directionOnlyPc:"down",buttonClass:"rounded-circle mode-select-dropdown-button "+(e?"fixed p-0":""),buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu",menuSettings:[{type:"TITLE",label:"グループ選択"},...Object(p.A)(this.props.profileState.profile.favGroups).map(e=>({type:"LINK",pathname:`/images/${e.id}/`,label:""+e.name}))]},o.a.createElement(i.a,{icon:m.a}))),o.a.createElement(l.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+(p.r||e?"":"d-flex align-items-center"),onClick:()=>this.props.history.push("/blogs/")},o.a.createElement("b",null,"ブログ一覧"),o.a.createElement(y.a,{id:"mode-select-images-home",directionOnlyPc:"down",buttonClass:"rounded-circle mode-select-dropdown-button "+(e?"fixed p-0":""),buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu",menuSettings:[{type:"TITLE",label:"グループ選択"},...Object(p.A)(this.props.profileState.profile.favGroups).map(e=>({type:"LINK",pathname:`/blogs/${e.id}/`,label:""+e.name}))]},o.a.createElement(i.a,{icon:m.a})))):"terms"===this.props.type&&(t=o.a.createElement(o.a.Fragment,null,o.a.createElement(l.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("contact"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/contact/")},o.a.createElement("b",null,this.props.titleHash.contact)),o.a.createElement(l.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("termsOfService"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/terms-of-service/")},o.a.createElement("b",null,this.props.titleHash.termsOfService)),o.a.createElement(l.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("privacyPolicy"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/privacy-policy/")},o.a.createElement("b",null,this.props.titleHash.privacyPolicy)))),"home"===this.props.type||"terms"===this.props.type)return p.r||e?o.a.createElement(o.a.Fragment,null,t):o.a.createElement(l.c,{size:"lg",className:"ml-3 my-0"},t)},this.getTypeChangeButton=e=>{let t;if(t=e?"type-change-button-fixed":"type-change-button","blogs"===this.props.type||"images"===this.props.type)return o.a.createElement(x,{id:t,history:this.props.history,type:this.props.type,groupID:this.props.groupID,ct:this.props.ct})},this.initMembers={},Object.values(u.m).forEach(e=>this.initMembers[e.id]=[]),this.state={membersCollection:this.initMembers},this.subNavbarRef=o.a.createRef(),this.initUrl=e.match.url,this.initSearch=e.location.search,e.domDispatch({type:"SET_SUBNAVBAR_REF",subNavbarRef:this.subNavbarRef,locationKey:e.location.key})}componentDidMount(){if("blogs"===this.props.type||"images"===this.props.type){const e=Object(p.a)(u.b,"members/");c.a.get(e).then(e=>{const t={...this.initMembers};Object.values(u.m).forEach(a=>{if(a.isActive){const s={...e.data[a.key]};t[a.id]=s}}),this.setState({membersCollection:t})}).catch(e=>{console.error(e)}).finally()}}componentDidUpdate(e){Object(p.d)(this.props.match)&&this.props.match.url===this.initUrl&&this.props.location.search===this.initSearch&&this.props.location.key!==e.location.key&&this.props.domDispatch({type:"SET_SUBNAVBAR_REF",subNavbarRef:this.subNavbarRef,locationKey:this.props.location.key})}render(){const e=this.getTypeChangeButton(!0),t=this.getModeSelectButtonGroupVerLeft(!0),a=this.getModeSelectButtonGroup(!0);return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"fixed-headline border-bottom text-muted pl-0 pl-lg-3",style:{top:p.r?u.u:0,height:u.A},ref:this.subNavbarRef},o.a.createElement(d.a,{mini:!0,className:"mr-0 mr-lg-2"}),this.props.title&&(t||a)&&o.a.createElement(o.a.Fragment,null,o.a.createElement("h1",null,this.props.title),!p.r&&e,o.a.createElement("div",{className:"vertical-hr "+(p.r?"ml-3":"mx-2")})),this.props.title&&!t&&!a&&o.a.createElement(o.a.Fragment,null,o.a.createElement("h1",null,this.props.title),!p.r&&e),o.a.createElement("div",{className:"fixed-headline-contents-wrapper",style:{height:u.A,...p.r?{}:{overflow:"visible"}}},o.a.createElement("div",{className:"fixed-headline-contents-wrapper2",style:{height:u.A}},o.a.createElement("div",{className:"text-muted fixed-headline-contents"},t,a)))),!p.r&&o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"row justify-content-between mr-0"},o.a.createElement("div",{className:"d-flex align-items-center"},o.a.createElement(d.a,null),this.getModeSelectButtonGroupVerLeft(!1),this.props.title&&o.a.createElement("h3",{className:"ml-3 my-0"},this.props.title),this.getTypeChangeButton(!1)),this.getModeSelectButtonGroup(!1))))}}t.a=Object(n.withRouter)(e=>o.a.createElement(h.a.Consumer,null,t=>o.a.createElement(f.a.Consumer,null,a=>o.a.createElement(v,E({},e,{domDispatch:t,profileState:a})))))},"./src/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo.jsx":function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));var s=a("./node_modules/react/index.js"),o=a.n(s),l=a("./src/utils/index.js");const n=e=>{const{groupKey:t,infoTitle:a,numOfHit:s}=e;return o.a.createElement("div",{className:`card otapick-card2 ${l.t?"smp mb-3":l.r?"mb-3 mt-1":"my-4"} ${t}`},o.a.createElement("div",{className:"card-body px-4 px-sm-5 py-4"},o.a.createElement("div",{className:"row mx-2 justify-content-between"},o.a.createElement("h2",{className:"my-auto d-flex align-items-center"},a||" ")),o.a.createElement("hr",{className:"info-hr"}),o.a.createElement("div",{className:"row justify-content-between"},o.a.createElement("div",{className:"col-12 col-md-6 col-lg-7 col-xl-8"},o.a.createElement("div",{className:"info-description my-1 my-sm-0"},"検索結果（",o.a.createElement("b",null,s),"件）")))))}},"./src/pages/BlogViewPage.jsx":function(e,t,a){"use strict";a.r(t);var s=a("./node_modules/react/index.js"),o=a.n(s),l=a("./node_modules/react-cookie/es6/index.js"),n=a("./src/contexts/DomContext.jsx"),r=a("./src/hooks/useAxios.js"),c=a("./src/hooks/useCacheRoute.js"),i=a("./src/components/molecules/Headline.jsx"),m=a("./node_modules/react-router-dom/esm/react-router-dom.js"),d=a("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),p=a("./node_modules/@fortawesome/react-fontawesome/index.es.js"),u=a("./src/utils/index.js"),h=a("./src/constants/env.js"),b=a("./src/components/atoms/TooltipComponent.jsx");const g=e=>{const{groupKey:t,infoTitle:a,writer:s,postDate:l,numOfViews:n,numOfDownloads:r,officialUrl:c}=e;let i;return Object.values(h.m).forEach(e=>{e.key===t&&(i=e.domain)}),o.a.createElement("div",{className:`card otapick-card2 ${u.t?"smp mb-3":u.r?"mb-3 mt-1":"my-4"} ${t}`},o.a.createElement("div",{className:"card-body px-4 px-sm-5 py-4"},a.length>0?a.length>50?o.a.createElement("h3",{className:"smaller"},a):o.a.createElement("h3",null,a):o.a.createElement("h3",null," "),o.a.createElement("div",{className:"row download-info mt-3"},Object.keys(s).length?o.a.createElement(m.Link,{to:s.url.blogs,className:"info-description ml-3 small "+t},s.name?s.name:" "):o.a.createElement(m.Link,{to:"",className:"info-description ml-3 small "+t}," "),o.a.createElement("p",{className:"info-description ml-3 small mb-0"},l)),o.a.createElement("hr",{className:"info-hr"}),o.a.createElement("div",{className:"row ml-2 ml-sm-3"},o.a.createElement("div",{className:"row col-12 col-sm-7 col-md-8 col-lg-9 col-xl-10 info-description"},o.a.createElement("div",{className:"d-flex align-items-center"},o.a.createElement(b.a,{title:"閲覧数"},o.a.createElement("div",{className:"d-flex align-items-center",id:"num-of-views-icon"},o.a.createElement(p.a,{icon:d.q,style:{color:"gray"}}))))," ",o.a.createElement("div",{className:""},n),o.a.createElement("div",{className:"d-flex align-items-center"},o.a.createElement(b.a,{title:"総ダウンロード数"},o.a.createElement("div",{className:"d-flex align-items-center ml-3",id:"num-of-downloads-icon"},o.a.createElement(p.a,{icon:d.l,style:{color:"gray"}}))))," ",o.a.createElement("div",{className:""},r)),o.a.createElement("div",{className:"col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 info-description px-0 mt-2 mt-sm-0"},o.a.createElement(b.a,{title:"公式ブログで確認"},o.a.createElement("a",{href:c,className:t,target:"_blank",rel:"noreferrer",id:"officialLink"},o.a.createElement("div",{className:"download-official-a"},o.a.createElement(p.a,{icon:d.p})," ",i)))))))};var f=a("./node_modules/axios/index.js"),y=a.n(f),E=a("./node_modules/file-saver/dist/FileSaver.min.js"),x=a("./node_modules/react-masonry-component/lib/index.js"),v=a.n(x),N=a("./src/components/molecules/ImageCard.jsx");var w=Object(l.a)(e=>{const{group:t,images:a,blogApiUrl:l,incrementNumOfDownloads:r,putDownload:c,mode:i,blogUrlPath:d,officialUrl:p,writer:b,blogCt:g,blogTitle:f,groupId:x,cookies:w}=e,[k,j]=Object(s.useState)(!1),[O,C]=Object(s.useState)(Array(a.length).fill(!1)),[S,_]=Object(s.useState)(!1),B=Object(n.c)(),D=Object(m.useLocation)(),I=()=>{let e=[];for(const[t,s]of a.entries())"VIEW"===i||"DL"===i&&(e.push(new Image),e[t].onload=setTimeout(()=>{const a=$(s.order);document.getElementById(a).style.backgroundImage="url("+e[t].src+")"},h.j),e[t].src=s.src.originals)};Object(s.useEffect)(()=>{I()},[]),Object(s.useEffect)(()=>{I()},[i]);const $=e=>`blog-image-${x}_${g}_${e}_${D.key}`;if("VIEW"===i){const e={itemSelector:".grid-item",transitionDuration:0,stagger:0};return o.a.createElement("div",{className:"container"},u.r&&o.a.createElement("div",{className:"alert alert-success mb-1",role:"alert",style:{borderRadius:"1rem",fontSize:14}},"画像を長押しして保存をおこなってください"),o.a.createElement(v.a,{options:e,className:"mt-3 image-list-in-blog-view"},a.map(({src:e,url:a,order:s,isFavorite:l,width:n,height:r})=>o.a.createElement("div",{key:s,className:"grid-item col-12 col-sm-6 my-2 my-sm-3 px-0 px-sm-2"},o.a.createElement(N.a,{groupId:x,groupKey:t,blogCt:g,blogTitle:f,srcCollection:e,urlPath:a,blogUrl:d,officialUrl:p,writer:b,priorityImageId:$(s),order:s,initIsFavorite:l,width:n,height:r,shouldLoadOriginal:!0,didMountImage:()=>{const e=$(s),t=document.getElementById(e);Object(u.b)(t,()=>c(s))}})))))}if("DL"===i)return o.a.createElement(o.a.Fragment,null,o.a.createElement("form",{onSubmit:e=>(e=>{if(e.preventDefault(),O.includes(!0)){let e=[];for(const[t,a]of O.entries())a&&e.push(t);y.a.post(l,e,{headers:{"X-CSRFToken":w.get("csrftoken")},responseType:"blob"}).then(t=>{B({type:"OPEN_GLOBAL_MODAL",globalModalId:"ImageDownloadedModal"}),j(!1),C(Array(a.length).fill(!1)),_(!1);const s=new Blob([t.data],{type:t.data.type}),o=t.headers["content-disposition"].match(/filename="(.*)"/)[1];Object(E.saveAs)(s,o),r(-1,e.length)})}else S||_(!0)})(e)},o.a.createElement("div",{className:"col-md-3 col-lg-2 ml-auto",style:{width:200}},o.a.createElement("div",{className:"custom-control custom-checkbox"},o.a.createElement("input",{name:"allCheck",type:"checkbox",className:"custom-control-input",id:"allCheck",checked:k,onChange:e=>(e=>{const t=e.target.checked;j(t),C([...O].fill(t))})(e)}),o.a.createElement("label",{className:"custom-control-label",htmlFor:"allCheck"},"すべて選択"))),o.a.createElement("div",{className:"container my-4"},o.a.createElement("div",{className:"row text-center"},a.map((e,a)=>o.a.createElement("div",{key:a,className:"col-6 col-md-4 col-xl-3 mb-5"},o.a.createElement("div",{style:{cursor:"pointer"},onClick:()=>(e=>{const t=[...O];t[e]=!t[e],C(t)})(e.order)},o.a.createElement("div",{className:t},o.a.createElement("div",{className:"thumbnail img-thumbnail mx-auto "+(O[e.order]?"checked":""),id:$(e.order),style:{background:`-webkit-image-set( url(${e.src["250x"]}) 1x, url(${e.src["500x"]}) 2x )`,backgroundSize:"cover",backgroundPosition:"center"}},o.a.createElement("input",{className:"save_img_checkbox",type:"checkbox",onChange:e=>(e=>{const t=e.target,a=t.checked,s=[...O];s[t.name]=a,C(s)})(e),name:e.order,checked:O[e.order]})))))))),S&&o.a.createElement("div",{className:"alert alert-danger py-2 mb-5 mt-0",role:"alert",style:{borderRadius:"1rem"}},"画像を選択してください。"),o.a.createElement("div",{className:"mx-auto mb-5",style:{width:150}},o.a.createElement("button",{type:"submit",className:"gradient-btn "+t,style:{width:150}},o.a.createElement("b",null,"保存")))))}),k=a("./src/components/molecules/Loader.jsx"),j=a("./src/components/atoms/NotFound.jsx"),O=a("./src/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo.jsx");const C=e=>{const{mode:t,changeMode:a,groupKey:s,addedNumOfViewsOnlyBlog:l,addedNumOfDownloadsOnlyBlog:n,images:r,blog:c,status:m,requestPutDownloadOnlyMobile:d,incrementNumOfDownloads:p,blogApiUrl:u,blogUrlPath:h}=e;let b;return""===m?b=o.a.createElement(k.b,{type:"horizontal"}):"success"===m?b=r.length>0?o.a.createElement(w,{group:s,images:r,blogApiUrl:u,incrementNumOfDownloads:(e,t)=>{p(e,t)},putDownload:e=>{d(e)},mode:t,blogUrlPath:h,officialUrl:c.officialUrl,writer:c.writer,blogCt:c.blogCt,blogTitle:c.title,groupId:c.groupId}):o.a.createElement(j.c,{type:"image",margin:!0}):"blog_not_found"!==m&&"get_image_failed"!==m||(b=o.a.createElement(j.c,{type:"blogFailed",margin:!0})),o.a.createElement("div",{className:"container mt-3 text-muted"},o.a.createElement(i.a,{title:"ブログ詳細",type:"blogView",mode:t,changeMode:e=>a(e)}),"blog_not_found"!==m?o.a.createElement(g,{groupKey:s,infoTitle:c?c.title:"",writer:c?c.writer:{},postDate:c?c.postDate:"",officialUrl:c?c.officialUrl:"",numOfViews:c?c.numOfViews+l:0,numOfDownloads:c?c.numOfDownloads+n:0}):o.a.createElement(O.a,{groupKey:s,infoTitle:c.title,numOfHit:0}),b)};var S=a("./src/hooks/useView.js"),_=a("./src/hooks/useMeta.js");t.default=Object(l.a)(e=>{const{cookies:t}=e,{isCachedRoute:a}=Object(c.a)(),l=t.get("csrftoken"),i=Object(n.d)(),m=Object(n.c)(),{groupId:d,blogCt:p,groupKey:u}=Object(S.b)(),{blogApiUrl:h,blogUrlPath:b,geneImageApiUrl:g}=Object(S.d)(d,p),[f,y]=Object(s.useState)("VIEW"),[E]=Object(s.useState)(`${d}_${p}`),{setMeta:x}=Object(_.a)(),v=(e,t,a)=>{switch(e){case"success":x(`${t}(${a})｜ブログ詳細`,`${a}のブログ「${t}」です。`);break;case"get_image_failed":x("Not Found Image","");break;case"blog_not_found":x("Not Found Blog","");break;case"accepted":x("画像取得中","");break;default:throw new Error(`the status "${e} is unexpected."`)}},[N,w,k,j,O,B,D]=Object(S.a)(h,v),{addedNumOfViewsOnlyBlog:I,incrementNumOfViews:$,addedNumOfDownloadsOnlyBlog:M,incrementNumOfDownloads:L}=Object(S.c)(N,w),{request:T}=Object(r.c)(h,"put",{data:{action:"view",key:O},csrftoken:l,thenCallback:e=>{"success"==e.data.status&&$(-1)},limitRequest:1});return Object(s.useEffect)(()=>{var e;!a&&D&&(i.accessedBlogs.includes(E)||(T(),m({type:"ACCESS_TO_BLOG",blogId:E})),null!=k&&null!==(e=k.writer)&&void 0!==e&&e.name&&v(j,k.title,k.writer.name))},[a,D]),o.a.createElement(C,{mode:f,changeMode:e=>{if(e!==f){if("VIEW"!==e&&"DL"!==e)throw new Error(`the mode "${e} is unexpected."`);y(e)}},groupKey:u,addedNumOfViewsOnlyBlog:I,addedNumOfDownloadsOnlyBlog:M,images:N,blog:k,status:j,requestPutDownloadOnlyMobile:e=>{const t=g(e);Object(r.b)(t,"put",{data:{action:"download",key:B},csrftoken:l,thenCallback:e=>{"success"==e.data.status&&L(-1)}})},incrementNumOfDownloads:L,blogApiUrl:h,blogUrlPath:b})})}}]);