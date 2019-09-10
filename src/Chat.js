import Moment from 'react-moment';
import React, { useState, useEffect } from 'react';
import { withChatkitOneToOne } from '@pusher/chatkit-client-react';
import './Chat.css';
import defaultAvatar from './default-avatar.png';

let interval = null;

function Chat(props) {
  const [pendingMessage, setPendingMessage] = useState('');
  const messageList = React.createRef();

  const handleMessageKeyDown = event => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMessageChange = event => {
    props.chatkit.sendTypingEvent();
    setPendingMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (pendingMessage === '') {
      return;
    }
    props.chatkit.sendSimpleMessage({ text: pendingMessage });
    setPendingMessage('');
  };

  useEffect(() => {
    messageList.current.scrollTop = messageList.current.scrollHeight;
  });

  if (!props.chatkit.isLoading && interval === null) {
    interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        props.chatkit.setReadCursor();
      }
    }, 1000);
  }

  if (props.chatkit.otherUser) {
    console.log(props.chatkit.otherUser.presence);
  }
  let otherUserStatus = 'Loading...';
  if (props.chatkit.otherUser && props.chatkit.otherUser.isTyping) {
    otherUserStatus = 'Typing...';
  } else if (
    props.chatkit.otherUser &&
    props.chatkit.otherUser.presence.state === 'online'
  ) {
    otherUserStatus = 'Online';
  } else if (
    props.chatkit.otherUser &&
    props.chatkit.otherUser.presence.state === 'offline'
  ) {
    otherUserStatus = 'Offline';
  }

  let messages = [];
  if (!props.chatkit.isLoading) {
    let seenCursorPosition = null;
    for (let i = props.chatkit.messages.length - 1; i >= 0; i--) {
      const m = props.chatkit.messages[i];
      const isFromCurrentUser = m.sender.id === props.chatkit.currentUser.id;
      const isRead = m.id <= props.chatkit.otherUser.lastReadMessageId;
      if (isFromCurrentUser && isRead) {
        seenCursorPosition = m.id;
        break;
      }
    }

    messages = props.chatkit.messages.map(m => ({
      id: m.id,
      isOwnMessage: m.sender.id === props.chatkit.currentUser.id,
      createdAt: m.createdAt,
      textContent: m.parts[0].payload.content,
      isLatestMessage: m.id === seenCursorPosition,
    }));
  }

  return (
    <div className="Chat">
      <div className="Chat__titlebar">
        <img
          src={defaultAvatar}
          className="Chat__titlebar__avatar"
          alt="avatar"
        />
        <div className="Chat__titlebar__details">
          <span>
            {props.chatkit.isLoading
              ? 'Loading...'
              : props.chatkit.otherUser.name}
          </span>
          <span className="Chat__titlebar__details__presence">
            {otherUserStatus}
          </span>
        </div>
      </div>
      <div className="Chat__messages" ref={messageList}>
        {messages.map(m => (
          <Message key={m.id} {...m} />
        ))}
      </div>
      <div className="Chat__compose">
        <input
          className="Chat__compose__input"
          type="text"
          placeholder="Type a message..."
          value={pendingMessage}
          onChange={handleMessageChange}
          onKeyDown={handleMessageKeyDown}
        />
        <button className="Chat__compose__button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

function Message({ isOwnMessage, isLatestMessage, createdAt, textContent }) {
  return (
    <div
      className={
        isOwnMessage
          ? 'Chat__messages__message__wrapper Chat__messages__message__wrapper--self'
          : 'Chat__messages__message__wrapper Chat__messages__message__wrapper--other'
      }
    >
      <div className="Chat__messages__message__wrapper__inner">
        <div
          className={
            isOwnMessage
              ? 'Chat__messages__message Chat__messages__message--self'
              : 'Chat__messages__message Chat__messages__message--other'
          }
        >
          <div className="Chat__messages__message__content">{textContent}</div>
          <div className="Chat__messages__message__time">
            <Moment
              calendar={{
                sameDay: 'LT',
                lastDay: '[Yesterday at] LT',
                lastWeek: '[last] dddd [at] LT',
              }}
            >
              {createdAt}
            </Moment>
          </div>
          <div
            className={
              isOwnMessage
                ? 'Chat__messages__message__arrow alt'
                : 'Chat__messages__message__arrow'
            }
          />
        </div>
        <div className="Chat__messages__message__seen">
          {isLatestMessage ? 'seen' : '\u00A0'}
        </div>
      </div>
    </div>
  );
}

export default withChatkitOneToOne(Chat);
