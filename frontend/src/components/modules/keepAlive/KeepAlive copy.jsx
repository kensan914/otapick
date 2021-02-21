import React, { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import AsyncComponent from "./AsyncComponent";
import { useKeepAliveState } from "./KeepAliveContext";


const KeepAlive = (props) => {
  const { children } = props;
  const [locationKey] = useState(props.location.key);
  const keepAliveRef = useRef(null);
  const keepAliveState = useKeepAliveState();

  useEffect(() => {
    // const mark = document.getElementById(`mark-${locationKey}`);
    // if (mark) {
    //   const keepAliveNode = document.getElementById(`keepAlive-${locationKey}`);
    //   mark.parentNode.insertBefore(keepAliveNode, mark);
    // }

    return (() => {
      // keepAliveState.storeNode.insertBefore(keepAliveRef.current, keepAliveState.storeNode.firstChild);
      retreatPosition();
    });
  }, []);

  // useEffect(() => {
  //   if (keepAliveRef.current) {
  //     const keepAliveMark = document.createElement("div");
  //     keepAliveMark.id = `mark-${locationKey}`;
  //     keepAliveMark.style.display = "none";
  //     keepAliveRef.current.parentNode.insertBefore(keepAliveMark, keepAliveRef.current.nextSibling);
  //   }
  // }, [keepAliveRef]);

  const childNodes = useRef([]);
  const keepAliveRefNextSibling = useRef(null);
  const correctionPosition = () => {
    console.log("リトリート");
    if (keepAliveRef && keepAliveRef.parentNode && keepAliveRef.nextSibling) {
      console.log("コレクション2");
      const childNodes = keepAliveRef.childNodes;
      keepAliveRefNextSibling.current = keepAliveRef.nextSibling;
      childNodes.current = [];
      while (childNodes.length) {
        const child = childNodes[0];
        childNodes.current.push(child);
        keepAliveRef.parentNode.insertBefore(child, keepAliveRef.nextSibling);
      }
      keepAliveRef.parentNode.removeChild(keepAliveRef);
    }
  }

  const retreatPosition = () => {
    console.log("リトリート");
    if (keepAliveRef && keepAliveRefNextSibling.current && keepAliveRefNextSibling.current.parentNode) {
      console.log("リトリート2");
      for (const child of childNodes.current) {
        keepAliveRef.appendChild(child);
      }
      keepAliveRefNextSibling.current.parentNode.insertBefore(keepAliveRef, keepAliveRefNextSibling.current);
    }
  }

  const mounted = useRef(false);
  const setMounted = (value) => {
    mounted.current = value;
  }

  const getMounted = () => {
    return mounted.current;
  }

  const getContainer = () => {
    const keepAliveContainer = document.getElementById(`keepAlive-${locationKey}`);
    if (keepAliveContainer) return keepAliveContainer;

    const keepAliveDOM = document.createElement("div");
    document.body.appendChild(keepAliveDOM);
    return keepAliveDOM;
  }

  return (
    ReactDOM.render(
      children,
      getContainer()
    )
  );

  // return (
  //   <div
  //     id={`keepAlive-${locationKey}`}
  //     ref={keepAliveRef}
  //   >
  //     <AsyncComponent
  //       setMounted={setMounted}
  //       getMounted={getMounted}
  //       onUpdate={correctionPosition}
  //     >
  //       {children}
  //     </AsyncComponent>
  //   </div>
  // );


  // const keepAliveContainer = (() => {
  //   const keepAliveDOM = document.createElement("div");
  //   keepAliveDOM.dataset.type = prefix;
  //   keepAliveDOM.style.display = "none";
  //   document.body.appendChild(keepAliveDOM);
  //   return keepAliveDOM;
  // })();

  // if (keepAliveRef.current) {
  //   console.log(keepAliveRef);
  //   console.log(document.getElementById(`keepAlive-${locationKey}`));
  //   return (
  //     ReactDOM.createPortal(
  //       <div
  //         id={`keepAlive-${locationKey}`}
  //         ref={keepAliveRef}
  //       >
  //         {children}
  //       </div>
  //       , keepAliveRef.current)
  //   );
  // }
  // else {
  //   return (
  //     // <div id={`ka`}>
  //       <div
  //         id={`keepAlive-${locationKey}`}
  //         ref={keepAliveRef}
  //       >
  //         {children}
  //       </div>
  //     // </div>
  //   );
  // }
}

export default withRouter(KeepAlive);