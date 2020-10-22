import React from "react";
import Headline from '../molecules/Headline';
import { withRouter } from "react-router-dom";
import { BACKGROUNG_IMG_URL } from "../modules/env";
import { ContactContent, TermsOfServiceContent, PrivacyPolicyContent } from "../atoms/ArticleContents";
import { updateMeta, gtagTo } from "../modules/support";


class MemberListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.titleHash = { contact: "お問い合わせ", termsOfService: "利用規約", privacyPolicy: "プライバシーポリシー" };
    this.accessedMode = { contact: false, termsOfService: false, privacyPolicy: false };
  };

  componentDidMount() {
    updateMeta({ title: this.titleHash[this.props.mode], discription: "" });
    gtagTo(this.props.location.pathname);
    this.accessedMode[this.props.mode] = true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      updateMeta({ title: this.titleHash[this.props.mode], discription: "" });
      if (!this.accessedMode[this.props.mode]) {
        gtagTo(this.props.location.pathname);
        this.accessedMode[this.props.mode] = true;
      }
    }
  }

  render() {
    let content;
    if (this.props.mode === "contact") {
      content = <ContactContent />;
    } else if (this.props.mode === "termsOfService") {
      content = <TermsOfServiceContent />;
    } else if (this.props.mode === "privacyPolicy") {
      content = <PrivacyPolicyContent />;
    }

    return (
      <div className="container mt-3 text-muted">
        <Headline type="terms" mode={this.props.mode} titleHash={this.titleHash} />

        <div className="container p-0 p-sm-4">
          <div className={"shadow-sm text-muted article article-margin-bottom py-2 px-2"} style={{ backgroundImage: `url(${BACKGROUNG_IMG_URL})` }}>
            <div className="article-body p-4">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default withRouter(MemberListTemplate);