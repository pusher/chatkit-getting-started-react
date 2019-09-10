import Chatkit from '@pusher/chatkit-client';
import React from 'react';
import { ChatkitProvider } from '@pusher/chatkit-client-react';

import './App.css';
import Chat from './Chat';
import UseBaseComponent from './UseBaseComponent';
import UserList from './UserList';
import chatkitLogo from './chatkit-logo.svg';
import instanceConfig from './instance-config';

const tokenProvider = new Chatkit.TokenProvider({
  url: instanceConfig.tokenProviderUrl,
});

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  let isUser2 = false;
  if (urlParams.has('isUser2')) {
    isUser2 = true;
  }

  let userId = null;
  let otherUserId = null;
  if (isUser2) {
    userId = instanceConfig.userId2;
    otherUserId = instanceConfig.userId1;
  } else {
    userId = instanceConfig.userId1;
    otherUserId = instanceConfig.userId2;
  }

  return (
    <div className="App">
      <ChatkitProvider
        instanceLocator={instanceConfig.instanceLocator}
        tokenProvider={tokenProvider}
        userId={userId}
      >
        <div className="App__chatwindow">
          <UserList />
          <Chat otherUserId={otherUserId} />
        </div>
        <div className="App__backdrop">
          <img
            className="App__backdrop__logo"
            src={chatkitLogo}
            alt="Chatkit logo"
          />
        </div>
      </ChatkitProvider>
    </div>
  );
}

export default App;
