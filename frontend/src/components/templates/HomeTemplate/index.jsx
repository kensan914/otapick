import React from "react";

import HomeList from "~/components/templates/HomeTemplate/organisms/HomeList";
import Headline from "~/components/molecules/Headline";
import { isMobile } from "~/utils";

export const HomeTemplate = () => {
  return (
    <div className={"container text-muted mt-3"}>
      <Headline type="home" />

      {!isMobile && <div className="py-2"></div>}

      <HomeList />
    </div>
  );
};
