(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{"./src/components/molecules/MemberCard.jsx":function(e,t,a){"use strict";var r=a("./node_modules/react/index.js"),s=a.n(r),l=a("./node_modules/react-router-dom/esm/react-router-dom.js"),o=a("./node_modules/@fortawesome/react-fontawesome/index.es.js"),i=a("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),n=a("./src/utils/index.js"),m=a("./src/components/molecules/DropdownMobileFriendly.jsx");class c extends s.a.Component{render(){return s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"member-card mx-auto "+this.props.belongingGroup},s.a.createElement(l.Link,{to:this.props.url.images,style:{textDecoration:"none"}},s.a.createElement("div",{className:"member-card-header "+(n.r?"":"pc")},s.a.createElement("div",{className:"member-card-overlay",style:{backgroundImage:`url(${this.props.image})`}}),s.a.createElement("img",{src:this.props.image,className:"mb-3 mb-sm-4",alt:Object(n.i)(this.props.belongingGroup,this.props.lastKanji+this.props.firstKanji,"member")}),s.a.createElement("h4",{className:"m-0"},this.props.lastKanji," ",this.props.firstKanji),s.a.createElement("p",{style:{color:"whitesmoke"}},this.props.lastKana," ",this.props.firstKana))),s.a.createElement("svg",{className:"waves",viewBox:"0 24 150 28",preserveAspectRatio:"none",shapeRendering:"auto"},s.a.createElement("defs",null,s.a.createElement("path",{id:"gentle-wave",d:"M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"})),s.a.createElement("g",{className:"parallax"},s.a.createElement("use",{xlinkHref:"#gentle-wave",x:this.props.wavesVals[0],y:"0",fill:"rgba(255,255,255,0.7)"}),s.a.createElement("use",{xlinkHref:"#gentle-wave",x:this.props.wavesVals[1],y:"3",fill:"rgba(255,255,255,0.5)"}),s.a.createElement("use",{xlinkHref:"#gentle-wave",x:this.props.wavesVals[2],y:"5",fill:"rgba(255,255,255,0.3)"}),s.a.createElement("use",{xlinkHref:"#gentle-wave",x:this.props.wavesVals[3],y:"7",fill:"rgba(255,255,255)"}))),s.a.createElement("div",{className:"member-card-body"},s.a.createElement("div",{className:"card-detail-button-super"},s.a.createElement(m.a,{id:"member-card-detail-button-"+this.props.id,buttonClass:"p-0 card-detail-button rounded-circle",buttonContainerClass:"text-center mx-auto py-3",buttonContainerStyle:{overflowY:"visible"},menuSettings:[...n.r?[{type:"TITLE",label:`${this.props.lastKanji} ${this.props.firstKanji}`}]:[],{type:"LINK",pathname:this.props.url.images,label:"画像一覧へ",icon:i.v},{type:"LINK",pathname:this.props.url.blogs,label:"ブログ一覧へ",icon:i.x},this.props.graduate||this.props.isOther?{}:{type:"ANCHOR",href:this.props.officialUrl,targetBlank:!0,label:"公式ブログで確認",icon:i.p}]},s.a.createElement(o.a,{icon:i.c,style:{color:"gray"}}))))),this.props.message&&s.a.createElement("div",{className:"card-message mx-auto py-2"},s.a.createElement(o.a,{icon:i.k,style:{color:"gold"}})," ",s.a.createElement("b",null,this.props.message)))}}t.a=Object(l.withRouter)(c)},"./src/pages/HomePage.jsx":function(e,t,a){"use strict";a.r(t);var r=a("./node_modules/react/index.js"),s=a.n(r),l=a("./node_modules/react-router-dom/esm/react-router-dom.js"),o=a("./src/components/molecules/BlogCard.jsx"),i=a("./src/utils/index.js"),n=a("./src/constants/env.js"),m=a("./src/components/molecules/ImageCard.jsx"),c=a("./src/components/molecules/MemberCard.jsx"),g=a("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),u=a("./node_modules/@fortawesome/react-fontawesome/index.es.js");var p=e=>{const{url:t,src:a,message:l,width:o,height:n}=e,[m,c]=Object(r.useState)(!1);Object(r.useEffect)(()=>{const e=new Image;e.onload=()=>{c(!0)},e.src=a},[]);const p=Number.isFinite(o)&&o>0?o:250,d=Number.isFinite(n)&&n>0?n:250;return s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"image-card"},s.a.createElement("a",{rel:"noreferrer",target:"_blank",href:t},s.a.createElement("div",{className:"image-card-wrapper "+(i.r?"":"pc")},m?s.a.createElement("img",{className:"image-card-img",src:a,alt:"ヲタピック公式Twitter広告"}):s.a.createElement("div",{className:"image-card-preload-img-wrapper loading-background"},s.a.createElement("div",{className:"image-card-preload-img",style:{paddingTop:d/p*100+"%"}}))))),l&&s.a.createElement("div",{className:"image-card-footer"},s.a.createElement("div",{className:"image-card-message "+(i.r?"mobile":"")},l&&s.a.createElement("a",{rel:"noreferrer",target:"_blank",href:t,style:{textDecoration:"none"}},s.a.createElement("div",{className:"card-message mx-auto py-2 "+(i.r?"":"pc")},s.a.createElement(u.a,{icon:g.s,style:{color:"deepskyblue"}})," ",s.a.createElement("b",null,l))))))},d=a("./src/hooks/useAxios.js"),b=a("./src/components/organisms/List.jsx"),h=a("./src/components/templates/ImageListTemplate/organisms/ImageList.jsx"),f=a("./src/contexts/AuthContext.jsx"),w=a("./src/contexts/ProfileContext.jsx");function j(){return(j=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}var v=Object(l.withRouter)(e=>{var t;const[a]=Object(r.useState)(Object(i.j)()),[l]=Object(r.useState)(Object(i.l)()),g=Object(f.c)(),u=Object(w.d)(),[v,E]=Object(r.useState)([]),y=Object(r.useRef)(-1),x=null!=u&&null!==(t=u.profile)&&void 0!==t&&t.favGroups?["?groups=",u.profile.favGroups.map(e=>e.groupId)]:[],{resData:_}=Object(d.c)(Object(i.a)(n.b,"home/additional/","?random_seed="+a,...x),"get",{thenCallback:e=>{if(e.data.length>0){let t=[];for(const a of e.data)null===a?t.push(null):"image"===a.type?t.push({groupID:a.blog.group_id,blogCt:a.blog.blog_ct,blogTitle:a.blog.title,src:a.image.src,url:a.image.url,blogUrl:a.blog.url,officialUrl:a.blog.official_url,writer:a.blog.writer,type:"image",message:a.message,order:a.image.order,isFavorite:a.image.is_favorite,width:a.image.width,height:a.image.height}):"blog"===a.type?t.push({groupID:a.blog.group_id,blogCt:a.blog.blog_ct,title:a.blog.title,postDate:a.blog.post_date,writer:a.blog.writer,numOfViews:a.blog.num_of_views,numOfDownloads:a.blog.num_of_downloads,thumbnail:a.blog.thumbnail,thumbnailWidth:a.blog.thumbnail_width,thumbnailHeight:a.blog.thumbnail_height,url:a.blog.url,officialUrl:a.blog.official_url,type:"blog",message:a.message}):"member"===a.type?t.push({image:a.member.image,url:a.member.url,officialUrl:a.member.official_url,ct:a.member.ct,lastKanji:a.member.last_kanji,firstKanji:a.member.first_kanji,lastKana:a.member.last_kana,firstKana:a.member.first_kana,belongingGroup:Object(i.m)(a.member.belonging_group),type:"member",message:a.message}):"twitter"===a.type&&t.push({type:"twitter",message:a.message,src:a.src,url:a.url,width:a.width,height:a.height});E(t)}},didRequestCallback:e=>{},shouldRequestDidMount:!0,token:g.token});return s.a.createElement(h.a,j({},e,{type:"HOME",additionalQParams:x,render:(t,a,r,n,g,u,d)=>{-1===y.current&&_&&(y.current=r);let h=0;return s.a.createElement(b.a,{hasMore:t,status:a,page:r,urlExcludePage:n,isLoading:g,request:u},d.map(({groupID:t,blogCt:a,blogTitle:r,src:n,url:g,blogUrl:u,officialUrl:d,writer:b,order:f,isFavorite:w,width:j,height:E},x)=>{let _;if(x%10==0&&v.length>h&&Math.floor(x/20)>=y.current){const t=v[h],a=`additional_${h}_${e.location.key}`;null===t?_=null:"image"===t.type?_=s.a.createElement(m.a,{id:a,groupId:t.groupID,groupKey:Object(i.m)(t.groupID),blogCt:t.blogCt,blogTitle:t.blogTitle,srcCollection:t.src,urlPath:t.url,blogUrl:t.blogUrl,officialUrl:t.officialUrl,writer:t.writer,footerMessage:t.message,order:t.order,initIsFavorite:t.isFavorite,width:t.width,height:t.height}):"blog"===t.type?_=s.a.createElement(o.b,{id:a,groupID:t.groupID,group:Object(i.m)(t.groupID),blogCt:t.blogCt,thumbnail:t.thumbnail,title:t.title,writer:t.writer,postDate:t.postDate,numOfViews:t.numOfViews,numOfDownloads:t.numOfDownloads,url:t.url,officialUrl:t.officialUrl,message:t.message,width:t.thumbnailWidth,height:t.thumbnailHeight}):"member"===t.type?_=s.a.createElement(c.a,{id:a,ct:t.ct,image:t.image,url:t.url,officialUrl:t.officialUrl,lastKanji:t.lastKanji,firstKanji:t.firstKanji,lastKana:t.lastKana,firstKana:t.firstKana,belongingGroup:t.belongingGroup,wavesVals:l,message:t.message}):"twitter"===t.type&&(_=s.a.createElement(p,{url:t.url,src:t.src,message:t.message,width:t.width,height:t.height})),h++}const O="grid-item col-6 col-md-4 col-lg-3 px-1 px-sm-2 "+(i.r?"my-1 ":"my-3 ");return s.a.createElement("div",{key:x},s.a.createElement("div",{className:O},s.a.createElement(m.a,{id:x,groupId:t,groupKey:Object(i.m)(t),blogCt:a,blogTitle:r,srcCollection:n,urlPath:g,blogUrl:u,officialUrl:d,writer:b,order:f,initIsFavorite:w,width:j,height:E})),_&&s.a.createElement("div",{className:O},_))}))}}))}),E=a("./src/components/molecules/Headline.jsx");const y=()=>s.a.createElement("div",{className:"container text-muted mt-3"},s.a.createElement(E.a,{type:"home"}),!i.r&&s.a.createElement("div",{className:"py-2"}),s.a.createElement(v,null));var x=a("./src/pages/ImageListPage/useImageListInfo.jsx");t.default=()=>(Object(x.a)(!0),s.a.createElement(y,null))}}]);