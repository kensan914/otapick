import { useRef } from "react";
import { useDidCache, useDidRecover } from "react-router-cache-route";

/**
 *
 * @returns [isCachedRoute]
 */
const useCacheRoute = () => {
  const isCachedRouteRef = useRef(false);

  useDidCache(() => {
    isCachedRouteRef.current = true;
  });

  useDidRecover(() => {
    isCachedRouteRef.current = false;
  });

  return { isCachedRoute: isCachedRouteRef.current };
};

export default useCacheRoute;
