import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import RoundButton from "~/components/atoms/RoundButton";
import { useDomDispatch } from "~/contexts/DomContext";

const ImageDownloadedModal = (props) => {
  const { isOpen, toggle } = props;

  const domDispatch = useDomDispatch();
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className={"text-muted"}>
      <ModalHeader toggle={toggle}>保存完了</ModalHeader>
      <ModalBody>
        <p>ダウンロードダイアログにしたがって、画像を保存してください。</p>
      </ModalBody>
      <ModalFooter>
        <RoundButton
          onClick={() => {
            domDispatch({ type: "DISABLE_GLOBAL_MODAL" });
            history.back();
          }}
          colorSet="gray"
          className="mx-auto"
        >
          戻る
        </RoundButton>
      </ModalFooter>
    </Modal>
  );
};

export default ImageDownloadedModal;
