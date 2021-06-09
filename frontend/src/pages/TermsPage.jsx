import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router";

import { TermsTemplate } from "~/components/templates/TermsTemplate";
import { useMeta } from "~/hooks/useMeta";

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

  const { setMeta } = useMeta();
  useEffect(() => {
    setMeta(titleHash[mode], "");
    accessedModeRef.current[mode] = true;
  }, []);

  useEffect(() => {
    setMeta(titleHash[mode], "");
    if (!accessedModeRef.current[mode]) {
      accessedModeRef.current[mode] = true;
    }
  }, [location]);

  return <TermsTemplate mode={mode} titleHash={titleHash} />;
};

export default TermsPage;
