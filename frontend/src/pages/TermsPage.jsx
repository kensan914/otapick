import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router";

import { TermsTemplate } from "~/components/templates/TermsTemplate";
import { gtagTo, updateMeta } from "~/utils/index";

const TermsPage = (props) => {
  const { mode } = props;

  const location = useLocation();

  const [titleHash] = useState({
    contact: "お問い合わせ",
    termsOfService: "利用規約",
    privacyPolicy: "プライバシーポリシー",
  });
  const accessedModeRef = useRef({
    contact: false,
    termsOfService: false,
    privacyPolicy: false,
  });

  useEffect(() => {
    updateMeta({ title: titleHash[mode], description: "" });
    gtagTo(location.pathname);
    accessedModeRef.current[mode] = true;
  }, []);

  useEffect(() => {
    updateMeta({ title: titleHash[mode], description: "" });
    if (!accessedModeRef.current[mode]) {
      gtagTo(location.pathname);
      accessedModeRef.current[mode] = true;
    }
  }, [location]);

  return <TermsTemplate mode={mode} titleHash={titleHash} />;
};

export default TermsPage;
