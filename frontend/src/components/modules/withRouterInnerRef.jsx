import React from "react";
import { withRouter } from "react-router-dom";

// withRouterをつかった子コンポーネントは、refで参照できないので対処
// https://ja.coder.work/so/javascript/1182871

export const withRouterInnerRef = (WrappedComponent) => {
  class InnerComponentWithRef extends React.Component {
    render() {
      const { forwardRef, ...rest } = this.props;
      return <WrappedComponent {...rest} ref={forwardRef} />;
    }
  }

  const ComponentWithRef = withRouter(InnerComponentWithRef, { withRef: true });

  return React.forwardRef((props, ref) => {
    return <ComponentWithRef {...props} forwardRef={ref} />;
  });
};
