import React from 'react';

class Loader extends React.Component {
  render() {
    return (
      <div className="loader-ellips infinite-scroll-request my-5">
      <span className="loader-ellips__dot"></span>
      <span className="loader-ellips__dot"></span>
      <span className="loader-ellips__dot"></span>
      <span className="loader-ellips__dot"></span>
    </div>
    );
  }
}

export default Loader;