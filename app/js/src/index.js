import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import './styles/index.css'
import Root from './Root'
import * as serviceWorker from './serviceWorker'
import rootReducer from './datastore/rootReducer'
import logger from './middlewares/logger'
import readyStatePromise from './middlewares/readyStatePromise'
import thunk from 'redux-thunk'

const store = createStore(
  rootReducer,
  compose(applyMiddleware(
    thunk,
    readyStatePromise,
    logger
  ))
)

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root'),
  () => {
    setTimeout(() => {
      document.getElementById('preloader').remove()
      document.getElementById('preloader-style').remove()
    }, 300)
  }
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
