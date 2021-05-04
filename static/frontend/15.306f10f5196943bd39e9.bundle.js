(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{"./src/components/organisms/Footer.jsx":function(e,t,a){"use strict";a.r(t);var r=a("./node_modules/react/index.js"),l=a.n(r),s=a("./node_modules/react-router-dom/esm/react-router-dom.js"),o=a("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),n=a("./node_modules/@fortawesome/react-fontawesome/index.es.js");function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}var m=a("./src/constants/env.js"),i=a("./src/utils/index.js");class h extends l.a.Component{constructor(e){super(e),this.state={show:!0},this.exclusiveKeys=[]}applyShowFooter(e){this.exclusiveKeys.push(e.key),e===this.props.location&&this.showFooter()}showFooter(){this.state.show||this.setState({show:!0})}hideFooter(){this.state.show&&this.setState({show:!1})}checkFooter(){let e=!1;for(const t of m.C)if("/"===t){if("/"===this.props.location.pathname){-1===this.exclusiveKeys.indexOf(this.props.location.key)&&(e=!0);break}}else if(this.props.location.pathname.startsWith(t)){-1===this.exclusiveKeys.indexOf(this.props.location.key)&&(e=!0);break}e?this.hideFooter():this.showFooter()}componentDidMount(){this.checkFooter()}componentDidUpdate(e){this.props.location!==e.location&&this.checkFooter()}render(){return this.state.show?l.a.createElement(l.a.Fragment,null,l.a.createElement("footer",{className:"footer bg-light text-muted "+(this.props.class?this.props.class:"")},l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col-xl-3 col-lg-12 col-xs-12 text-center mb-5"},l.a.createElement(s.Link,{className:"navbar-brand ml-4 ml-xl-0",to:"/"})),l.a.createElement("div",{className:"col-xl-3 col-lg-4 col-xs-12"},l.a.createElement("ul",{className:"footer-menu"},l.a.createElement("span",{className:"font-weight-bold"},"画像を探す"),l.a.createElement("hr",{className:"my-1 mr-4 mr-lg-0"}),Object.values(m.m).map(e=>l.a.createElement(l.a.Fragment,{key:e.id},l.a.createElement("li",null,l.a.createElement(s.Link,{to:"/images/"+e.id},e.name+" 画像一覧")),l.a.createElement("li",null,l.a.createElement(s.Link,{to:"/blogs/"+e.id},e.name+" ブログ一覧")))),l.a.createElement("li",null,l.a.createElement(s.Link,{to:"/members"},"メンバーリスト")))),l.a.createElement("div",{className:"col-xl-3 col-lg-4 col-xs-12"},l.a.createElement("ul",{className:"footer-menu"},l.a.createElement("span",{className:"font-weight-bold"},"公式リンク"),l.a.createElement("hr",{className:"my-1 mr-4 mr-lg-0"}),Object.values(m.m).map(e=>l.a.createElement(l.a.Fragment,{key:e.id},l.a.createElement("li",null,l.a.createElement("a",{rel:"noreferrer",target:"_blank",href:e.blogUrl},e.name+" 公式ブログ ",l.a.createElement(n.a,{icon:o.p}))),l.a.createElement("li",null,l.a.createElement("a",{rel:"noreferrer",target:"_blank",href:e.topUrl},e.name+" 公式サイト ",l.a.createElement(n.a,{icon:o.p}))))))),l.a.createElement("div",{className:"col-xl-3 col-lg-4 col-xs-12"},l.a.createElement("ul",{className:"footer-menu"},l.a.createElement("span",{className:"font-weight-bold"},"ヲタピックについて"),l.a.createElement("hr",{className:"my-1 mr-4 mr-lg-0"}),l.a.createElement("li",null,l.a.createElement(s.Link,{to:"/contact"},"お問い合わせ")),l.a.createElement("li",null,l.a.createElement(s.Link,{to:"/terms-of-service"},"利用規約")),l.a.createElement("li",null,l.a.createElement(s.Link,{to:"/privacy-policy"},"プライバシーポリシー")),l.a.createElement("li",null,l.a.createElement("a",{rel:"noreferrer",target:"_blank",href:m.v},"公式Twitter",l.a.createElement(n.a,{icon:o.p})))))))),l.a.createElement("div",{className:"col-12 text-center py-4 text-muted",id:"copyright",style:{marginBottom:i.r?m.d:0}},l.a.createElement("p",{className:"small m-0"},"Copyright © otapick 2021 All rights reserved."))):l.a.createElement(l.a.Fragment,null)}}t.default=(e=>{class t extends l.a.Component{render(){const{forwardRef:t,...a}=this.props;return l.a.createElement(e,c({},a,{ref:t}))}}const a=Object(s.withRouter)(t,{withRef:!0}),r=(e,t)=>l.a.createElement(a,c({},e,{forwardRef:t}));return l.a.forwardRef(r)})(h)}}]);