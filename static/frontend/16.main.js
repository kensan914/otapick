(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{149:function(e,t,a){"use strict";var s=a(2),o=a(6),n=a(52),i=a(0),r=a.n(i),l=a(1),c=a.n(l),d=a(14),p=a.n(d),m=a(154),h=a(5),u=Object(n.a)({},m.Transition.propTypes,{children:c.a.oneOfType([c.a.arrayOf(c.a.node),c.a.node]),tag:h.s,baseClass:c.a.string,baseClassActive:c.a.string,className:c.a.string,cssModule:c.a.object,innerRef:c.a.oneOfType([c.a.object,c.a.string,c.a.func])}),g=Object(n.a)({},m.Transition.defaultProps,{tag:"div",baseClass:"fade",baseClassActive:"show",timeout:h.e.Fade,appear:!0,enter:!0,exit:!0,in:!0});function b(e){var t=e.tag,a=e.baseClass,n=e.baseClassActive,i=e.className,l=e.cssModule,c=e.children,d=e.innerRef,u=Object(o.a)(e,["tag","baseClass","baseClassActive","className","cssModule","children","innerRef"]),g=Object(h.q)(u,h.c),b=Object(h.p)(u,h.c);return r.a.createElement(m.Transition,g,(function(e){var o="entered"===e,m=Object(h.o)(p()(i,a,o&&n),l);return r.a.createElement(t,Object(s.a)({className:m},b,{ref:d}),c)}))}b.propTypes=u,b.defaultProps=g,t.a=b},176:function(e,t,a){"use strict";var s=a(0),o=a.n(s),n=a(4);class i extends o.a.Component{render(){let e,t="";return Object.values(n.n).forEach(e=>{e.key===this.props.group&&(t="gradient-btn "+e.key)}),e=this.props.onClick?o.a.createElement("button",{className:t,onClick:this.props.onClick,style:{width:this.props.width+"px"}},o.a.createElement("b",null,this.props.title)):o.a.createElement("a",{href:this.props.href,className:t,style:{width:this.props.width+"px"}},o.a.createElement("b",null,this.props.title)),e}}t.a=i},191:function(e,t,a){"use strict";var s=a(0),o=a.n(s),n=a(3);class i extends o.a.Component{constructor(e){super(e)}render(){return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"card otapick-card2 "+(n.t?"smp mb-3 ":n.s?"mb-3 mt-1 ":"my-4 ")+this.props.group},o.a.createElement("div",{className:"card-body px-4 px-sm-5 py-4"},o.a.createElement("div",{className:"row mx-2 justify-content-between"},o.a.createElement("h2",{className:"my-auto d-flex align-items-center"},this.props.title?this.props.title:" ")),o.a.createElement("hr",{className:"info-hr"}),o.a.createElement("div",{className:"row justify-content-between"},o.a.createElement("div",{className:"col-12 col-md-6 col-lg-7 col-xl-8"},o.a.createElement("div",{className:"info-description my-1 my-sm-0"},"検索結果（",o.a.createElement("b",null,this.props.numOfHit),"件）"))))))}}t.a=i},357:function(e,t,a){"use strict";a.r(t);var s=a(0),o=a.n(s),n=a(133),i=a(3),r=a(26),l=a.n(r),c=a(11),d=a(9),p=a(4),m=a(8),h=a(7),u=a(134);class g extends o.a.Component{constructor(e){super(e)}render(){let e;return Object.values(p.n).forEach(t=>{t.key===this.props.group&&(e=t.domain)}),o.a.createElement("div",{className:"card otapick-card2 "+(i.t?"smp mb-3 ":i.s?"mb-3 mt-1 ":"my-4 ")+this.props.group},o.a.createElement("div",{className:"card-body px-4 px-sm-5 py-4"},this.props.title.length>0?this.props.title.length>50?o.a.createElement("h3",{className:"smaller"},this.props.title):o.a.createElement("h3",null,this.props.title):o.a.createElement("h3",null," "),o.a.createElement("div",{className:"row download-info mt-3"},Object.keys(this.props.writer).length?o.a.createElement(d.Link,{to:this.props.writer.url.blogs,className:"info-description ml-3 small "+this.props.group},this.props.writer.name?this.props.writer.name:" "):o.a.createElement(d.Link,{to:"",className:"info-description ml-3 small "+this.props.group}," "),o.a.createElement("p",{className:"info-description ml-3 small mb-0"},this.props.postDate)),o.a.createElement("hr",{className:"info-hr"}),o.a.createElement("div",{className:"row ml-2 ml-sm-3"},o.a.createElement("div",{className:"row col-12 col-sm-7 col-md-8 col-lg-9 col-xl-10 info-description"},o.a.createElement(u.a,{title:"閲覧数"},o.a.createElement("div",{className:"d-flex align-items-center",id:"num-of-views-icon"},o.a.createElement(h.a,{icon:m.p,style:{color:"gray"}})))," ",o.a.createElement("div",{className:""},this.props.numOfViews),o.a.createElement(u.a,{title:"総ダウンロード数"},o.a.createElement("div",{className:"d-flex align-items-center ml-3",id:"num-of-downloads-icon"},o.a.createElement(h.a,{icon:m.k,style:{color:"gray"}})))," ",o.a.createElement("div",{className:""},this.props.numOfDownloads)),o.a.createElement("div",{className:"col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 info-description px-0 mt-2 mt-sm-0"},o.a.createElement(u.a,{title:"公式ブログで確認"},o.a.createElement("a",{href:this.props.officialUrl,className:this.props.group,target:"_blank",rel:"noreferrer",id:"officialLink"},o.a.createElement("div",{className:"download-official-a"},o.a.createElement(h.a,{icon:m.o})," ",e)))))))}}var b=Object(c.o)(g),f=a(175),E=a(52),k=a(2),O=a(15),y=a(10),C=a(1),v=a.n(C),N=a(14),w=a.n(N),j=a(56),_=a.n(j),D=a(5),x={children:v.a.node.isRequired,node:v.a.any},T=function(e){function t(){return e.apply(this,arguments)||this}Object(y.a)(t,e);var a=t.prototype;return a.componentWillUnmount=function(){this.defaultNode&&document.body.removeChild(this.defaultNode),this.defaultNode=null},a.render=function(){return D.g?(this.props.node||this.defaultNode||(this.defaultNode=document.createElement("div"),document.body.appendChild(this.defaultNode)),_.a.createPortal(this.props.children,this.props.node||this.defaultNode)):null},t}(o.a.Component);T.propTypes=x;var A=T,M=a(149);function S(){}var I=v.a.shape(M.a.propTypes),B={isOpen:v.a.bool,autoFocus:v.a.bool,centered:v.a.bool,scrollable:v.a.bool,size:v.a.string,toggle:v.a.func,keyboard:v.a.bool,role:v.a.string,labelledBy:v.a.string,backdrop:v.a.oneOfType([v.a.bool,v.a.oneOf(["static"])]),onEnter:v.a.func,onExit:v.a.func,onOpened:v.a.func,onClosed:v.a.func,children:v.a.node,className:v.a.string,wrapClassName:v.a.string,modalClassName:v.a.string,backdropClassName:v.a.string,contentClassName:v.a.string,external:v.a.node,fade:v.a.bool,cssModule:v.a.object,zIndex:v.a.oneOfType([v.a.number,v.a.string]),backdropTransition:I,modalTransition:I,innerRef:v.a.oneOfType([v.a.object,v.a.string,v.a.func]),unmountOnClose:v.a.bool,returnFocusAfterClose:v.a.bool},F=Object.keys(B),R={isOpen:!1,autoFocus:!0,centered:!1,scrollable:!1,role:"dialog",backdrop:!0,keyboard:!0,zIndex:1050,fade:!0,onOpened:S,onClosed:S,modalTransition:{timeout:D.e.Modal},backdropTransition:{mountOnEnter:!0,timeout:D.e.Fade},unmountOnClose:!0,returnFocusAfterClose:!0},U=function(e){function t(t){var a;return(a=e.call(this,t)||this)._element=null,a._originalBodyPadding=null,a.getFocusableChildren=a.getFocusableChildren.bind(Object(O.a)(a)),a.handleBackdropClick=a.handleBackdropClick.bind(Object(O.a)(a)),a.handleBackdropMouseDown=a.handleBackdropMouseDown.bind(Object(O.a)(a)),a.handleEscape=a.handleEscape.bind(Object(O.a)(a)),a.handleStaticBackdropAnimation=a.handleStaticBackdropAnimation.bind(Object(O.a)(a)),a.handleTab=a.handleTab.bind(Object(O.a)(a)),a.onOpened=a.onOpened.bind(Object(O.a)(a)),a.onClosed=a.onClosed.bind(Object(O.a)(a)),a.manageFocusAfterClose=a.manageFocusAfterClose.bind(Object(O.a)(a)),a.clearBackdropAnimationTimeout=a.clearBackdropAnimationTimeout.bind(Object(O.a)(a)),a.state={isOpen:!1,showStaticBackdropAnimation:!1},a}Object(y.a)(t,e);var a=t.prototype;return a.componentDidMount=function(){var e=this.props,t=e.isOpen,a=e.autoFocus,s=e.onEnter;t&&(this.init(),this.setState({isOpen:!0}),a&&this.setFocus()),s&&s(),this._isMounted=!0},a.componentDidUpdate=function(e,t){if(this.props.isOpen&&!e.isOpen)return this.init(),void this.setState({isOpen:!0});this.props.autoFocus&&this.state.isOpen&&!t.isOpen&&this.setFocus(),this._element&&e.zIndex!==this.props.zIndex&&(this._element.style.zIndex=this.props.zIndex)},a.componentWillUnmount=function(){this.clearBackdropAnimationTimeout(),this.props.onExit&&this.props.onExit(),this._element&&(this.destroy(),this.props.isOpen&&this.close()),this._isMounted=!1},a.onOpened=function(e,t){this.props.onOpened(),(this.props.modalTransition.onEntered||S)(e,t)},a.onClosed=function(e){var t=this.props.unmountOnClose;this.props.onClosed(),(this.props.modalTransition.onExited||S)(e),t&&this.destroy(),this.close(),this._isMounted&&this.setState({isOpen:!1})},a.setFocus=function(){this._dialog&&this._dialog.parentNode&&"function"==typeof this._dialog.parentNode.focus&&this._dialog.parentNode.focus()},a.getFocusableChildren=function(){return this._element.querySelectorAll(D.k.join(", "))},a.getFocusedChild=function(){var e,t=this.getFocusableChildren();try{e=document.activeElement}catch(a){e=t[0]}return e},a.handleBackdropClick=function(e){if(e.target===this._mouseDownElement){e.stopPropagation();var t=this._dialog?this._dialog.parentNode:null;if(t&&e.target===t&&"static"===this.props.backdrop&&this.handleStaticBackdropAnimation(),!this.props.isOpen||!0!==this.props.backdrop)return;t&&e.target===t&&this.props.toggle&&this.props.toggle(e)}},a.handleTab=function(e){if(9===e.which){var t=this.getFocusableChildren(),a=t.length;if(0!==a){for(var s=this.getFocusedChild(),o=0,n=0;n<a;n+=1)if(t[n]===s){o=n;break}e.shiftKey&&0===o?(e.preventDefault(),t[a-1].focus()):e.shiftKey||o!==a-1||(e.preventDefault(),t[0].focus())}}},a.handleBackdropMouseDown=function(e){this._mouseDownElement=e.target},a.handleEscape=function(e){this.props.isOpen&&e.keyCode===D.n.esc&&this.props.toggle&&(this.props.keyboard?(e.preventDefault(),e.stopPropagation(),this.props.toggle(e)):"static"===this.props.backdrop&&(e.preventDefault(),e.stopPropagation(),this.handleStaticBackdropAnimation()))},a.handleStaticBackdropAnimation=function(){var e=this;this.clearBackdropAnimationTimeout(),this.setState({showStaticBackdropAnimation:!0}),this._backdropAnimationTimeout=setTimeout((function(){e.setState({showStaticBackdropAnimation:!1})}),100)},a.init=function(){try{this._triggeringElement=document.activeElement}catch(e){this._triggeringElement=null}this._element||(this._element=document.createElement("div"),this._element.setAttribute("tabindex","-1"),this._element.style.position="relative",this._element.style.zIndex=this.props.zIndex,document.body.appendChild(this._element)),this._originalBodyPadding=Object(D.l)(),Object(D.h)(),0===t.openCount&&(document.body.className=w()(document.body.className,Object(D.o)("modal-open",this.props.cssModule))),t.openCount+=1},a.destroy=function(){this._element&&(document.body.removeChild(this._element),this._element=null),this.manageFocusAfterClose()},a.manageFocusAfterClose=function(){if(this._triggeringElement){var e=this.props.returnFocusAfterClose;this._triggeringElement.focus&&e&&this._triggeringElement.focus(),this._triggeringElement=null}},a.close=function(){if(t.openCount<=1){var e=Object(D.o)("modal-open",this.props.cssModule),a=new RegExp("(^| )"+e+"( |$)");document.body.className=document.body.className.replace(a," ").trim()}this.manageFocusAfterClose(),t.openCount=Math.max(0,t.openCount-1),Object(D.r)(this._originalBodyPadding)},a.renderModalDialog=function(){var e,t=this,a=Object(D.p)(this.props,F);return o.a.createElement("div",Object(k.a)({},a,{className:Object(D.o)(w()("modal-dialog",this.props.className,(e={},e["modal-"+this.props.size]=this.props.size,e["modal-dialog-centered"]=this.props.centered,e["modal-dialog-scrollable"]=this.props.scrollable,e)),this.props.cssModule),role:"document",ref:function(e){t._dialog=e}}),o.a.createElement("div",{className:Object(D.o)(w()("modal-content",this.props.contentClassName),this.props.cssModule)},this.props.children))},a.render=function(){var e=this.props.unmountOnClose;if(this._element&&(this.state.isOpen||!e)){var t=!!this._element&&!this.state.isOpen&&!e;this._element.style.display=t?"none":"block";var a=this.props,s=a.wrapClassName,n=a.modalClassName,i=a.backdropClassName,r=a.cssModule,l=a.isOpen,c=a.backdrop,d=a.role,p=a.labelledBy,m=a.external,h=a.innerRef,u={onClick:this.handleBackdropClick,onMouseDown:this.handleBackdropMouseDown,onKeyUp:this.handleEscape,onKeyDown:this.handleTab,style:{display:"block"},"aria-labelledby":p,role:d,tabIndex:"-1"},g=this.props.fade,b=Object(E.a)({},M.a.defaultProps,{},this.props.modalTransition,{baseClass:g?this.props.modalTransition.baseClass:"",timeout:g?this.props.modalTransition.timeout:0}),f=Object(E.a)({},M.a.defaultProps,{},this.props.backdropTransition,{baseClass:g?this.props.backdropTransition.baseClass:"",timeout:g?this.props.backdropTransition.timeout:0}),O=c&&(g?o.a.createElement(M.a,Object(k.a)({},f,{in:l&&!!c,cssModule:r,className:Object(D.o)(w()("modal-backdrop",i),r)})):o.a.createElement("div",{className:Object(D.o)(w()("modal-backdrop","show",i),r)}));return o.a.createElement(A,{node:this._element},o.a.createElement("div",{className:Object(D.o)(s)},o.a.createElement(M.a,Object(k.a)({},u,b,{in:l,onEntered:this.onOpened,onExited:this.onClosed,cssModule:r,className:Object(D.o)(w()("modal",n,this.state.showStaticBackdropAnimation&&"modal-static"),r),innerRef:h}),m,this.renderModalDialog()),O))}return null},a.clearBackdropAnimationTimeout=function(){this._backdropAnimationTimeout&&(clearTimeout(this._backdropAnimationTimeout),this._backdropAnimationTimeout=void 0)},t}(o.a.Component);U.propTypes=B,U.defaultProps=R,U.openCount=0;var P=U,V=a(6),L={tag:D.s,wrapTag:D.s,toggle:v.a.func,className:v.a.string,cssModule:v.a.object,children:v.a.node,closeAriaLabel:v.a.string,charCode:v.a.oneOfType([v.a.string,v.a.number]),close:v.a.object},z=function(e){var t,a=e.className,s=e.cssModule,n=e.children,i=e.toggle,r=e.tag,l=e.wrapTag,c=e.closeAriaLabel,d=e.charCode,p=e.close,m=Object(V.a)(e,["className","cssModule","children","toggle","tag","wrapTag","closeAriaLabel","charCode","close"]),h=Object(D.o)(w()(a,"modal-header"),s);if(!p&&i){var u="number"==typeof d?String.fromCharCode(d):d;t=o.a.createElement("button",{type:"button",onClick:i,className:Object(D.o)("close",s),"aria-label":c},o.a.createElement("span",{"aria-hidden":"true"},u))}return o.a.createElement(l,Object(k.a)({},m,{className:h}),o.a.createElement(r,{className:Object(D.o)("modal-title",s)},n),p||t)};z.propTypes=L,z.defaultProps={tag:"h5",wrapTag:"div",closeAriaLabel:"Close",charCode:215};var $=z,K={tag:D.s,className:v.a.string,cssModule:v.a.object},W=function(e){var t=e.className,a=e.cssModule,s=e.tag,n=Object(V.a)(e,["className","cssModule","tag"]),i=Object(D.o)(w()(t,"modal-body"),a);return o.a.createElement(s,Object(k.a)({},n,{className:i}))};W.propTypes=K,W.defaultProps={tag:"div"};var q=W,X={tag:D.s,className:v.a.string,cssModule:v.a.object},Y=function(e){var t=e.className,a=e.cssModule,s=e.tag,n=Object(V.a)(e,["className","cssModule","tag"]),i=Object(D.o)(w()(t,"modal-footer"),a);return o.a.createElement(s,Object(k.a)({},n,{className:i}))};Y.propTypes=X,Y.defaultProps={tag:"div"};var H=Y,J=a(176);class G extends o.a.Component{constructor(e){super(e),this.state={modal:!1},this.toggleModal=this.toggleModal.bind(this)}toggleModal(){this.setState(e=>({modal:!e.modal}))}render(){return o.a.createElement(P,{isOpen:this.state.modal,toggle:this.toggleModal,className:this.props.className,centered:!0},o.a.createElement($,{toggle:this.toggleModal},"保存完了"),o.a.createElement(q,null,o.a.createElement("p",null,"ダウンロードダイアログにしたがって、画像を保存してください。")),o.a.createElement(H,null,o.a.createElement("div",{className:"mx-auto",style:{width:180}},o.a.createElement(J.a,{group:this.props.group,onClick:()=>history.back(),width:180,title:"戻る"}))))}}var Q=G,Z=a(155),ee=a.n(Z),te=a(153),ae=a(131);class se extends o.a.Component{constructor(e){super(e),this.geneImageID=e=>`blog-image-${this.props.groupID}_${this.props.blogCt}_${e}_${this.props.location.key}`,this.state={allCheck:!1,check:Array(this.props.images.length).fill(!1),showAlert:!1},this.modalRef=o.a.createRef()}handleSubmit(e){if(e.preventDefault(),this.state.check.includes(!0)){let e=[];for(const[t,a]of this.state.check.entries())a&&e.push(t);l.a.post(this.props.blogViewURL,e,{headers:{"X-CSRFToken":this.props.cookies.get("csrftoken")},responseType:"blob"}).then(t=>{this.modalRef.current.toggleModal(),this.setState({allCheck:!1,check:Array(this.props.images.length).fill(!1),showAlert:!1});const a=new Blob([t.data],{type:t.data.type}),s=t.headers["content-disposition"].match(/filename="(.*)"/)[1];Object(f.saveAs)(a,s),this.props.incrementNumOfDownloads(-1,e.length)})}else this.state.showAlert||this.setState({showAlert:!0})}handleAllCheckChange(e){const t=e.target.checked;this.setState((function(e){let a=e.check;return{allCheck:t,check:a.fill(t)}}))}handleCheckChange(e){const t=e.target,a=t.checked;this.setState((function(e){let s=e.check;return s[t.name]=a,{check:s}}))}changeCheck(e){this.setState((function(t){let a=t.check;return a[e]=!a[e],{check:a}}))}loadOriginalImage(){let e=[];for(const[t,a]of this.props.images.entries())"view"===this.props.mode||"download"===this.props.mode&&(e.push(new Image),e[t].onload=setTimeout(()=>{const s=this.geneImageID(a.order),o=document.getElementById(s);console.log(o,s),o.style.backgroundImage="url("+e[t].src+")"},p.k),e[t].src=a.src.originals)}componentDidMount(){this.loadOriginalImage()}componentDidUpdate(e){e.mode!==this.props.mode&&this.loadOriginalImage()}render(){if("view"===this.props.mode){const e={itemSelector:".grid-item",transitionDuration:0,stagger:0};return o.a.createElement("div",{className:"container"},i.s&&o.a.createElement("div",{className:"alert alert-success mb-1",role:"alert",style:{borderRadius:"1rem",fontSize:14}},"画像を長押しして保存をおこなってください"),o.a.createElement(ee.a,{options:e,className:"mt-3 image-list-in-blog-view"},this.props.images.map(({src:e,url:t,order:a,isFavorite:s,width:n,height:r},l)=>o.a.createElement("div",{key:l,className:"grid-item col-12 col-sm-6 my-2 my-sm-3 px-0 px-sm-2"},o.a.createElement(te.a,{key:l,groupID:this.props.groupID,group:this.props.group,blogCt:this.props.blogCt,blogTitle:this.props.blogTitle,src:e,url:t,blogUrl:this.props.blogUrl,officialUrl:this.props.officialUrl,writer:this.props.writer,imgID:this.geneImageID(a),order:a,isFavorite:s,width:n,height:r,shouldLoadOriginal:!0,didMountImage:()=>{const e=this.geneImageID(a),t=document.getElementById(e);Object(i.b)(t,()=>this.props.putDownload(a))}})))))}if("download"===this.props.mode)return o.a.createElement(o.a.Fragment,null,o.a.createElement("form",{onSubmit:e=>this.handleSubmit(e)},o.a.createElement("div",{className:"col-md-3 col-lg-2 ml-auto",style:{width:200}},o.a.createElement("div",{className:"custom-control custom-checkbox"},o.a.createElement("input",{name:"allCheck",type:"checkbox",className:"custom-control-input",id:"allCheck",checked:this.state.allCheck,onChange:e=>this.handleAllCheckChange(e)}),o.a.createElement("label",{className:"custom-control-label",htmlFor:"allCheck"},"すべて選択"))),o.a.createElement("div",{className:"container my-4"},o.a.createElement("div",{className:"row text-center"},this.props.images.map((e,t)=>o.a.createElement("div",{key:t,className:"col-6 col-md-4 col-xl-3 mb-5"},o.a.createElement("div",{style:{cursor:"pointer"},onClick:()=>this.changeCheck(e.order)},o.a.createElement("div",{className:this.props.group},o.a.createElement("div",{className:"thumbnail img-thumbnail mx-auto "+(this.state.check[e.order]?"checked":""),id:this.geneImageID(e.order),style:{background:`-webkit-image-set( url(${e.src["250x"]}) 1x, url(${e.src["500x"]}) 2x )`,backgroundSize:"cover",backgroundPosition:"center"}},o.a.createElement("input",{className:"save_img_checkbox",type:"checkbox",onChange:e=>this.handleCheckChange(e),name:e.order,checked:this.state.check[e.order]})))))))),this.state.showAlert&&o.a.createElement("div",{className:"alert alert-danger py-2 mb-5 mt-0",role:"alert",style:{borderRadius:"1rem"}},"画像を選択してください。"),o.a.createElement("div",{className:"mx-auto mb-5",style:{width:150}},o.a.createElement("button",{type:"submit",className:"gradient-btn "+this.props.group,style:{width:150}},o.a.createElement("b",null,"保存")))),o.a.createElement(Q,{ref:this.modalRef,group:this.props.group}))}}var oe=Object(c.o)(Object(ae.a)(se)),ne=a(28),ie=a(41),re=a(191),le=a(141),ce=a(170),de=a(27),pe=a(24);function me(){return(me=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(e[s]=a[s])}return e}).apply(this,arguments)}class he extends ce.a{constructor(e){super(e),this.changeMode=e=>{e!==this.state.mode&&("view"===e||"download"===e?this.setState({mode:e}):this.setState({mode:""}))},this.isRender=Object(i.d)(e.history,e.match.params.groupID,e.match.params.blogCt),this.initBlogState={mode:"view"},this.state=Object.assign(this.initState,this.initBlogState)}putView(){l.a.put(this.blogViewURL,{action:"view",key:this.state.VIEW_KEY},{headers:{"X-CSRFToken":this.props.cookies.get("csrftoken")}}).then(e=>{"success"==e.data.status&&this.incrementNumOfViews()})}putDownload(e){l.a.put(Object(i.a)(p.d,"image/",this.state.groupID,this.state.blogCt,e.toString()),{action:"download",key:this.state.DOWNLOAD_KEY},{headers:{"X-CSRFToken":this.props.cookies.get("csrftoken")}}).then(e=>{"success"==e.data.status&&this.incrementNumOfDownloads()})}updateMetaVerView(e,t,a){this.isRender&&("success"===e?Object(i.D)({title:`${t}(${a})｜ブログ詳細`,description:`${a}のブログ「${t}」です。`}):"get_image_failed"===e?Object(i.D)({title:"Not Found Image",description:""}):"blog_not_found"===e?Object(i.D)({title:"Not Found Blog",description:""}):"accepted"===e&&Object(i.D)({title:"画像取得中",description:""}))}componentDidMount(){this.isRender&&super.componentDidMount()}componentDidUpdate(e,t){if(t.status!==this.state.status&&"success"===this.state.status&&this.state.VIEW_KEY){const e=`${this.state.groupID}_${this.state.blogCt}_${this.props.location.key}`;this.props.domState.accessedBlogs.includes(e)||(this.putView(),this.props.domDispatch({type:"ACCESS_TO_BLOG",blogID:e}))}const a=this.props.match.params.groupID,s=e.match.params.groupID,o=this.props.match.params.blogCt,n=e.match.params.blogCt;s===a&&n===o||(this.initBlogState={mode:"view",groupID:a,blogCt:o,group:Object(i.m)(a)},this.setState(Object.assign(this.initState,this.initBlogState)),this.blogViewURL=Object(i.a)(p.d,"blog/",a,o),this.getBlog()),super.componentDidUpdate(e,t)}componentWillUnmount(){super.componentWillUnmount(),this.isRender=!1}render(){let e;return""===this.state.status?e=o.a.createElement(ne.c,{type:"horizontal"}):"success"===this.state.status?e=this.state.images.length>0?o.a.createElement(oe,{group:this.state.group,images:this.state.images,blogViewURL:this.blogViewURL,incrementNumOfDownloads:(e,t)=>this.incrementNumOfDownloads(e,t),putDownload:e=>this.putDownload(e),mode:this.state.mode,blogUrl:this.state.url,officialUrl:this.state.officialUrl,writer:this.state.writer,blogCt:this.state.blogCt,blogTitle:this.state.title,groupID:this.state.groupID}):o.a.createElement(ie.c,{type:"image",margin:!0}):"accepted"===this.state.status?e=o.a.createElement(ne.a,{progress:this.state.progress,loadingImageUrl:p.q}):"blog_not_found"!==this.state.status&&"get_image_failed"!==this.state.status||(e=o.a.createElement(ie.c,{type:"blogFailed",margin:!0})),o.a.createElement(o.a.Fragment,null,this.isRender&&o.a.createElement("div",{className:"container mt-3 text-muted"},o.a.createElement(n.a,{title:"ブログ詳細",type:"blogView",mode:this.state.mode,changeMode:e=>this.changeMode(e)}),"blog_not_found"!==this.state.status?o.a.createElement(b,{group:this.state.group,title:this.state.title,writer:this.state.writer,postDate:this.state.postDate,officialUrl:this.state.officialUrl,numOfViews:this.state.numOfViews,numOfDownloads:this.state.numOfDownloads}):o.a.createElement(re.a,{group:this.state.group,title:this.state.title,numOfHit:0}),o.a.createElement("div",{className:"container mt-4"},i.t?o.a.createElement(le.b,null):o.a.createElement(le.a,{height:"100px"})),e))}}t.default=Object(c.o)(Object(ae.a)(e=>o.a.createElement(de.b.Consumer,null,t=>o.a.createElement(de.a.Consumer,null,a=>o.a.createElement(pe.a.Consumer,null,s=>o.a.createElement(he,me({},e,{domState:t,domDispatch:a,authState:s})))))))}}]);