import React from "react";

import { HomeTemplate } from "~/components/templates/HomeTemplate/index";
import { useImageListInfo } from "~/pages/ImageListPage/useImageListInfo";

const HomePage = () => {
  useImageListInfo(true);

  return <HomeTemplate />;
};

export default HomePage;
