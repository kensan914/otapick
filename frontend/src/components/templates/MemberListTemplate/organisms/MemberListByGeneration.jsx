import React from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse } from "reactstrap";

import MemberCard from "~/components/molecules/MemberCard";

export const MemberListByGeneration = (props) => {
  const {
    generation,
    members,
    wavesVals,
    group,
    isOpen,
    index,
    setTogglerMemory,
  } = props;
  return (
    <>
      <div className="row justify-content-between mx-2">
        <h3 className="my-auto d-flex align-items-center">{generation}期生</h3>
        <button
          onClick={() => setTogglerMemory(group, index)}
          className="btn rounded-circle p-0 otapick-hidden-button my-auto"
        >
          {isOpen ? (
            <FontAwesomeIcon icon={faChevronUp} style={{ color: "gray" }} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} style={{ color: "gray" }} />
          )}
        </button>
      </div>
      <hr className="mt-1" />
      <Collapse isOpen={isOpen}>
        <div className="row mb-5">
          {members.map(
            (
              {
                image,
                url,
                officialUrl,
                ct,
                lastKanji,
                firstKanji,
                lastKana,
                firstKana,
                belongingGroup,
                graduate,
              },
              i
            ) => (
              <div
                key={i}
                className="col-6 col-md-4 col-xl-3 my-2 px-1 px-sm-3"
              >
                <MemberCard
                  key={i}
                  id={i}
                  ct={ct}
                  image={image}
                  url={url}
                  officialUrl={officialUrl}
                  lastKanji={lastKanji}
                  firstKanji={firstKanji}
                  lastKana={lastKana}
                  firstKana={firstKana}
                  belongingGroup={belongingGroup}
                  wavesVals={wavesVals}
                  graduate={graduate}
                />
              </div>
            )
          )}
        </div>
      </Collapse>
    </>
  );
};
