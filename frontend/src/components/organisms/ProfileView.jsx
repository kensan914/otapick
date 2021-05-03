import React from "react";
import {
  faAngleDown,
  faHeart,
  faImages,
  faPlus,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AvatarSequence from "~/components/atoms/AvatarSequence";
import ProfileIcon from "~/components/atoms/ProfileIcon";
import TooltipComponent from "~/components/atoms/TooltipComponent";
import { GROUPS } from "~/constants/env";
import { isMobile, isSmp } from "~/utils";
import DropdownMobileFriendly from "~/components/molecules/DropdownMobileFriendly";
import LinkButton from "~/components/atoms/LinkButton";

const ProfileView = (props) => {
  const { profile = {}, isMe } = props;
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
        {!isMobile && (
          /* fav groups */
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
        )}

        <div className="mx-2">
          <ProfileIcon imageUrl={profile.image} />
        </div>

        {!isMobile && (
          /* fav members */
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
        )}
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

      {isMobile &&
        (() => {
          const avatarSequenceItems = [
            ...(Object.keys(favMemberSakuraItem).length
              ? [favMemberSakuraItem]
              : []),
            ...(Object.keys(favMemberHinataItem).length
              ? [favMemberHinataItem]
              : []),
            ...favGroupsItems,
          ];
          return (
            <div className="d-flex justify-content-center align-items-center mt-2">
              <div className="d-flex justify-content-center align-items-center border-top border-light rounded-pill p-1 shadow-sm">
                <div className="pl-3 pr-2">
                  <TooltipComponent title={"推し"}>
                    <FontAwesomeIcon icon={faHeart} color="#ff7f7f" size="lg" />
                  </TooltipComponent>
                </div>

                <div
                  className="mobile-fav-members-contents-wrapper border border-light rounded-pill"
                  style={{ maxWidth: window.innerWidth * 0.65 }}
                >
                  {avatarSequenceItems.length > 0 ? (
                    <AvatarSequence
                      direction="left"
                      isOverlap={false}
                      items={avatarSequenceItems}
                    />
                  ) : (
                    <div className="py-1 px-2">
                      {isMe
                        ? "推しを設定して画像やブログの表示をカスタマイズしましょう！"
                        : "推し未設定"}
                    </div>
                  )}
                </div>

                {isMe && avatarSequenceItems.length > 0 ? (
                  <DropdownMobileFriendly
                    id="fav-member-dropdown"
                    buttonClass="rounded-circle fav-member-dropdown-button d-flex justify-content-center align-items-center mx-1 border-0"
                    buttonStyle={{
                      width: 45,
                      height: 45,
                    }}
                    menuSettings={[
                      { type: "TITLE", label: "推し" },
                      {
                        type: "LINK",
                        pathname: "/settings/fav-members/",
                        state: {},
                        label: "推しを設定する",
                        icon: faUsersCog,
                      },
                      Object.keys(favMemberSakuraItem).length
                        ? {
                            type: "LINK",
                            pathname: favMemberSakuraItem.url,
                            state: {},
                            label: `「${favMemberSakuraItem.alt}」の画像一覧へ`,
                            icon: faImages,
                          }
                        : {},
                      Object.keys(favMemberHinataItem).length
                        ? {
                            type: "LINK",
                            pathname: favMemberHinataItem.url,
                            state: {},
                            label: `「${favMemberHinataItem.alt}」の画像一覧へ`,
                            icon: faImages,
                          }
                        : {},
                      ...favGroupsItems.map((favGroupsItem) => ({
                        type: "LINK",
                        pathname: favGroupsItem.url,
                        state: {},
                        label: `「${favGroupsItem.alt}」の画像一覧へ`,
                        icon: faImages,
                      })),
                    ]}
                  >
                    <FontAwesomeIcon icon={faAngleDown} color="gray" />
                  </DropdownMobileFriendly>
                ) : (
                  <LinkButton
                    to={"/settings/fav-members/"}
                    className="rounded-circle avatar-sequence-image d-flex justify-content-center align-items-center mx-1 border-0"
                    style={{
                      width: 45,
                      height: 45,
                      backgroundColor: "white",
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} color="gray" />
                  </LinkButton>
                )}
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default ProfileView;
