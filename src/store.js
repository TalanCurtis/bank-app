import { createStore, applyMiddleware } from 'redux';
import reducer from './redux/users';
import promiseMiddleWare from 'redux-promise-middleware'

export default createStore(reducer, applyMiddleware(promiseMiddleWare()));