import React from 'react'

export interface IMessagesContext {
  setMessages: (newMessages?: object) => void
}

const MessagesContext: React.Context<IMessagesContext> = React.createContext({
  setMessages: () => {},
})

export default MessagesContext
