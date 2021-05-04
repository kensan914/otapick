import React, { useEffect, useState } from "react";

import { useAuthState } from "~/contexts/AuthContext";
import FavMembersSettingsTemplate from "~/components/templates/SettingsTemplate/FavMembersSettingsTemplate";
import SettingsTemplate from "~/components/templates/SettingsTemplate";
import { useMeta } from "~/hooks/useMeta";

const SettingsPage = (props) => {
  const { type } = props;

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

  const { setMeta } = useMeta();
  useEffect(() => {
    setMeta(
      SETTINGS_COLLECTION[type in SETTINGS_COLLECTION ? type : DEFAULT_TYPE]
        .title,
      ""
    );
  }, [type]);

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
