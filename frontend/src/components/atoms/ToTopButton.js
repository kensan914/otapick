import React from 'react';
import { TOTOP_BUTTON_DIAMETER, TOTOP_BUTTON_M, BOTTOM_NAVBAR_HEIGHT } from '../modules/env';
import { isMobile } from '../modules/utils';


class ToTopButton extends React.Component {
  getScrolled = () => {
    return (window.pageYOffset !== undefined) ? window.pageYOffset : document.documentElement.scrollTop;
  }

  toTop = () => {
    var scrolled = this.getScrolled();
    window.scrollTo(0, Math.floor(scrolled / 2));
    if (scrolled > 0) {
      window.setTimeout(this.toTop, 30);
    }
  };

  render() {
    let totopButtonStyle = { width: TOTOP_BUTTON_DIAMETER, height: TOTOP_BUTTON_DIAMETER, right: TOTOP_BUTTON_M };
    if (isMobile) {
      Object.assign(totopButtonStyle, { bottom: TOTOP_BUTTON_M + BOTTOM_NAVBAR_HEIGHT });
    } else {
      Object.assign(totopButtonStyle, { bottom: TOTOP_BUTTON_M });
    }

    return (
      <button onClick={this.toTop} id="otapick-totop-button" className={"btn rounded-circle p-0 otapick-totop-button shadow"}
        style={totopButtonStyle} />
    );
  };
};

export default ToTopButton;