import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { useDomDispatch } from "../../contexts/DomContext";

const ImageDownloadedModal = (props) => {
  const { isOpen, toggle } = props;

  const domDispatch = useDomDispatch();
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered={true}>
      <ModalHeader toggle={toggle}>保存完了</ModalHeader>
      <ModalBody>
        <p>ダウンロードダイアログにしたがって、画像を保存してください。</p>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            domDispatch({ type: "DISABLE_GLOBAL_MODAL" });
            history.back();
          }}
          className="rounded-pill mx-auto px-4"
          style={{ backgroundColor: "black" }}
        >
          <b>戻る</b>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ImageDownloadedModal;
