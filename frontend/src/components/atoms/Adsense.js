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
      console.log("render adsense.")
    }
  }

  render() {
    return (
      <>
        {!DEBUG &&
          <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={DATA_AD_CLIENT}
            data-ad-slot={this.DATA_AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
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


// import React, { useEffect } from 'react';
// import { DEBUG, DATA_AD_CLIENT, DATA_AD_SLOT_SQUARE } from '../tools/env';

// export function SquareAds(props) {
//     useEffect(() => {
//         if (window.adsbygoogle && !DEBUG) {
//             window.adsbygoogle.push({});
//         }
//     }, []);

//     return (
//         <ins className="adsbygoogle"
//             style={{ "display": "block" }}
//             data-ad-client={DATA_AD_CLIENT}
//             data-ad-slot={DATA_AD_SLOT_SQUARE}
//             data-ad-format="auto"
//             data-full-width-responsive="true"></ins>
//     );
// }