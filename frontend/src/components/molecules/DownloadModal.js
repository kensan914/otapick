import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import OtapickButton from '../atoms/OtapickButton';


class DownloadModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    }
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className} centered={true} >
        <ModalHeader toggle={this.toggleModal}>保存完了</ModalHeader>
        <ModalBody>
          <p>ダウンロードダイアログにしたがって、画像を保存してください。</p>
        </ModalBody>
        <ModalFooter>
          <div class="mx-auto" style={{width: 180}}>
            <OtapickButton group={this.props.group} onClick={() =>history.back()} width={180} title={"戻る"} />
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default DownloadModal;