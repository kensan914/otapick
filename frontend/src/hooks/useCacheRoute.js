import { useState } from "react";
import { useDidCache, useDidRecover } from "react-router-cache-route";

/**
 *
 * @returns [isCachedRoute]
 */
export const useCacheRoute = () => {
  const [isCachedRoute, setIsCachedRoute] = useState(false);

  useDidCache(() => {
    setIsCachedRoute(true);
  });

  useDidRecover(() => {
    setIsCachedRoute(false);
  });

  return { isCachedRoute };
};
