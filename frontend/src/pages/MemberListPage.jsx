import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router";

import { URLJoin, getGroup, generateWavesVals } from "~/utils";
import { BASE_URL, GROUPS, MEMBERS_DESCRIPTION } from "~/constants/env";
import { useConstructor } from "~/hooks/useConstructor";
import { MemberListTemplate } from "~/components/templates/MemberListTemplate/index";
import { useMeta } from "~/hooks/useMeta";
import { useAxiosQuery } from "~/hooks/useAxiosQuery";
import { useProfileState } from "~/contexts/ProfileContext";
import { sortGROUPSByFav } from "~/utils/index";

const MemberListPage = () => {
  const location = useLocation();
  const qs = queryString.parse(location.search);
  const profileState = useProfileState();

  const [initMembers] = useState({});
  const [initTogglerMemory] = useState({});
  useConstructor(() => {
    Object.values(GROUPS).forEach(
      (groupObj) => (initMembers[groupObj.id] = {})
    );
    Object.values(GROUPS).forEach(
      (groupObj) => (initTogglerMemory[groupObj.key] = {})
    );
  });

  // groupKey
  const validateGroupKey = (_groupKey) => {
    // 初期状態は, 推しグループにより決定
    const favGroupsExcludeKeyaki = profileState.profile.favGroups
      ? profileState.profile.favGroups.filter(
          (_favGroup) => _favGroup.key !== "keyaki" // 欅は除外
        )
      : profileState.profile.favGroups;
    const initGroupObj = sortGROUPSByFav(favGroupsExcludeKeyaki)[0];
    if (_groupKey) {
      const groupObj = Object.values(GROUPS).find(
        (_groupObj) => _groupObj.key === _groupKey
      );
      if (groupObj) {
        return groupObj;
      }
    }
    return initGroupObj;
  };
  const [groupKey, setGroupKey] = useState(validateGroupKey("").key);
  const { setMeta } = useMeta();
  useEffect(() => {
    setGroupKey(validateGroupKey(qs.group).key);

    if (qs.group) {
      setMeta(
        `メンバーリスト｜${validateGroupKey(qs.group).name}`,
        MEMBERS_DESCRIPTION
      );
    } else {
      setMeta(
        `メンバーリスト｜${GROUPS["1"].name}・${GROUPS["2"].name}`,
        MEMBERS_DESCRIPTION
      );
    }
  }, [qs.group]);

  const [memberCollection, setMemberCollection] = useState(initMembers);
  const [wavesVals] = useState(generateWavesVals());
  const [togglerMemory, setTogglerMemory] = useState(initTogglerMemory);

  const storeTogglerMemory = (group, index) => {
    let newToggleMemory = { ...togglerMemory };
    newToggleMemory[group][index] = !newToggleMemory[group][index];
    setTogglerMemory(newToggleMemory);
  };

  useAxiosQuery(URLJoin(BASE_URL, "members/"), {
    thenCallback: (resData) => {
      const _membersCollection = { ...initMembers };
      const _togglerMemory = { ...initTogglerMemory };
      Object.values(GROUPS).forEach((groupObj) => {
        if (groupObj.isActive) {
          const memberCollectionByGroup = { ...resData[groupObj.key] };
          _membersCollection[groupObj.id] = memberCollectionByGroup;

          Object.keys(memberCollectionByGroup).forEach((generate) => {
            _membersCollection[groupObj.id][generate] = memberCollectionByGroup[
              generate
            ].map((member) => {
              const _member = { ...member };
              _member.belongingGroup = getGroup(member.belongingGroup);
              return _member;
            });
          });

          const _togglerMemory_by_group = {};
          Object.keys(memberCollectionByGroup).forEach((generate) => {
            _togglerMemory_by_group[generate] = true;
          });
          _togglerMemory[groupObj.key] = _togglerMemory_by_group;
        }
      });
      setMemberCollection(_membersCollection);
      setTogglerMemory(_togglerMemory);
    },
  });

  return (
    <MemberListTemplate
      groupKey={groupKey}
      membersCollection={memberCollection}
      wavesVals={wavesVals}
      togglerMemory={togglerMemory}
      storeTogglerMemory={storeTogglerMemory}
      locationKey={location.key}
    />
  );
};

export default MemberListPage;
