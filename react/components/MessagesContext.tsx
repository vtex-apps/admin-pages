import React from 'react'

export interface IMessagesContext {
  setMessages: (newMessages?: object) => void
}

// tslint:disable-next-line:no-empty
const MessagesContext: React.Context<IMessagesContext> = React.createContext({setMessages: () => {}})

export default MessagesContext
