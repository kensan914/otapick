import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { NotFoundMessage } from "~/components/atoms/NotFound";
import { setBodyPadding, isMobile } from "~/utils";
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT } from "~/constants/env";
import { useDomDispatch } from "~/contexts/DomContext";
import { useMeta } from "~/hooks/useMeta";

const NotFound404Page = (props) => {
  const { footerRef } = props;

  const location = useLocation();
  const domDispatch = useDomDispatch();
  const { setMeta } = useMeta();

  useEffect(() => {
    if (footerRef !== null) {
      domDispatch({
        type: "APPLY_SHOW_FOOTER",
        location: location,
      });
    }
    if (isMobile) {
      setBodyPadding(NAVBAR_HEIGHT);
    }
    setMeta("404 Page Not Found", "");

    return () => {
      if (isMobile) {
        setBodyPadding(NAVBAR_HEIGHT + SUB_NAVBAR_HEIGHT);
      }
    };
  });

  useEffect(() => {
    if (footerRef !== null) {
      domDispatch({
        type: "APPLY_SHOW_FOOTER",
        location: location,
      });
    }
  }, [footerRef]);

  return (
    <div className="container mt-3 text-muted py-5">
      <NotFoundMessage type="404" margin={true} />
    </div>
  );
};

export default NotFound404Page;
