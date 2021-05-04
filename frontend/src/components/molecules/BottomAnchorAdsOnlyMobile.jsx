import React from "react";

import { AnchorAds } from "~/components/atoms/Adsense";
import { BOTTOM_ANCHOR_ADS_HEIGHT, DEBUG } from "~/constants/env";

const BottomAnchorAdsOnlyMobile = () => {
  return (
    <div
      className="bottom-navbar"
      style={{
        height: BOTTOM_ANCHOR_ADS_HEIGHT,
        backgroundColor: DEBUG ? "whitesmoke" : "white",
      }}
    >
      <AnchorAds />
    </div>
  );
};

export default BottomAnchorAdsOnlyMobile;
