import React, { useState } from "react";
import { useAuthState } from "../contexts/AuthContext";
import FavMembersSettingsTemplate from "../settingsComponents/templates/FavMembersSettingsTemplate";
import SettingsTemplate from "../settingsComponents/templates/SettingsTemplate";

const SettingsPage = (props) => {
  const { type } = props;

  const authState = useAuthState();
  if (authState.status !== "Authenticated") {
    return <></>; // TODO: not found
  }

  // settings page追加の際、ここに追記
  const [SETTINGS_COLLECTION] = useState({
    FAV_MEMBERS: {
      title: "推し設定",
      contentTemplate: <FavMembersSettingsTemplate />,
      url: "/settings/fav-members/",
    },
    TEST: {
      title: "テスト",
      contentTemplate: <FavMembersSettingsTemplate />,
      url: "/settings/test/",
    },
  });

  if (type in SETTINGS_COLLECTION) {
    return (
      <SettingsTemplate SETTINGS_COLLECTION={SETTINGS_COLLECTION} type={type} />
    );
  } else {
    // 初期状態
    return (
      <SettingsTemplate
        SETTINGS_COLLECTION={SETTINGS_COLLECTION}
        type={"FAV_MEMBERS"}
      />
    );
  }
};

export default SettingsPage;
