import React from 'react';
import { DATA_AD_SLOT, DATA_AD_CLIENT, DEBUG } from '../tools/env';


class SquareAds extends React.Component {
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
            style={{ display: "block" }}
            data-ad-client={DATA_AD_CLIENT}
            data-ad-slot={DATA_AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        }
      </>
    );
  }
}

export default SquareAds;