(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{"./src/components/pages/NotFound404.jsx":function(o,t,e){"use strict";e.r(t);var s=e("./node_modules/react/index.js"),n=e.n(s),p=e("./src/components/atoms/NotFound.jsx"),c=e("./src/components/modules/utils.js"),r=e("./src/components/modules/env.js"),i=e("./node_modules/react-router-dom/esm/react-router-dom.js");class a extends n.a.Component{constructor(o){super(o)}componentDidMount(){null!==this.props.footerRef&&this.props.domDispatch({type:"APPLY_SHOW_FOOTER",location:this.props.location}),c.u&&Object(c.z)(r.u),Object(c.H)({title:"404 Page Not Found",description:""}),Object(c.s)(this.props.location.pathname)}componentDidUpdate(o){this.props.footerRef!==o.footerRef&&null!==this.props.footerRef&&this.props.domDispatch({type:"APPLY_SHOW_FOOTER",location:this.props.location})}componentWillUnmount(){c.u&&Object(c.z)(r.u+r.A)}render(){return n.a.createElement("div",{className:"container mt-3 text-muted py-5"},n.a.createElement(p.c,{type:"404",margin:!0}))}}t.default=Object(i.withRouter)(a)}}]);