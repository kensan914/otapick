(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"./src/components/atoms/BackButton.jsx":function(e,t,l){"use strict";var a=l("./node_modules/react/index.js"),n=l.n(a),r=l("./node_modules/react-router/esm/react-router.js"),o=l("./src/components/modules/utils.js"),s=l("./node_modules/reactstrap/es/index.js"),c=l("./node_modules/@fortawesome/react-fontawesome/index.es.js"),i=l("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");class m extends n.a.Component{constructor(...e){var t;return t=super(...e),this.goBack=()=>{o.t===this.props.location.key?this.props.history.push("/"):history.back()},t}render(){return this.props.mini?n.a.createElement(s.a,{className:"rounded-circle transparent-button-mobile "+(o.u?"mobile ":" ")+(this.props.className?this.props.className:""),id:"mobile-back-button",onClick:this.goBack},n.a.createElement(c.a,{icon:i.h})):this.props.fixed?n.a.createElement("button",{onClick:this.goBack,className:"btn btn-light rounded-circle p-0 otapick-back-button-fixed shadow-sm "+(this.props.className?this.props.className:"")},n.a.createElement(c.a,{icon:i.b,style:{color:"gray"}})):n.a.createElement("button",{onClick:this.goBack,className:"btn btn-light rounded-circle p-0 otapick-back-button border shadow-sm "+(this.props.className?this.props.className:"")},n.a.createElement(c.a,{icon:i.b,style:{color:"gray"}}))}}t.a=Object(r.o)(m)},"./src/components/atoms/LinkButton.jsx":function(e,t,l){"use strict";var a=l("./node_modules/react/index.js"),n=l.n(a),r=l("./node_modules/react-router-dom/esm/react-router-dom.js"),o=l("./node_modules/reactstrap/es/index.js"),s=l("./src/components/modules/utils.js");t.a=e=>{const{to:t,className:l,style:a,children:c,id:i=Object(s.l)()}=e;return n.a.createElement(r.Link,{to:t,style:{textDecoration:"none"},id:i},n.a.createElement(o.a,{className:l,style:a},c))}},"./src/components/atoms/TooltipComponent.jsx":function(e,t,l){"use strict";var a=l("./node_modules/react/index.js"),n=l.n(a);t.a=e=>{const{children:t,title:l,backgroundColor:r="rgb(50, 50, 50)",placement:o="top"}=e,[s,c]=Object(a.useState)(!1);if(!l)return n.a.createElement(n.a.Fragment,null);const i=e=>n.a.createElement("div",{className:"tooltip-body rounded-pill px-2 py-1 "+e,style:{...r?{background:r}:{}}},l);return n.a.createElement("div",{className:"tooltip-container "+(s?"active":"")},n.a.createElement("span",{className:"tooltip-wrapper"},"top"===o&&i(o),n.a.createElement("div",{onMouseEnter:()=>{c(!0)},onMouseLeave:()=>{c(!1)}},t),"bottom"===o&&i(o)))}},"./src/components/molecules/Headline.jsx":function(e,t,l){"use strict";var a=l("./node_modules/react/index.js"),n=l.n(a),r=l("./src/components/atoms/BackButton.jsx"),o=l("./node_modules/reactstrap/es/index.js"),s=l("./node_modules/react-router-dom/esm/react-router-dom.js"),c=l("./node_modules/axios/index.js"),i=l.n(c),m=l("./src/components/modules/utils.js"),p=l("./src/components/modules/env.js"),u=l("./src/components/contexts/DomContext.jsx"),d=l("./src/components/atoms/LinkButton.jsx"),h=l("./node_modules/@fortawesome/react-fontawesome/index.es.js"),E=l("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),b=l("./src/components/atoms/TooltipComponent.jsx"),f=l("./src/components/contexts/ProfileContext.jsx"),g=l("./src/components/molecules/DropdownMobileFriendly.jsx");function y(){return(y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var l=arguments[t];for(var a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a])}return e}).apply(this,arguments)}class v extends n.a.Component{getChangeTypeUrl(e,t,l){return"blogs"===e?Object(m.a)("/images/",t,l):"images"===e?Object(m.a)("/blogs/",t,l):void 0}render(){const e="blogs"===this.props.type?"画像一覧に切り替えます":"ブログ一覧に切り替えます",t="blogs"===this.props.type?n.a.createElement(h.a,{icon:E.w}):n.a.createElement(h.a,{icon:E.y});return n.a.createElement(b.a,{title:e,placement:"bottom"},n.a.createElement(d.a,{to:this.getChangeTypeUrl(this.props.type,this.props.groupID,this.props.ct),className:"rounded-pill type-change-button ml-1",id:this.props.id},n.a.createElement("div",{className:"d-flex justify-content-center align-items-center",style:{color:"gray",fontSize:20}},n.a.createElement(h.a,{className:"mr-1 my-0",icon:E.o,style:{fontSize:12}}),t)))}}class k extends n.a.Component{constructor(e){super(e),this.getModeSelectButtonGroup=e=>{const t=({children:e})=>n.a.createElement(o.c,{size:"lg",className:"mt-3 mt-lg-0"},e);if("blogs"===this.props.type||"images"===this.props.type){const l=n.a.createElement(n.a.Fragment,null,n.a.createElement(o.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("recommend"===this.props.mode?"active":""),onClick:()=>this.props.history.push(`/${this.props.type}/`)},n.a.createElement("b",null,"おすすめ")),Object(m.D)(this.props.profileState.profile.favGroups).map(t=>n.a.createElement(o.a,{key:t.id,className:`rounded-pill mode-select-button ${t.key} `+(e?"fixed ":" ")+(m.u||e?" ":"d-flex align-items-center ")+(this.props.mode===t.key?"active":""),onClick:()=>this.props.history.push(`/${this.props.type}/${t.id}/`)},n.a.createElement("b",null,t.name),t.isActive&&n.a.createElement(g.a,{id:`mode-select-${this.props.type}-${t.key}`,directionOnlyPc:"down",buttonClass:`rounded-circle mode-select-dropdown-button ${e?"fixed p-0":""} ${t.key}`,buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu-members",menuSettings:[..."sakura"===t.key&&this.props.profileState.profile.favMemberSakura||"hinata"===t.key&&this.props.profileState.profile.favMemberHinata?(()=>{let e=[{type:"TITLE",label:"推しメン"}];return["favMemberSakura","favMemberHinata"].forEach(t=>{this.props.profileState.profile[t]&&(e=[...e,{type:"LINK",pathname:`/${this.props.type}/${p.m[this.props.profileState.profile[t].belongingGroup].id}/${this.props.profileState.profile[t].ct}/`,label:this.props.profileState.profile[t].fullKanji}])}),e})():[],...(()=>{let e=[];for(const[l,a]of this.state.membersCollection[t.id].entries())e=[...e,{type:"TITLE",label:l+1+"期生"}],e=[...e,...a.map(({url:e,full_kanji:t})=>({type:"LINK",pathname:e[this.props.type],label:t}))];return e})()]},n.a.createElement(h.a,{icon:E.a})))));return m.u||e?n.a.createElement(n.a.Fragment,null,l):n.a.createElement(t,null,l)}if("blogView"===this.props.type&&!m.u){const l=n.a.createElement(n.a.Fragment,null,n.a.createElement(o.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("view"===this.props.mode?"active":""),onClick:()=>this.props.changeMode("view")},n.a.createElement("b",null,"閲覧する")),n.a.createElement(o.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("download"===this.props.mode?"active":""),onClick:()=>this.props.changeMode("download")},n.a.createElement("b",null,"保存する")));return e?n.a.createElement(n.a.Fragment,null,l):n.a.createElement(t,null,l)}if("members"===this.props.type){const t=n.a.createElement(n.a.Fragment,null,Object(m.D)(this.props.profileState.profile.favGroups).map(t=>{if(t.isActive)return n.a.createElement(o.a,{key:t.id,className:`rounded-pill mode-select-button ${t.key} `+(e?"fixed ":" ")+(this.props.group===t.key?"active":""),onClick:()=>this.props.changeGroup(t.key)},n.a.createElement("b",null,t.name))}));return m.u||e?n.a.createElement(n.a.Fragment,null,t):n.a.createElement(o.c,{size:"lg"},t)}},this.getModeSelectButtonGroupVerLeft=e=>{let t;if("home"===this.props.type?t=n.a.createElement(n.a.Fragment,null,n.a.createElement(o.a,{className:"rounded-pill mode-select-button active "+(e?"fixed":""),onClick:()=>this.props.history.push("/")},n.a.createElement("b",null,"ホーム")),n.a.createElement(o.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+(m.u||e?"":"d-flex align-items-center"),onClick:()=>this.props.history.push("/images/")},n.a.createElement("b",null,"画像一覧"),n.a.createElement(g.a,{id:"mode-select-images-home",directionOnlyPc:"down",buttonClass:"rounded-circle mode-select-dropdown-button "+(e?"fixed p-0":""),buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu",menuSettings:[{type:"TITLE",label:"グループ選択"},...Object(m.D)(this.props.profileState.profile.favGroups).map(e=>({type:"LINK",pathname:`/images/${e.id}/`,label:""+e.name}))]},n.a.createElement(h.a,{icon:E.a}))),n.a.createElement(o.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+(m.u||e?"":"d-flex align-items-center"),onClick:()=>this.props.history.push("/blogs/")},n.a.createElement("b",null,"ブログ一覧"),n.a.createElement(g.a,{id:"mode-select-images-home",directionOnlyPc:"down",buttonClass:"rounded-circle mode-select-dropdown-button "+(e?"fixed p-0":""),buttonContainerClass:`mode-select-dropdown-button-super ${e?"fixed":""} btn-group`,dropdownMenuClassOnlyPc:"mode-select-dropdown-menu",menuSettings:[{type:"TITLE",label:"グループ選択"},...Object(m.D)(this.props.profileState.profile.favGroups).map(e=>({type:"LINK",pathname:`/blogs/${e.id}/`,label:""+e.name}))]},n.a.createElement(h.a,{icon:E.a})))):"terms"===this.props.type&&(t=n.a.createElement(n.a.Fragment,null,n.a.createElement(o.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("contact"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/contact/")},n.a.createElement("b",null,this.props.titleHash.contact)),n.a.createElement(o.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("termsOfService"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/terms-of-service/")},n.a.createElement("b",null,this.props.titleHash.termsOfService)),n.a.createElement(o.a,{className:"rounded-pill mode-select-button "+(e?"fixed ":" ")+("privacyPolicy"===this.props.mode?"active":""),onClick:()=>this.props.history.push("/privacy-policy/")},n.a.createElement("b",null,this.props.titleHash.privacyPolicy)))),"home"===this.props.type||"terms"===this.props.type)return m.u||e?n.a.createElement(n.a.Fragment,null,t):n.a.createElement(o.c,{size:"lg",className:"ml-3 my-0"},t)},this.getTypeChangeButton=e=>{let t;if(t=e?"type-change-button-fixed":"type-change-button","blogs"===this.props.type||"images"===this.props.type)return n.a.createElement(v,{id:t,history:this.props.history,type:this.props.type,groupID:this.props.groupID,ct:this.props.ct})},this.initMembers={},Object.values(p.m).forEach(e=>this.initMembers[e.id]=[]),this.state={membersCollection:this.initMembers},this.subNavbarRef=n.a.createRef(),this.initUrl=e.match.url,this.initSearch=e.location.search,e.domDispatch({type:"SET_SUBNAVBAR_REF",subNavbarRef:this.subNavbarRef,locationKey:e.location.key})}componentDidMount(){if("blogs"===this.props.type||"images"===this.props.type){const e=Object(m.a)(p.b,"members/");i.a.get(e).then(e=>{const t=this.initMembers;Object.values(p.m).forEach(l=>{if(l.isActive){t[l.id]=[];for(const a of e.data[l.key])t[l.id].push(a.map(e=>({url:e.url,full_kanji:e.full_kanji})))}}),this.setState({membersCollection:t})}).catch(e=>{console.error(e)}).finally()}}componentDidUpdate(e){Object(m.e)(this.props)&&this.props.match.url===this.initUrl&&this.props.location.search===this.initSearch&&this.props.location.key!==e.location.key&&this.props.domDispatch({type:"SET_SUBNAVBAR_REF",subNavbarRef:this.subNavbarRef,locationKey:this.props.location.key})}render(){const e=this.getTypeChangeButton(!0),t=this.getModeSelectButtonGroupVerLeft(!0),l=this.getModeSelectButtonGroup(!0);return n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"fixed-headline border-bottom text-muted pl-0 pl-lg-3",style:{top:m.u?p.u:0,height:p.A},ref:this.subNavbarRef},n.a.createElement(r.a,{mini:!0,className:"mr-0 mr-lg-2"}),this.props.title&&(t||l)&&n.a.createElement(n.a.Fragment,null,n.a.createElement("h1",null,this.props.title),!m.u&&e,n.a.createElement("div",{className:"vertical-hr "+(m.u?"ml-3":"mx-2")})),this.props.title&&!t&&!l&&n.a.createElement(n.a.Fragment,null,n.a.createElement("h1",null,this.props.title),!m.u&&e),n.a.createElement("div",{className:"fixed-headline-contents-wrapper",style:{height:p.A,...m.u?{}:{overflow:"visible"}}},n.a.createElement("div",{className:"fixed-headline-contents-wrapper2",style:{height:p.A}},n.a.createElement("div",{className:"text-muted fixed-headline-contents"},t,l)))),!m.u&&n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"row justify-content-between mr-0"},n.a.createElement("div",{className:"d-flex align-items-center"},n.a.createElement(r.a,null),this.getModeSelectButtonGroupVerLeft(!1),this.props.title&&n.a.createElement("h3",{className:"ml-3 my-0"},this.props.title),this.getTypeChangeButton(!1)),this.getModeSelectButtonGroup(!1))))}}t.a=Object(s.withRouter)(e=>n.a.createElement(u.a.Consumer,null,t=>n.a.createElement(f.a.Consumer,null,l=>n.a.createElement(k,y({},e,{domDispatch:t,profileState:l})))))},"./src/components/templates/TermsTemplate.jsx":function(e,t,l){"use strict";l.r(t);var a=l("./node_modules/react/index.js"),n=l.n(a),r=l("./src/components/molecules/Headline.jsx"),o=l("./node_modules/react-router-dom/esm/react-router-dom.js"),s=l("./src/components/modules/env.js"),c=l("./node_modules/@fortawesome/free-brands-svg-icons/index.es.js"),i=l("./node_modules/@fortawesome/free-solid-svg-icons/index.es.js"),m=l("./node_modules/@fortawesome/react-fontawesome/index.es.js"),p=l("./src/components/modules/utils.js");class u extends n.a.Component{render(){return n.a.createElement(n.a.Fragment,null,n.a.createElement("h1",null,"お問い合わせ"),n.a.createElement("hr",null),n.a.createElement("p",null,"ヲタピックでは、不具合報告、改善のご要望等のお問い合わせを受け付けております。"),n.a.createElement("p",null,"また、機能拡張やサポートアイドルのリクエストもお待ちしております。"),n.a.createElement("hr",null),n.a.createElement("div",{className:"my-4"},n.a.createElement("h4",null,n.a.createElement(m.a,{icon:i.n})," メールによるお問い合わせ"),n.a.createElement("p",null,"メールアドレス:",p.w&&n.a.createElement("br",null),n.a.createElement("a",{rel:"noreferrer",target:"_blank",href:"mailto:otapick210@gmail.com"},"otapick210@gmail.com")),n.a.createElement("p",null,"上記メールアドレスにお問い合わせください。")),n.a.createElement("div",{className:"my-4"},n.a.createElement("h4",null,n.a.createElement(m.a,{icon:c.b})," ","TwitterのDMによるお問い合わせ"),n.a.createElement("p",null,"Twitter公式アカウント:",p.w&&n.a.createElement("br",null),n.a.createElement("a",{rel:"noreferrer",target:"_blank",href:s.w},"ヲタピック")),n.a.createElement("p",null,"上記のTwitterアカウントにDM(ダイレクトメッセージ)を送ってお問い合わせください。")))}}class d extends n.a.Component{render(){let e=1;return n.a.createElement(n.a.Fragment,null,n.a.createElement("h1",null,"利用規約"),n.a.createElement("p",null,"この利用規約（以下，「本規約」といいます。）は，ヲタピック（以下，「当社」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。ご利用のユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。"),n.a.createElement("h2",null,"第",e++,"条（適用）"),n.a.createElement("ol",null,n.a.createElement("li",null,"本規約は，ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。"),n.a.createElement("li",null,"当社は本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定め（以下，「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。"),n.a.createElement("li",null,"本規約の規定が前条の個別規定の規定と矛盾する場合には，個別規定において特段の定めなき限り，個別規定の規定が優先されるものとします。")),n.a.createElement("h2",null,"第",e++,"条（アカウント利用サービス）"),n.a.createElement("ol",null,n.a.createElement("li",null,"本サービスでは、画像のお気に入り登録を含む一部機能（以下「アカウント利用サービス」といいます。）の利用において、ユーザーアカウントの取得が必要となります。"),n.a.createElement("li",null,"ユーザーは、本サービス上で、当社所定のソーシャルログインに関する手続を行うことにより、ユーザーアカウントを取得します。当該ユーザーアカウント取得手続完了時に、ユーザーと当社との間にアカウント利用サービスに関する契約（以下「アカウント利用サービス契約」といいます。）が成立します。"),n.a.createElement("li",null,"ソーシャルログインに関する手続によりユーザーアカウントを取得する場合には、ソーシャルログイン対象SNSにおけるアカウントが必要です。"),n.a.createElement("li",null,"ユーザーは、アカウント利用サービス契約の期間中、当社所定の方法に従ったユーザーアカウントによる認証を通じ、アカウント利用サービスを利用することができます。")),n.a.createElement("h2",null,"第",e++,"条（ソーシャルログイン対象SNS）"),n.a.createElement("ol",null,n.a.createElement("li",null,"本サービスで利用可能なソーシャルログイン対象SNSを以下に記します。ユーザーは、ソーシャルログイン対象SNSにおけるアカウントの登録・利用等に関し、ソーシャルログイン対象SNSが定める各規約を遵守するものとします。"),n.a.createElement("ul",null,n.a.createElement("li",null,n.a.createElement("a",{rel:"noreferrer",style:{color:"deepskyblue"},href:"https://twitter.com/",target:"_blank"},"Twitter ",n.a.createElement(m.a,{icon:i.p})))),n.a.createElement("li",null,"ユーザーは、ソーシャルログインに用いたソーシャルログイン対象SNSにおいて以下の事由が生じた場合、一時的又は恒久的に本アプリへのログインができなくなる場合があることを承諾し、これに異議を述べないものとします。"),n.a.createElement("ol",null,n.a.createElement("li",null,"ユーザーがソーシャルログイン対象SNSを退会した場合"),n.a.createElement("li",null,"ソーシャルログイン対象SNSに障害等が発生した場合"),n.a.createElement("li",null,"ソーシャルログイン対象SNSが運営を中断若しくは終了した場合"),n.a.createElement("li",null,"ソーシャルログイン対象SNSの仕様や方針が変更された場合"),n.a.createElement("li",null,"その他、ソーシャルログイン対象SNSが利用できない場合"))),n.a.createElement("h2",null,"第",e++,"条（禁止事項）"),n.a.createElement("p",null,"ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。"),n.a.createElement("ol",null,n.a.createElement("li",null,"法令または公序良俗に違反する行為"),n.a.createElement("li",null,"犯罪行為に関連する行為"),n.a.createElement("li",null,"本サービスの内容等，本サービスに含まれる著作権，商標権ほか知的財産権を侵害する行為"),n.a.createElement("li",null,"当社，ほかのユーザー，またはその他第三者のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為"),n.a.createElement("li",null,"本サービスによって得られた情報を商業的に利用する行為"),n.a.createElement("li",null,"当社のサービスの運営を妨害するおそれのある行為"),n.a.createElement("li",null,"不正アクセスをし，またはこれを試みる行為"),n.a.createElement("li",null,"他のユーザーに関する個人情報等を収集または蓄積する行為"),n.a.createElement("li",null,"不正な目的を持って本サービスを利用する行為"),n.a.createElement("li",null,"本サービスの他のユーザーまたはその他の第三者に不利益，損害，不快感を与える行為"),n.a.createElement("li",null,"他のユーザーに成りすます行為"),n.a.createElement("li",null,"当社が許諾しない本サービス上での宣伝，広告，勧誘，または営業行為"),n.a.createElement("li",null,"面識のない異性との出会いを目的とした行為"),n.a.createElement("li",null,"当社のサービスに関連して，反社会的勢力に対して直接または間接に利益を供与する行為"),n.a.createElement("li",null,"その他，当社が不適切と判断する行為")),n.a.createElement("h2",null,"第",e++,"条（本サービスの提供の停止等）"),n.a.createElement("ol",null,n.a.createElement("li",null,"当社は，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。",n.a.createElement("ol",null,n.a.createElement("li",null,"本サービスにかかるコンピュータシステムの保守点検または更新を行う場合"),n.a.createElement("li",null,"地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合"),n.a.createElement("li",null,"コンピュータまたは通信回線等が事故により停止した場合"),n.a.createElement("li",null,"その他，当社が本サービスの提供が困難と判断した場合"))),n.a.createElement("li",null,"当社は，本サービスの提供の停止または中断により，ユーザーまたは第三者が被ったいかなる不利益または損害についても，一切の責任を負わないものとします。")),n.a.createElement("h2",null,"第",e++,"条（保証の否認および免責事項）"),n.a.createElement("ol",null,n.a.createElement("li",null,"当社は，本サービスに事実上または法律上の瑕疵（安全性，信頼性，正確性，完全性，有効性，特定の目的への適合性，セキュリティなどに関する欠陥，エラーやバグ，権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。"),n.a.createElement("li",null,"当社は，本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし，本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合，この免責規定は適用されません。"),n.a.createElement("li",null,"前項ただし書に定める場合であっても，当社は，当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し，または予見し得た場合を含みます。）について一切の責任を負いません。"),n.a.createElement("li",null,"当社は，本サービスに関して，ユーザーと他のユーザーまたは第三者との間において生じた取引，連絡または紛争等について一切責任を負いません。")),n.a.createElement("h2",null,"第",e++,"条（サービス内容の変更等）"),n.a.createElement("p",null,"当社は，ユーザーに通知することなく，本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし，これによってユーザーに生じた損害について一切の責任を負いません。"),n.a.createElement("h2",null,"第",e++,"条（利用規約の変更）"),n.a.createElement("p",null,"当社は，必要と判断した場合には，ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお，本規約の変更後，本サービスの利用を開始した場合には，当該ユーザーは変更後の規約に同意したものとみなします。"),n.a.createElement("h2",null,"第",e++,"条（準拠法・裁判管轄）"),n.a.createElement("ol",null,n.a.createElement("li",null,"本規約の解釈にあたっては，日本法を準拠法とします。"),n.a.createElement("li",null,"本サービスに関して紛争が生じた場合には，当社の本店所在地を管轄する裁判所を専属的合意管轄とします。")),n.a.createElement("div",{className:"text-right mt-5"},"制定日：2020 年 07 月 23 日"),n.a.createElement("div",{className:"text-right mt-1"},"改定日：2020 年 12 月 04 日"))}}class h extends n.a.Component{render(){let e=1;return n.a.createElement(n.a.Fragment,null,n.a.createElement("h1",null,"プライバシーポリシー"),n.a.createElement("p",null,"ヲタピック（以下，「当社」といいます。）は，本ウェブサイト上で提供するサービス（以下,「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。"),n.a.createElement("h2",null,"第",e++,"条（個人情報）"),n.a.createElement("p",null,"「個人情報」とは，個人情報保護法にいう「個人情報」を指すものとし，生存する個人に関する情報であって，当該情報に含まれる氏名，生年月日，住所，電話番号，連絡先その他の記述等により特定の個人を識別できる情報及び容貌，指紋，声紋にかかるデータ，及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。"),n.a.createElement("h2",null,"第",e++,"条（収集する個人情報及び収集方法）"),n.a.createElement("ol",null,n.a.createElement("li",null,"ユーザーがアカウント利用サービスの利用において、ソーシャルログイン対象SNSと連携を許可することにより、当該他のサービスからご提供いただく情報"),n.a.createElement("p",null,"ユーザーが、アカウント利用サービスを利用するにあたり、",n.a.createElement("a",{rel:"noreferrer",style:{color:"deepskyblue"},href:"https://twitter.com/",target:"_blank"},"Twitter ",n.a.createElement(m.a,{icon:i.p})),"との連携を許可した場合には、その許可の際にご同意いただいた内容に基づき、以下の情報を当該外部サービスから収集します。"),n.a.createElement("ul",null,n.a.createElement("li",null,"プロフィール情報（ユーザID、名前、プロフィール画像）"),n.a.createElement("li",null,"登録済みのメールアドレス"),n.a.createElement("li",null,"その他当該外部サービスのプライバシー設定によりユーザーが連携先に開示を認めた情報")),n.a.createElement("li",null,"ユーザーが本サービスを利用するにあたって、当社が収集する情報"),n.a.createElement("p",null,"当社は、本サービスへのアクセス状況やそのご利用方法に関する情報を収集することがあります。これには以下の情報が含まれます。"),n.a.createElement("ul",null,n.a.createElement("li",null,"リファラ"),n.a.createElement("li",null,"IPアドレス"),n.a.createElement("li",null,"デバイスの種類、オペレーティングシステムを含むデバイス情報"),n.a.createElement("li",null,"サーバーアクセスログに関する情報"),n.a.createElement("li",null,"Cookie、ADID、IDEAその他の識別子"))),n.a.createElement("h2",null,"第",e++,"条（利用目的）"),n.a.createElement("p",null,"本サービスのサービス提供にかかわる個人情報の具体的な利用目的は以下のとおりです。"),n.a.createElement("ol",null,n.a.createElement("li",null,"本サービスに関する登録の受付、ユーザー認証、ユーザー設定の記録等本サービスの提供、維持、保護及び改善のため"),n.a.createElement("li",null,"ユーザーのトラフィック測定及び行動測定のため"),n.a.createElement("li",null,"本サービスに関するご案内、お問い合わせ等への対応のため"),n.a.createElement("li",null,"本サービスに関する当社の規約、ポリシー等（以下「規約等」といいます。）に違反する行為に対する対応のため"),n.a.createElement("li",null,"本サービスに関する規約等の変更などを通知するため")),n.a.createElement("h2",null,"第",e++,"条（Cookie）"),n.a.createElement("p",null,"当社では、一部のコンテンツにおいてCookieを利用しています。Cookieとは、webコンテンツへのアクセスに関する情報であり、お名前・メールアドレス・住所・電話番号は含まれません。また、お使いのブラウザ設定からCookieを無効にすることが可能です。"),n.a.createElement("h2",null,"第",e++,"条（広告の配信）"),n.a.createElement("p",null,"本ウェブサイトは、第三者配信の広告サービス「",n.a.createElement("a",{href:"https://www.google.com/intl/ja_jp/adsense/start/",target:"_blank",rel:"noreferrer"},"Google AdSense"),"」を利用しています。 Googleなどの広告配信事業者は、Cookie を使用して、ユーザーが本ウェブサイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信しています。 また、Googleは、広告 Cookie を使用することにより、ユーザーが本サイトや他のサイトにアクセスした際の情報に基づいて、Google やそのパートナーが適切な広告をユーザーに表示しています。",n.a.createElement("a",{href:"https://adssettings.google.com/authenticated",target:"_blank",rel:"noreferrer"},"広告設定"),"でパーソナライズ広告を無効にすることも可能です。 また、",n.a.createElement("a",{href:"https://www.aboutads.info/choices/",target:"_blank",rel:"noreferrer"},"www.aboutads.info"),"にアクセスすれば、パーソナライズ広告に使われる第三者配信事業者の Cookie を無効にすることも可能です。 Google AdSenseの詳細は「",n.a.createElement("a",{href:"https://policies.google.com/?hl=ja",target:"_blank",rel:"noreferrer"},"Googleポリシーと規約"),"」をご覧ください。"),n.a.createElement("h2",null,"第",e++,"条（アクセス解析ツール）"),n.a.createElement("p",null,"本ウェブサイトは、Google Inc.が提供するアクセス解析ツール「Googleアナリティクス」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ます。Googleアナリティクスの詳細は「",n.a.createElement("a",{href:"https://marketingplatform.google.com/about/analytics/terms/jp/",target:"_blank",rel:"noreferrer"},"Googleアナリティクス利用規約"),"」をご覧ください。"),n.a.createElement("h2",null,"第",e++,"条（著作権）"),n.a.createElement("p",null,"本ウェブサイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属します。メディア企業の多彩で多様な表現活動を尊び、その推進を積極的に支援し、権利を侵害する目的ではありません。掲載画像に問題がある場合、各権利所有者様本人が直接当社にご連絡下さい。本人確認後、対応致します。また、本ウェブサイトのコンテンツ（画像・その他プログラム）について、許可なく転載することを禁じます。引用の際は、本ウェブサイトへのリンクを掲載するとともに、転載であることを明記してください。"),n.a.createElement("h2",null,"第",e++,"条（プライバシーポリシーの変更）"),n.a.createElement("ol",null,n.a.createElement("li",null,"本ポリシーの内容は，法令その他本ポリシーに別段の定めのある事項を除いて，ユーザーに通知することなく，変更することができるものとします。"),n.a.createElement("li",null,"当社が別途定める場合を除いて，変更後のプライバシーポリシーは，本ウェブサイトに掲載したときから効力を生じるものとします。")),n.a.createElement("div",{className:"text-right mt-5"},"制定日：2020 年 07 月 23 日"),n.a.createElement("div",{className:"text-right mt-1"},"改定日：2020 年 12 月 04 日"))}}class E extends n.a.Component{constructor(e){super(e),this.titleHash={contact:"お問い合わせ",termsOfService:"利用規約",privacyPolicy:"プライバシーポリシー"},this.accessedMode={contact:!1,termsOfService:!1,privacyPolicy:!1}}componentDidMount(){Object(p.H)({title:this.titleHash[this.props.mode],description:""}),Object(p.s)(this.props.location.pathname),this.accessedMode[this.props.mode]=!0}componentDidUpdate(e){e.location!==this.props.location&&(Object(p.H)({title:this.titleHash[this.props.mode],description:""}),this.accessedMode[this.props.mode]||(Object(p.s)(this.props.location.pathname),this.accessedMode[this.props.mode]=!0))}render(){let e;return"contact"===this.props.mode?e=n.a.createElement(u,null):"termsOfService"===this.props.mode?e=n.a.createElement(d,null):"privacyPolicy"===this.props.mode&&(e=n.a.createElement(h,null)),n.a.createElement("div",{className:"container mt-3 text-muted"},n.a.createElement(r.a,{type:"terms",mode:this.props.mode,titleHash:this.titleHash}),n.a.createElement("div",{className:"container p-0 p-sm-4"},n.a.createElement("div",{className:"shadow-sm text-muted article article-margin-bottom py-2 px-2",style:{backgroundImage:`url(${s.a})`}},n.a.createElement("div",{className:"article-body p-4"},e))))}}t.default=Object(o.withRouter)(E)}}]);