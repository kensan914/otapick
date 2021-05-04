import React, { useState } from "react";

import { useAuthState } from "~/contexts/AuthContext";
import { useAxios } from "~/hooks/useAxios";
import { isMobile } from "~/utils/index";

const SettingsSubmit = (props) => {
  const {
    url,
    methodType = "put",
    data,
    title = "保存",
    canSubmit = false,
    thenCallback = () => void 0,
  } = props;

  const authState = useAuthState();
  const [isSuccessSubmit, setIsSuccessSubmit] = useState(false);
  const { isLoading, request } = useAxios(url, methodType, {
    data: data,
    thenCallback: (res) => {
      thenCallback && thenCallback(res);
      setIsSuccessSubmit(true);
    },
    catchCallback: () => {
      setIsSuccessSubmit(false);
    },
    token: authState.token,
  });

  let statusText = "";
  if (canSubmit) statusText = "未保存";
  if (isSuccessSubmit && !canSubmit) statusText = "保存されました";
  if (isLoading) statusText = "保存しています...";
  return (
    <div
      className={`d-flex row justify-content-end align-items-center py-3 settings-submit`}
    >
      {statusText && (
        <div className="mx-3 font-weight-light settings-submit-status">
          {statusText}
        </div>
      )}

      <button
        disabled={!canSubmit || isLoading}
        className={`settings-submit-button rounded-pill px-4 py-2 ${
          isMobile ? "mr-3" : ""
        } ${canSubmit ? "active" : ""}`}
        onClick={() => {
          request();
        }}
        style={{
          ...(canSubmit ? {} : { cursor: "default" }),
          ...(isLoading ? { cursor: "wait" } : {}),
        }}
      >
        <b>{title}</b>
      </button>
    </div>
  );
};

export default SettingsSubmit;
