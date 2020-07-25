import React from 'react';
import { DATA_AD_CLIENT, DEBUG, DATA_AD_SLOT_SQUARE, DATA_AD_SLOT_LANDSCAPE } from '../tools/env';
import { withRouter } from 'react-router-dom';


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
        {!DEBUG &&
          <ins className={"adsbygoogle " + this.key}
            style={Object.assign({ display: "block" }, (this.props.height ? { height: this.props.height } : {}))}
            data-ad-client={DATA_AD_CLIENT}
            data-ad-slot={this.DATA_AD_SLOT}
            data-ad-format="rectangle"
            data-full-width-responsive="true"
          ></ins>
        }
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
        {!DEBUG &&
          <ins className={"adsbygoogle " + this.key}
            style={Object.assign({ display: "block" }, (this.props.height ? { height: this.props.height } : {}))}
            data-ad-client={DATA_AD_CLIENT}
            data-ad-slot={this.DATA_AD_SLOT}
            data-ad-format="horizontal"
            data-full-width-responsive="false"
          ></ins>
        }
      </>
    );
  }
}


export const SquareAds = withRouter(SquareAds_);
export const LandscapeAds = withRouter(LandscapeAds_);