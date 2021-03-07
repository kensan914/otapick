import React, { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import { checkCorrectKey } from "../utils";
import { useKeepAliveDispatch, useKeepAliveState } from "./KeepAliveContext";

const KeepAlive = withRouter((props) => {
  const { keepAliveParentRef, children } = props;
  const [locationKey] = useState(props.location.key);
  const keepAliveRef = useRef(null);
  const keepAliveState = useKeepAliveState();
  const keepAliveDispatch = useKeepAliveDispatch();

  // useEffect(() => {
  //   return (() => {
  //     keepAliveState.storeNode.insertBefore(keepAliveRef.current, keepAliveState.storeNode.firstChild);
  //   });
  // }, []);

  // const getContainer = () => {
  //   const keepAliveContainer = document.getElementById(`keepAlive-${locationKey}`);
  //   if (keepAliveContainer) return keepAliveContainer;

  //   const keepAliveDOM = document.createElement("div");
  //   console.log(keepAliveParentRef);
  //   keepAliveParentRef.current.appendChild(keepAliveDOM);
  //   return keepAliveDOM;
  // }

  useEffect(() => {
    return () => {
      console.log("アンマウント");
    };
  }, []);

  useEffect(() => {
    // keepAliveDispatch({ type: "SET_CACHE", locationKey: locationKey, value: { children: children } });
    keepAliveState.setCaches(locationKey, { children: children });
  });

  return (
    // ReactDOM.render(
    //   children,
    //   getContainer()
    // )
    children
  );
});

const KeepAliveParent = (props) => {
  const { children } = props;
  const keepAliveParentRef = useRef(null);
  const [locationKey] = useState(props.location.key);

  const content = keepAliveParentRef.current ? (
    <KeepAlive keepAliveParentRef={keepAliveParentRef}>{children}</KeepAlive>
  ) : (
    []
  );

  return (
    <div id={`keepAlive-${locationKey}`} ref={keepAliveParentRef}>
      {content}
    </div>
  );
};

export default withRouter(KeepAliveParent);
