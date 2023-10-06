import React from "react";
import { MessagesContainer, MessageBox, MessageText, SentBy } from "./styles";

function Message(props) {
  const {
    username,
    message: { user, message, createdAt },
  } = props;
  let sentByCurrentUser = false;

  const usersName = username.username;

  if (user === username || user === usersName) {
    sentByCurrentUser = true;
  }

  const background = sentByCurrentUser ? "blue" : "dark";
  const textPosition = sentByCurrentUser ? "end" : "start";
  const textColor = sentByCurrentUser ? "white" : "dark";
  const sentBy = sentByCurrentUser ? "left" : "right";

  let formatted = '';

  if (createdAt) {
    const time = new Date(createdAt);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    formatted = new Intl.DateTimeFormat('en-US', options).format(time);
  }

  return (
    <MessagesContainer textPosition={textPosition}>
      <MessageBox background={background}>
        <MessageText color={textColor}>{message}</MessageText>
      </MessageBox>
      <SentBy sentBy={sentBy}>{user}</SentBy>
      <SentBy sentBy={sentBy}>• {formatted}</SentBy>
    </MessagesContainer>
  );
}

export default Message;