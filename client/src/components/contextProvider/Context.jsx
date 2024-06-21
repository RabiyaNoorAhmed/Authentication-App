import React, {createContext, useState } from 'react'

// Create a new context called LoginContext
export const LoginContext = createContext("")

// This is a component that will provide the context to its children
const Context = ({children}) => {

// Create a state variable 'loginData' and a function 'setLoginData' to update it
const [loginData,setLoginData] = useState("")

// Wrap the children components with the LoginContext provider
// Pass 'loginData' and 'setLoginData' to the provider's value
  return (
    <>
      <LoginContext.Provider value={{loginData,setLoginData}}>
        {children}
      </LoginContext.Provider>
    </>
  )
}

export default Context
