import React from 'react';


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
    return (
      <button onClick={this.toTop} className={"btn rounded-circle p-0 otapick-totop-button shadow"}></button>
    );
  };
};

export default ToTopButton;