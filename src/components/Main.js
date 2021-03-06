import React, { Component } from "react";
import OwnUserData from "./OwnUserData";
import Conversations from "./Connections";
import CurrentConversation from "./CurrentConversation";
import firebase from "firebase/app";
import "firebase/firestore";

export default class Main extends Component {
  state = {
    currentConversation: "",
  };

  componentDidMount() {
    var getUsersByDisplayName = firebase
      .functions()
      .httpsCallable("getUsersByDisplayName");
    getUsersByDisplayName({ name: "Runner" }).then(function (result) {
      console.log("Result");
      console.log(result.data);
    });
    if (this.state.currentConversation === "") {
      firebase
        .firestore()
        .collection("connections")
        .where("accepted", "==", true)
        .where(`users.${firebase.auth().currentUser.uid}.exists`, "==", true)
        .limit(1)
        .get()
        .then((response) => {
          if (response.docs.length > 0) {
            return response.docs[0].id;
          } else {
            return null;
          }
        })
        .then((id) => {
          if (id) {
            this.setState({ currentConversation: id });
          } else {
            this.setState({ currentConversation: "!exists" });
          }
        });
    }
  }
  render() {
    return (
      <div className="container">
        <OwnUserData />
        <Conversations
          changeConversationId={(newId) => {
            if (this.state.currentConversation !== newId) {
              this.setState({ currentConversation: newId });
            }
          }}
        />
        <CurrentConversation conversationId={this.state.currentConversation} />
      </div>
    );
  }
}
