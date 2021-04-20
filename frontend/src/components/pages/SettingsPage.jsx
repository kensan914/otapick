import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useAuthState } from "../contexts/AuthContext";
import { gtagTo, updateMeta } from "../modules/utils";
import FavMembersSettingsTemplate from "../settingsComponents/templates/FavMembersSettingsTemplate";
import SettingsTemplate from "../settingsComponents/templates/SettingsTemplate";

const SettingsPage = (props) => {
  const { type } = props;

  const location = useLocation();

  const authState = useAuthState();
  if (authState.status !== "Authenticated") {
    return <></>; // TODO: not found
  }

  const DEFAULT_TYPE = "FAV_MEMBERS";
  // settings page追加の際、ここに追記
  const [SETTINGS_COLLECTION] = useState({
    FAV_MEMBERS: {
      title: "推し設定",
      contentTemplate: <FavMembersSettingsTemplate />,
      url: "/settings/fav-members/",
    },
    // EXAMPLE: {
    //   title: "example",
    //   contentTemplate: <ExampleSettingsTemplate />,
    //   url: "/settings/example/",
    // },
  });
  useEffect(() => {
    updateMeta({
      title:
        SETTINGS_COLLECTION[type in SETTINGS_COLLECTION ? type : DEFAULT_TYPE]
          .title,
      description: "",
    });
  }, [type]);

  useEffect(() => {
    gtagTo(location.pathname);
  }, []);

  if (type in SETTINGS_COLLECTION) {
    return (
      <SettingsTemplate SETTINGS_COLLECTION={SETTINGS_COLLECTION} type={type} />
    );
  } else {
    // 初期状態
    return (
      <SettingsTemplate
        SETTINGS_COLLECTION={SETTINGS_COLLECTION}
        type={DEFAULT_TYPE}
      />
    );
  }
};

export default SettingsPage;
