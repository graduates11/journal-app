import React from "react";
import { Button, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Store } from "./Store";
const { ipcRenderer } = window;

export default class AddFileModal extends React.Component {
  static contextType = Store;
  state = {
    fileName: ""
  };

  onFileNameChange = e => {
    this.setState({ fileName: e.target.value });
  };

  createFile = () => {
    this.props.toggleModal();
    this.props.onFinalSave();
    ipcRenderer.send("create-file", this.state.fileName);
  };

  render() {
    return (
      <Modal isOpen={this.props.isModalOpen} toggle={this.props.toggleModal}>
        <ModalBody className="modalHeaderCentered">
          <ModalHeader className="modalHeaderCentered">
            How would you like to name your journal?
          </ModalHeader>
          <Input
            maxLength="20"
            type="text"
            autoFocus
            placeholder="My journal..."
            onChange={this.onFileNameChange}
          ></Input>
          <Button
            onClick={this.props.toggleModal}
            color="white"
            className="button button--antiman button--round-l button--text-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={this.createFile}
            color="white"
            className="button button--antiman button--round-l button--text-medium"
          >
            Submit
          </Button>
        </ModalBody>
      </Modal>
    );
  }
}
