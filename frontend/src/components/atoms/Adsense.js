import React from 'react';
import { DATA_AD_CLIENT, DEBUG, DATA_AD_SLOT_SQUARE, DATA_AD_SLOT_LANDSCAPE } from '../tools/env';


class DisplayAds extends React.Component {
  constructor(props) {
    super(props);
    this.DATA_AD_SLOT = "";
  }

  componentDidMount() {
    if (!DEBUG) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }

  render() {
    return (
      <>
        {!DEBUG &&
          <ins className="adsbygoogle"
            style={Object.assign({ display: "block" }, (this.props.height ? { height: this.props.height } : {}))}
            data-ad-client={DATA_AD_CLIENT}
            data-ad-slot={this.DATA_AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        }
        {DEBUG &&
          <div className="adsbygoogle" style={{ backgroundColor: "green", height: 300 }}></div>
        }
      </>
    );
  }
}


export class SquareAds extends DisplayAds {
  constructor(props) {
    super(props);
    this.DATA_AD_SLOT = DATA_AD_SLOT_SQUARE;
  }
}


export class LandscapeAds extends DisplayAds {
  constructor(props) {
    super(props);
    this.DATA_AD_SLOT = DATA_AD_SLOT_LANDSCAPE;
  }
}