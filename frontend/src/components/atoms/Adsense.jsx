import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

import {
  DATA_AD_CLIENT,
  DEBUG,
  DATA_AD_SLOT_SQUARE,
  DATA_AD_SLOT_LANDSCAPE,
  DATA_AD_SLOT_ANCHOR,
} from "~/constants/env";

class DisplayAds extends React.Component {
  constructor(props) {
    super(props);
    this.DATA_AD_SLOT = "";
    this.key = this.props.location.key;
  }

  componentDidMount() {
    if (!DEBUG) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }
}

class SquareAds_ extends DisplayAds {
  constructor(props) {
    super(props);
    this.DATA_AD_SLOT = DATA_AD_SLOT_SQUARE;
  }

  render() {
    return (
      <>
        {!DEBUG && (
          <ins
            className={"adsbygoogle " + this.key}
            style={Object.assign(
              { display: "block" },
              this.props.height ? { height: this.props.height } : {}
            )}
            data-ad-client={DATA_AD_CLIENT}
            data-ad-slot={this.DATA_AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        )}
      </>
    );
  }
}

class LandscapeAds_ extends DisplayAds {
  constructor(props) {
    super(props);
    this.DATA_AD_SLOT = DATA_AD_SLOT_LANDSCAPE;
  }

  render() {
    return (
      <>
        {!DEBUG && (
          <ins
            className={"adsbygoogle " + this.key}
            style={Object.assign(
              { display: "block" },
              this.props.height ? { height: this.props.height } : {}
            )}
            data-ad-client={DATA_AD_CLIENT}
            data-ad-slot={this.DATA_AD_SLOT}
            data-ad-format="horizontal"
            data-full-width-responsive="false"
          ></ins>
        )}
      </>
    );
  }
}

export const SquareAds = withRouter(SquareAds_);
export const LandscapeAds = withRouter(LandscapeAds_);

export const AnchorAds = () => {
  useEffect(() => {
    if (!DEBUG) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <>
      {!DEBUG && (
        <ins
          className={"adsbygoogle"}
          // style={{ display: "inline-block", width: "100%", height: "100%" }}
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={DATA_AD_CLIENT}
          data-ad-slot={DATA_AD_SLOT_ANCHOR}
          // data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      )}
    </>
  );
};
