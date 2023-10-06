import React from "react";

import Headline from "~/components/molecules/Headline";
import { MemberListInfo } from "~/components/templates/MemberListTemplate/organisms/MemberListInfo";
import { GROUPS } from "~/constants/env";
import { LoaderScreen } from "~/components/molecules/Loader";
import { MemberListByGeneration } from "~/components/templates/MemberListTemplate/organisms/MemberListByGeneration";

export const MemberListTemplate = (props) => {
  const {
    groupKey,
    membersCollection,
    wavesVals,
    togglerMemory,
    storeTogglerMemory,
    locationKey,
  } = props;

  let membersComponent = [];
  let numOfHit = 0;
  Object.values(GROUPS).forEach((groupObj) => {
    if (groupObj.key === groupKey) {
      for (const [generate, members] of Object.entries(
        membersCollection[groupObj.id]
      )) {
        if (generate != groupObj.otherMemberGeneration) {
          membersComponent.push(
            <MemberListByGeneration
              key={`${groupKey}-${generate}`}
              generation={generate}
              members={members}
              wavesVals={wavesVals}
              group={groupKey}
              isOpen={togglerMemory[groupObj.key][generate]}
              index={generate}
              setTogglerMemory={(groupKey, index) =>
                storeTogglerMemory(groupKey, index)
              }
            />
          );
        }

        numOfHit += members.length;
      }
    }
  });

  // その他メンバーの追加
  Object.values(GROUPS).forEach((groupObj) => {
    if (
      groupObj.key === groupKey &&
      groupObj.otherMemberGeneration in membersCollection[groupObj.id]
    ) {
      membersComponent.push(
        <MemberListByGeneration
          key={`${groupKey}-other-members`}
          title={"その他"}
          members={
            membersCollection[groupObj.id][groupObj.otherMemberGeneration]
          }
          wavesVals={wavesVals}
          group={groupKey}
          isOpen={togglerMemory[groupObj.key][groupObj.otherMemberGeneration]}
          index={groupObj.otherMemberGeneration}
          setTogglerMemory={(groupKey, index) =>
            storeTogglerMemory(groupKey, index)
          }
        />
      );
    }
  });

  return (
    <div className="container mt-3 text-muted">
      <Headline
        key={locationKey}
        title="メンバーリスト"
        type="members"
        group={groupKey}
      />

      <MemberListInfo groupKey={groupKey} numOfHit={numOfHit} />
      <div className="container">
        {membersComponent.length === 0 ? (
          <LoaderScreen type="horizontal" />
        ) : (
          membersComponent
        )}
      </div>
    </div>
  );
};
