import React, { useState } from "react";

import { URLJoin, getGroup, generateWavesVals } from "~/utils";
import { BASE_URL, GROUPS, MEMBERS_DESCRIPTION } from "~/constants/env";
import { useConstructor } from "~/hooks/useConstructor";
import { MemberListTemplate } from "~/components/templates/MemberListTemplate/index";
import { useMeta } from "~/hooks/useMeta";
import { useAxiosQuery } from "~/hooks/useAxiosQuery";

const MemberListPage = () => {
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

  const [groupKey, setGroupKey] = useState(Object.values(GROUPS)[0].key);
  const [memberCollection, setMemberCollection] = useState(initMembers);
  const [wavesVals] = useState(generateWavesVals());
  const [togglerMemory, setTogglerMemory] = useState(initTogglerMemory);

  const storeTogglerMemory = (group, index) => {
    let newToggleMemory = { ...togglerMemory };
    newToggleMemory[group][index] = !newToggleMemory[group][index];
    setTogglerMemory(newToggleMemory);
  };

  const { setMeta } = useMeta();
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

      setMeta(
        `メンバーリスト｜${GROUPS["1"].name}・${GROUPS["2"].name}`,
        MEMBERS_DESCRIPTION
      );
    },
  });

  const changeGroup = (_groupKey) => {
    if (_groupKey !== groupKey) {
      Object.values(GROUPS).forEach((groupObj) => {
        if (groupObj.key === _groupKey) setGroupKey(_groupKey);
      });
    }
  };

  return (
    <MemberListTemplate
      groupKey={groupKey}
      membersCollection={memberCollection}
      wavesVals={wavesVals}
      togglerMemory={togglerMemory}
      storeTogglerMemory={storeTogglerMemory}
      changeGroup={changeGroup}
    />
  );
};

export default MemberListPage;
