import * as React from "react";

const bindLifecycleTypeName = "$$bindLifecycle";
export default class AsyncComponent extends React.Component {
  state = {
    component: null,
  };

  forceUpdateChildren() {
    if (!this.props.children) {
      return;
    }
    const root = this._reactInternalFiber || this._reactInternalInstance;
    let node = root.child;
    let sibling = node;
    while (sibling) {
      while (true) {
        if (
          node.type &&
          node.type.displayName &&
          node.type.displayName.indexOf(bindLifecycleTypeName) !== -1
        ) {
          return;
        }
        if (node.stateNode) {
          break;
        }
        node = node.child;
      }
      if (typeof node.type === "function") {
        node.stateNode.forceUpdate();
      }
      sibling = sibling.sibling;
    }
  }

  componentDidMount() {
    const { children } = this.props;
    Promise.resolve().then(() => this.setState({ component: children }));
  }

  componentDidUpdate() {
    this.props.onUpdate();
  }

  // Delayed update
  // In order to be able to get real DOM data
  shouldComponentUpdate() {
    if (!this.state.component) {
      // If it is already mounted asynchronously, you don't need to do it again when you update it.
      this.props.setMounted(false);
      return true;
    }
    Promise.resolve().then(() => {
      if (this.props.getMounted()) {
        this.props.setMounted(false);
        this.forceUpdateChildren();
        this.props.onUpdate();
      }
    });
    return false;
  }

  render() {
    return this.state.component;
  }
}
