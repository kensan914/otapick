import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import AvatarSequence from "../atoms/AvatarSequence";
import ProfileIcon from "../atoms/ProfileIcon";
import { isSmp } from "../modules/utils";

const ProfileView = (props) => {
  const { profile, isMe } = props;
  const titleFontSize = isSmp ? 16 : 26;

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
              {
                url: "5",
                alt: "櫻坂46",
                backgroundColor: "pink",
                contentsNode: <div className="saka-mark" />,
              },
              {
                url: "5",
                alt: "日向坂46",
                backgroundColor: "lightskyblue",
                contentsNode: <div className="saka-mark" />,
              },
              {
                url: "5",
                alt: "欅坂46",
                backgroundColor: "green",
                contentsNode: <div className="saka-mark" />,
              },
              ...(isMe
                ? [
                    {
                      url: "5",
                      alt: "推しグループを追加する",
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
              {
                url: "1",
                imageUrl:
                  "http://127.0.0.1:8000/media/member_images/2_2/1000_1000_102400.jpg",
                alt: "なっちょ",
              },
              {
                url: "2",
                imageUrl:
                  "http://127.0.0.1:8000/media/member_images/2_3/mi_2_3.jpg",
                alt: "めみ",
              },
              {
                url: "3",
                imageUrl:
                  "http://127.0.0.1:8000/media/member_images/2_4/1000_1000_102400.jpg",
                alt: "かげ",
              },
              {
                url: "4",
                imageUrl:
                  "http://127.0.0.1:8000/media/member_images/2_6/1000_1000_102400.jpg",
                alt: "きょん",
              },
              ...(isMe
                ? [
                    {
                      url: "5",
                      alt: "推しメンを追加する",
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
