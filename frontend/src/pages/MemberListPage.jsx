import React, { useState } from "react";
import { useLocation } from "react-router";

import { URLJoin, updateMeta, getGroup, generateWavesVals } from "~/utils";
import { BASE_URL, GROUPS, MEMBERS_DESCRIPTION } from "~/constants/env";
import { useConstructor } from "~/hooks/useConstructor";
import { useAxios } from "~/hooks/useAxios";
import { MemberListTemplate } from "~/components/templates/MemberListTemplate/index";
import { gtagTo } from "~/utils/index";

const MemberListPage = () => {
  const location = useLocation();

  const [initMembers] = useState({});
  const [initTogglerMemory] = useState({});
  useConstructor(() => {
    Object.values(GROUPS).forEach(
      (groupObj) => (initMembers[groupObj.id] = [])
    );
    Object.values(GROUPS).forEach(
      (groupObj) => (initTogglerMemory[groupObj.key] = [])
    );
  });

  const [groupKey, setGroupKey] = useState(Object.values(GROUPS)[0].key);
  const [membersCollection, setMemberCollection] = useState(initMembers);
  const [wavesVals, setWavesVals] = useState([]);
  const [togglerMemory, setTogglerMemory] = useState(initTogglerMemory);

  const storeTogglerMemory = (group, index) => {
    let newToggleMemory = { ...togglerMemory };
    newToggleMemory[group][index] = !newToggleMemory[group][index];
    setTogglerMemory(newToggleMemory);
  };

  useAxios(URLJoin(BASE_URL, "members/"), "get", {
    thenCallback: (res) => {
      const _membersCollection = { ...initMembers };
      const _togglerMemory = { ...initTogglerMemory };
      Object.values(GROUPS).forEach((groupObj) => {
        if (groupObj.isActive) {
          _membersCollection[groupObj.id] = [];
          for (const membersByGene of res.data[groupObj.key]) {
            _membersCollection[groupObj.id].push(
              membersByGene.map((member) => ({
                image: member.image,
                url: member.url,
                officialUrl: member.official_url,
                ct: member.ct,
                lastKanji: member.last_kanji,
                firstKanji: member.first_kanji,
                lastKana: member.last_kana,
                firstKana: member.first_kana,
                belongingGroup: getGroup(member.belonging_group),
                graduate: member.graduate,
              }))
            );
          }

          const _togglerMemory_by_group = new Array(
            _membersCollection[groupObj.id].length
          );
          _togglerMemory_by_group.fill(true);
          _togglerMemory[groupObj.key] = _togglerMemory_by_group;
        }
      });
      setMemberCollection(_membersCollection);
      setWavesVals(generateWavesVals());
      setTogglerMemory(_togglerMemory);

      updateMeta({
        title: `メンバーリスト｜${GROUPS["1"].name}・${GROUPS["2"].name}`,
        description: MEMBERS_DESCRIPTION,
      });
    },
    finallyCallback: () => {
      gtagTo(location.pathname);
    },
    shouldRequestDidMount: true,
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
      membersCollection={membersCollection}
      wavesVals={wavesVals}
      togglerMemory={togglerMemory}
      storeTogglerMemory={storeTogglerMemory}
      changeGroup={changeGroup}
    />
  );
};

export default MemberListPage;
