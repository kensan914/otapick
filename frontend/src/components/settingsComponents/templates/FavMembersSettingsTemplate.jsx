import { Collapse } from "reactstrap";
import React, { useEffect, useState } from "react";
import { BASE_URL, GROUPS } from "../../modules/env";
import SettingsHeader from "../molecules/SettingsHeader";
import SettingsSelector from "../molecules/SettingsSelector";
import { useAxios } from "../../modules/axios";
import {
  deepCvtKeyFromSnakeToCamel,
  equalsArray,
  isObject,
  URLJoin,
} from "../../modules/utils";
import { HorizontalLoader } from "../../molecules/Loader";
import SettingsSubmit from "../molecules/SettingsSubmit";
import {
  useProfileDispatch,
  useProfileState,
} from "../../contexts/ProfileContext";

const FavMembersSettingsTemplate = () => {
  const [favGroupIds, setFavGroupIds] = useState();
  const [favMembers, setFavMembers] = useState(); // {[groupId: GroupId]: ct}

  const [canSubmit, setCanSubmit] = useState(false);
  const [putData, setPutData] = useState({ groups: [], members: [] }); // { groups: GroupId[], members: {group_id: GroupId, ct: Ct}[] }

  const profileState = useProfileState();
  const profileDispatch = useProfileDispatch();
  const [initPutData, setInitPutData] = useState({});

  const genePutData = (_favGroupIds, _favMembers) => {
    // favGroupが有効であるfavMemberのみputDataに含む
    const shouldPutFavMembers = filterFavMembersAlsoFavGroup(
      _favGroupIds,
      _favMembers
    );

    // membersをput data用に整形
    const putDataMembers = Object.entries(
      shouldPutFavMembers
    ).map(([groupId, memberCt]) => ({ group_id: groupId, ct: memberCt }));

    const _putData = { groups: _favGroupIds, members: putDataMembers };
    return _putData;
  };

  // groupを推していないfavMemberを除いたfavMembersを返す
  const filterFavMembersAlsoFavGroup = (_favGroupIds, _favMembers) => {
    return Object.fromEntries(
      Object.entries(_favMembers).filter(([groupIdStr]) => {
        const groupId = groupIdStr - 0;
        if (isNaN(groupId)) return false;
        return _favGroupIds?.includes(groupId);
      })
    );
  };

  const equalsPutData = (putData1, putData2) => {
    if (!isObject(putData1) || !isObject(putData2)) {
      return false;
    }
    if (
      Object.keys(putData1).length === 0 ||
      Object.keys(putData2).length === 0
    ) {
      return false;
    }
    if (!equalsArray(putData1.groups, putData2.groups, false)) return false;

    if (putData1.members.length !== putData2.members.length) return false;
    // everyテスト. 全て合格でtrue
    const everyResult = putData1.members.every((member1) => {
      const someResult = putData2.members.some((member2) => {
        return (
          member1.group_id === member2.group_id && member1.ct === member2.ct
        );
      });
      if (!someResult) return false;
      else return true;
    });
    if (!everyResult) return false;

    return true;
  };

  useEffect(() => {
    // favGroupIdsを初期化
    let initGroupIds = [];
    if (profileState.profile.favGroups) {
      initGroupIds = profileState.profile.favGroups.map((g) => g.groupId);
    }
    setFavGroupIds(initGroupIds);
    // favMembersを初期化
    const initFavMembers = {};
    let propertyNames = [];
    if (profileState.profile.favMemberSakura) {
      propertyNames = [...propertyNames, "favMemberSakura"];
    }
    if (profileState.profile.favMemberHinata) {
      propertyNames = [...propertyNames, "favMemberHinata"];
    }
    propertyNames.forEach((propertyName) => {
      initFavMembers[profileState.profile[propertyName].belongingGroup] =
        profileState.profile[propertyName].ct;
    });
    setFavMembers(initFavMembers);

    // putDataの初期化
    setInitPutData(genePutData(initGroupIds, initFavMembers));
  }, [profileState.profile]);

  // putDataとcanSubmitの更新
  useEffect(() => {
    if (
      typeof favGroupIds !== "undefined" &&
      typeof favMembers !== "undefined"
    ) {
      const _putData = genePutData(favGroupIds, favMembers);
      setPutData(_putData);

      setCanSubmit(!equalsPutData(initPutData, _putData));
    }
  }, [favMembers, favGroupIds?.length]);

  const [members, setMembers] = useState(); // {hinata: [Array(11), Array(9), Array(4)], sakura: [Array(21), Array(15)]}
  useAxios(URLJoin(BASE_URL, "members/"), "get", {
    thenCallback: (res) => {
      const _members = deepCvtKeyFromSnakeToCamel(res.data);
      setMembers(_members);
    },
    shouldRequestDidMount: true,
  });

  return (
    <>
      <SettingsHeader
        title="推し設定"
        description="好きなグループや推しメンを設定し、画像やブログの表示をカスタマイズしましょう。ここで設定したグループやメンバーはプロフィールに表示されます。"
        className="mb-5"
      />

      <FavMembersEditor
        members={members}
        favGroupIds={favGroupIds}
        setFavGroupIds={setFavGroupIds}
        favMembers={favMembers}
        setFavMembers={setFavMembers}
      />

      <SettingsSubmit
        url={URLJoin(BASE_URL, "fav-members/")}
        methodType="put"
        data={putData}
        canSubmit={canSubmit}
        thenCallback={(res) => {
          const _profile = deepCvtKeyFromSnakeToCamel(res.data);
          profileDispatch({ type: "SET_PROFILE", profile: _profile });
        }}
      />
    </>
  );
};

export default FavMembersSettingsTemplate;

const FavMembersEditor = (props) => {
  const {
    members,
    favGroupIds,
    setFavGroupIds,
    favMembers,
    setFavMembers,
  } = props;

  const [resetKey] = useState("RESET");
  const handleSetFavMembers = (key, groupId) => {
    const _favMembers = { ...favMembers };
    if (key === resetKey) {
      if (groupId in _favMembers) {
        delete _favMembers[groupId];
      }
    } else {
      _favMembers[groupId] = key;
    }

    setFavMembers(_favMembers);
  };

  const toggleFavGroups = (groupId) => {
    let _favGroupIds;
    if (favGroupIds.includes(groupId)) {
      _favGroupIds = favGroupIds.filter((elm) => elm !== groupId);
    } else {
      _favGroupIds = [...favGroupIds, groupId];
    }

    setFavGroupIds(_favGroupIds);
  };

  const geneSettingsSelectorItems = (members, groupKey) => {
    const memberListByG = members[groupKey]; // ex) [Array(11), Array(9), Array(4)]
    let items = [{ key: resetKey, label: "リセット" }];
    memberListByG.forEach((memberListByGeneration, i) /* Array(11) */ => {
      const generation = i + 1;
      const headerItem = { label: `${generation}期生` };
      items.push(headerItem);

      const memberItems = memberListByGeneration.map((member) => {
        return {
          key: member.ct,
          label: member.fullKanji,
          imageUrl: member.image,
        };
      });
      items.push(...memberItems);
    });

    return items;
  };

  return (
    typeof favGroupIds !== "undefined" &&
    typeof favMembers !== "undefined" &&
    Object.values(GROUPS).map((groupObj, i) => {
      const isActive = favGroupIds.includes(groupObj.id);
      // 櫻推し && 欅推しの時、欅Collapseをopenしない
      const shouldOpenCollapse =
        groupObj.key !== "keyaki" || !favGroupIds.includes(1);

      return (
        <div key={i} className="fav-members-editor-item">
          <button
            className={`fav-groups-button rounded-pill px-3 py-2 ${
              isActive ? "active " + groupObj.key : ""
            }`}
            onClick={() => {
              toggleFavGroups(groupObj.id);
            }}
          >
            <b>{groupObj.name}</b>
          </button>

          <Collapse isOpen={isActive && shouldOpenCollapse}>
            <div className="fav-members-editor-body px-4 pt-3 pb-1">
              {groupObj.key !== "keyaki" ? (
                members ? (
                  <div>
                    <h6>推しメン</h6>
                    <SettingsSelector
                      settingsSelectorId={`settings-selector-fav-members-${groupObj.key}`}
                      items={geneSettingsSelectorItems(members, groupObj.key)}
                      setKey={(key) => {
                        handleSetFavMembers(key, groupObj.id);
                      }}
                      resetKey={resetKey}
                      height={70}
                      blankLabel={"箱推し"}
                      initKey={
                        String(groupObj.id) in favMembers
                          ? favMembers[groupObj.id]
                          : ""
                      }
                    />
                  </div>
                ) : (
                  <HorizontalLoader />
                )
              ) : (
                <div>
                  欅坂46の推しメンは、櫻坂46の推しを有効にすることで設定できます。
                </div>
              )}
            </div>
          </Collapse>

          <hr />
        </div>
      );
    })
  );
};
