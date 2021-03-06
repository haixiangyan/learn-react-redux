import React, {ChangeEventHandler} from 'react';
import {connect, createStore, Provider} from "./redux";
import connectToUser from "./connectors/connectToUser";

const initState: AppState = {
  user: {
    name: 'Jack',
    age: 19
  },
  group: {
    name: '前端组'
  }
}

const reducer = (state=initState, {type, payload}: Action<Partial<User>>) => {
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
const store = createStore<AppState>(reducer, initState)

const User = connectToUser(({user}: {user: User}) => {
  console.log('User执行了' + Math.random());
  return <div>User: {user.name}</div>
})

const UserModify = connectToUser(({user, updateUser, dispatch}: {user: User; updateUser: Function, dispatch: Function}) => {
  console.log('UserModify' + Math.random());

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    updateUser({
      name: e.target.value
    })
  }

  const fetchUser = (dispatch: Function) => new Promise<void>(resolve => {
    setTimeout(() => {
      console.log('hi')
      dispatch({type: 'updateUser', payload: {name: 'fetch user'}})
      resolve()
    }, 1500)
  })

  const fetchUserPromise = () => new Promise<any>(resolve => {
    setTimeout(() => {
      console.log('hi')
      resolve({
        name: 'fetch user promise',
      })
    }, 1500)
  })

  const onClickFetchUser = async () => {
    dispatch(fetchUser)
  }

  const onClickFetchUserPromise = async () => {
    dispatch({ type: 'updateUser', payload: fetchUserPromise() })
  }

  return (
    <div>
      <label>
        用户名
        <input type="text" value={user.name} onChange={onChange}/>
      </label>
      <button onClick={onClickFetchUser}>Fetch User</button>
      <button onClick={onClickFetchUserPromise}>Fetch User Promise</button>
    </div>
  )
})

const FirstSon = () => {
  console.log('大儿子执行了' + Math.random());
  return <section>大儿子 <User/></section>
}
const SecondSon = () => {
  console.log('二儿子执行了' + Math.random());
  return<section>二儿子<UserModify/></section>
}
const ThirdSon = connect((state: AppState) => {
  return {group: state.group}
})(({group}: {group: Group}) => {
  console.log('三儿子执行了' + Math.random());
  return (
    <section>
      三儿子
      Group: {group.name}
    </section>
  )
})

const App = () => {
  return (
    <Provider store={store}>
      <FirstSon/>
      <SecondSon/>
      <ThirdSon/>
    </Provider>
  );
}

export default App;
