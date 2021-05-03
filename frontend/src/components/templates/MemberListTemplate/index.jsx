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
    changeGroup,
  } = props;

  let membersComponent = [];
  let numOfHit = 0;
  Object.values(GROUPS).forEach((groupObj) => {
    if (groupObj.key === groupKey) {
      for (const [index, members] of membersCollection[groupObj.id].entries()) {
        membersComponent.push(
          <MemberListByGeneration
            key={`${groupKey}-${index + 1}`}
            generation={index + 1}
            members={members}
            wavesVals={wavesVals}
            group={groupKey}
            isOpen={togglerMemory[groupObj.key][index]}
            index={index}
            setTogglerMemory={(groupKey, index) =>
              storeTogglerMemory(groupKey, index)
            }
          />
        );
        numOfHit += members.length;
      }
    }
  });

  return (
    <div className="container mt-3 text-muted">
      <Headline
        title="メンバーリスト"
        type="members"
        group={groupKey}
        changeGroup={(groupKey) => changeGroup(groupKey)}
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
