import React from 'react'

export interface MessagesContextProps {
  setMessages: (newMessages?: object) => void
}

const MessagesContext: React.Context<
  MessagesContextProps
> = React.createContext({
  setMessages: () => {},
})

export default MessagesContext
