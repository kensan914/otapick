import React from "react";

import Headline from "~/components/molecules/Headline";
import { BACKGROUND_IMG_URL } from "~/constants/env";
import {
  ContactContent,
  TermsOfServiceContent,
  PrivacyPolicyContent,
} from "~/components/templates/TermsTemplate/atoms/TermsContents";

export const TermsTemplate = (props) => {
  const { mode, titleHash } = props;

  let content;
  if (mode === "contact") {
    content = <ContactContent />;
  } else if (mode === "termsOfService") {
    content = <TermsOfServiceContent />;
  } else if (mode === "privacyPolicy") {
    content = <PrivacyPolicyContent />;
  }

  return (
    <div className="container mt-3 text-muted">
      <Headline type="terms" mode={mode} titleHash={titleHash} />

      <div className="container p-0 p-sm-4">
        <div
          className={
            "shadow-sm text-muted article article-margin-bottom py-2 px-2"
          }
          style={{ backgroundImage: `url(${BACKGROUND_IMG_URL})` }}
        >
          <div className="article-body p-4">{content}</div>
        </div>
      </div>
    </div>
  );
};
