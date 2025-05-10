import React, { useEffect, useReducer } from 'react'
import { createContext } from 'react'
//loginreducer function banaya tha humny in reducer file, wahan pe export kiya tha yaahn pe import krwa rhy for using that
import { loginreducer } from './reducer'
import Cookies from 'js-cookie'

export const logincontext=createContext("initial value")   

//yeh ek object ha.
let data = {
  person: Cookies.get('authToken') || undefined
};
 
export default function LoginContextProvider({children}) {
//const [state, setstate/dispatch] = userReducer(function containing all cases, initial data)
    const [state,dispatch]=useReducer(loginreducer, data)

    useEffect(() => {
      Cookies.set('authToken', state.person)
  }, [state.person])



  return (
    <logincontext.Provider value={{state,dispatch}}>
        {children}
    </logincontext.Provider>
  )
}