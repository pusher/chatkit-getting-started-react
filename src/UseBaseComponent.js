import Chatkit from '@pusher/chatkit-client';
import { ChatkitProvider, withChatkit } from '@pusher/chatkit-client-react';
import React from 'react';

import instanceConfig from './instance-config';

const tokenProvider = new Chatkit.TokenProvider({
  url: instanceConfig.tokenProviderUrl,
});

export const UseBaseComponent = props => {
  const SubComponent = withChatkit(props => {
    console.log(props.chatkit); // SDK injected here
    return null;
  });

  return (
    <ChatkitProvider
      instanceLocator={instanceConfig.instanceLocator}
      tokenProvider={tokenProvider}
      userId={instanceConfig.userId}
    >
      <SubComponent />
    </ChatkitProvider>
  );
};

export default UseBaseComponent;
