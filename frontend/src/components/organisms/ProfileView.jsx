import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import AvatarSequence from "../atoms/AvatarSequence";
import ProfileIcon from "../atoms/ProfileIcon";
import { GROUPS } from "../modules/env";
import { isSmp } from "../modules/utils";

const ProfileView = (props) => {
  const { profile, isMe } = props;
  const titleFontSize = isSmp ? 16 : 26;

  const favGroupsItems = profile?.favGroups
    ? profile.favGroups.map((group) => {
        return {
          url: `/images/${group.groupId}/`,
          alt: group.name,
          backgroundColor: GROUPS[group.groupId]?.color,
          contentsNode: <div className="saka-mark" />,
        };
      })
    : [];
  const geneFavMemberItem = (propertyName) => {
    return profile[propertyName]
      ? {
          url: `/images/${GROUPS[profile[propertyName].belongingGroup].id}/${
            profile[propertyName].ct
          }/`,
          imageUrl: profile[propertyName].image,
          alt: profile[propertyName].fullKanji,
        }
      : {};
  };
  const favMemberSakuraItem = geneFavMemberItem("favMemberSakura");
  const favMemberHinataItem = geneFavMemberItem("favMemberHinata");
  return (
    <div className="my-2 my-sm-4">
      <div className="d-flex justify-content-center pb-3">
        {/* fav groups */}
        <div
          className="d-flex justify-content-end align-items-end"
          style={{ flex: 1 }}
        >
          <AvatarSequence
            direction="right"
            items={[
              ...favGroupsItems,
              ...(isMe
                ? [
                    {
                      url: "/settings/fav-members/",
                      alt: "推しグループを編集する",
                      backgroundColor: "whitesmoke",
                      contentsNode: (
                        <FontAwesomeIcon icon={faPlus} color="gray" />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>

        <div className="mx-2">
          <ProfileIcon imageUrl={profile.image} />
        </div>

        {/* fav members */}
        <div className="d-flex align-items-end" style={{ flex: 1 }}>
          <AvatarSequence
            direction="left"
            items={[
              ...(Object.keys(favMemberSakuraItem).length
                ? [favMemberSakuraItem]
                : []),
              ...(Object.keys(favMemberHinataItem).length
                ? [favMemberHinataItem]
                : []),
              ...(isMe
                ? [
                    {
                      url: "/settings/fav-members/",
                      alt: "推しメンを編集する",
                      backgroundColor: "whitesmoke",
                      contentsNode: (
                        <FontAwesomeIcon icon={faPlus} color="gray" />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
      <div className="d-flex align-items-center flex-column">
        <h1
          className="profile-title pb-0 pb-sm-2 m-0 text-center"
          style={{ fontSize: titleFontSize }}
        >
          {profile.name}
        </h1>
        <div className="">@{profile.username}</div>
      </div>
    </div>
  );
};

export default ProfileView;
