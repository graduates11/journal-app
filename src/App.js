import React from "react";
import { Container, Row, Col } from "reactstrap";
import {
  EntriesByDate,
  MyCalendar,
  SearchBar,
  TextEditor,
  SearchResult,
  CurrentFileName
} from "../src/components";
import { Store } from "./components/Store";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { defaultTitle } from "./utils/helpers";
import AddFileModal from "./components/AddFileModal";

const { ipcRenderer } = window;
const shortid = require("shortid");

const styles = {
  fullHeight: {
    height: "100vh"
  }
};

export default class App extends React.Component {
  static contextType = Store;

  state = {
    isModalOpen: false
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  createFile = () => {};

  onFinalSave = () => {
    const { state } = this.context;
    const entries = [...state.allEntries];
    const { currentFile } = state;
    const data = {
      entries,
      file: currentFile
    };
    ipcRenderer.send("final-save", JSON.stringify(data));
  };

  handleGetAllEntries = (event, data) => {
    const { state, dispatch } = this.context;
    const { entries, files, currentFile } = JSON.parse(data);
    const { date, entry } = state;
    dispatch({
      type: "GET_ALL_ENTRIES",
      payload: {
        date,
        entry,
        allEntries: entries.length > 0 ? entries : [],
        allFiles: files ? files : [],
        currentFile: currentFile
      }
    });
  };

  handleGetAllEntriesError = (event, arg) => {
    // handle error?
    return arg;
  };
  handleMenuSaveFile = (event, arg) => {
    this.onFinalSave();
  };

  handleFinalSaveReply = (event, arg) => {
    // handle success?
    return arg;
  };

  handleFinalSaveError = (event, arg) => {
    // handle error?
    return arg;
  };

  handleChangeFile = (event, file) => {
    this.onFinalSave();
    ipcRenderer.send("get-all-entries", file);
  };

  handleMenuCreateFile = (event, arg) => {
    this.toggleModal();
  };

  handleCreateFileReply = (event, fileName) => {
    const { dispatch, state } = this.context;
    dispatch({
      type: "CREATE_FILE",
      payload: {
        currentFile: fileName,
        allFiles: [...state.allFiles].concat(this.state.fileName)
      }
    });
  };

  componentDidMount() {
    ipcRenderer.on("get-all-entries-reply", this.handleGetAllEntries);
    ipcRenderer.on("menu-save-file", this.handleMenuSaveFile);
    ipcRenderer.on("final-save-reply", this.handleFinalSaveReply);
    ipcRenderer.on("get-all-entries-error", this.handleGetAllEntriesError);
    ipcRenderer.on("menu-create-file", this.handleMenuCreateFile);
    ipcRenderer.on("change-file", this.handleChangeFile);
    ipcRenderer.on("create-file-reply", this.handleCreateFileReply);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(
      "get-all-entries-reply",
      this.handleGetAllEntries
    );
    ipcRenderer.removeListener(
      "get-all-entries-error",
      this.handleGetAllEntriesError
    );
    ipcRenderer.removeListener("menu-save-file", this.handleMenuSaveFile);
    ipcRenderer.removeListener("final-save-reply", this.handleFinalSaveReply);
    ipcRenderer.removeListener("change-file", this.handleChangeFile);
    ipcRenderer.removeListener("menu-create-file", this.handleMenuCreateFile);
    ipcRenderer.removeListener("create-file-reply", this.handleCreateFileReply);
  }

  addEntry = () => {
    const { dispatch } = this.context;
    const content = EditorState.createWithContent(
      ContentState.createFromText("Your text...")
    );
    dispatch({
      type: "ADD_NEW_ENTRY",
      payload: {
        entry: {
          id: shortid.generate(),
          title: defaultTitle(),
          text: "",
          date: new Date().toDateString(),
          editorState: convertToRaw(content.getCurrentContent())
        }
      }
    });
  };
  render() {
    const { state } = this.context;
    return (
      <div className="App mt-3 mb-3">
        <CurrentFileName />
        <Container style={styles.fullHeight}>
          <Row style={styles.fullHeight}>
            <Col xs={4} className="border border-muted">
              <SearchBar />
              {state.searchBoolean === true ? <SearchResult /> : null}
              <MyCalendar />
              {state.searchBoolean === true ? null : (
                <EntriesByDate addEntry={this.addEntry} />
              )}
            </Col>
            <Col xs={8} className="border border-muted">
              {state.entry !== null ? (
                <TextEditor />
              ) : (
                <Container
                  className="mt-2 w-100 add-entry"
                  onClick={this.addEntry}
                >
                  <p>+ Add entry</p>
                </Container>
              )}
            </Col>
          </Row>
          <AddFileModal
            isModalOpen={this.state.isModalOpen}
            toggleModal={this.toggleModal}
            onFinalSave={this.onFinalSave}
          />
        </Container>
      </div>
    );
  }
}
