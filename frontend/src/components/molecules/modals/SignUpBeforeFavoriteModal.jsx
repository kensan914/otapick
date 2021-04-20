import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import lottie from "lottie-web";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import RoundButton from "../../atoms/RoundButton";
import { GROUPS } from "../../modules/env";

const SignUpBeforeFavoriteModal = (props) => {
  const { isOpen, toggle } = props;

  const animationContainer = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Init lottie
  const groupsArray = Object.values(GROUPS);
  const [randomIndex] = useState(
    Math.floor(Math.random() * groupsArray.length)
  );
  const lottieName = "favoriteDemo";

  const handleOpen = () => {
    if (animationContainer.current) {
      setIsFavorite(false);

      lottie.loadAnimation({
        container: animationContainer.current,
        animationData: groupsArray[randomIndex].bookmarkAnimationData, // ランダム
        loop: false,
        autoplay: false,
        name: lottieName,
      });
      lottie.setSpeed(1.8, lottieName);

      setTimeout(() => {
        setIsFavorite(true);
        lottie.play(lottieName);
      }, 300);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={"text-muted"}
      onOpened={handleOpen}
    >
      <ModalHeader toggle={toggle}>
        ログインして画像をお気に入り登録しましょう
      </ModalHeader>
      <ModalBody className="d-flex flex-column justify-content-center align-items-center">
        <div
          ref={animationContainer}
          className={`mb-4 ${
            isFavorite
              ? "lottie-favorite-shadow-lg lottie-favorite-image-view"
              : "lottie-favorite-image-view-deactive"
          }`}
          style={{ width: "40%", height: "40%" }}
        />
        <p>
          画像をお気に入り登録することで、推しメンの画像を
          <b>ヲタピック上で管理</b>することができます。
          ヲタピックでは、お持ちのTwitterアカウントで<b>簡単・安全</b>
          にログインすることができます。
        </p>
      </ModalBody>
      <ModalFooter>
        <RoundButton
          href="/accounts/login/"
          colorSet="twitter"
          className="mx-auto d-flex justify-content-center align-items-center"
          style={{ width: "60%" }}
        >
          <FontAwesomeIcon icon={faTwitter} /> ログイン
        </RoundButton>
      </ModalFooter>
    </Modal>
  );
};

export default SignUpBeforeFavoriteModal;
