import React from 'react'
import {createContext, useContext, useEffect, useState} from "react";

export const store: Store<{user: User}> = {
  state: {
    user: {name: 'Jack', age: 18}
  },
  setState(newState: any) {
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn: Function) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}

export const AppContext = createContext<ContextValue>(store)

export const reducer = (state: AppState, {type, payload}: Action<Partial<User>>) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      }
    }
  } else {
    return state
  }
}

export const connect = (Component: any) => {
  return (props: any) => {
    const {state, setState} = useContext(AppContext)

    const [, update] = useState({})

    useEffect(() => {
      store.subscribe(() => {
        update({})
      })
    }, [])

    const dispatch = (action: Action) => {
      setState(reducer(state, action))
    }

    return <Component {...props} dispatch={dispatch} state={state}/>
  }
}
