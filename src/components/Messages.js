import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Message from "./Message";

class Messages extends React.Component {
  db = firebase.firestore();

  state = {
    messages: [],
    isLoading: true,
  };

  newConversationData = (querySnapshot) => {
    var messages = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      data.id = doc.id;
      messages.push(data);
    });
    messages.reverse()
    this.setState({ messages: messages, isLoading: false });
  };

  componentDidMount() {
    this.db
      .collection("connections")
      .doc(this.props.conversationId)
      .collection("messages")
      .orderBy("sentAt", "desc")
      .limit(20)
      .onSnapshot(this.newConversationData);
  }

  render() {
    if (this.props.conversationId) {
      return this.state.isLoading ? (
        "Loading"
      ) : (
        <ul>
          {this.state.messages.map((message) => {
            return (
              <Message
                key={message.id}
                isOwner={firebase.auth().currentUser.uid === message.owner}
                text={message.text}
              />
            );
          })}
        </ul>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Messages;
