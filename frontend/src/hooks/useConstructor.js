import { useState } from "react";

/**
 * class componentのconstructorの実行タイミングは、functional componentのuseEffectでは実現不可能
 * 任意のコールバックをclass componentのconstructorのタイミングで実行することができるカスタムhookを提供する
 * @param {*} callBack
 * @returns
 */
export const useConstructor = (callBack = () => void 0) => {
  const [isCalled, setIsCalled] = useState(false);
  if (isCalled) return;

  callBack();
  setIsCalled(true);
};
