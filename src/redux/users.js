import axios from 'axios';

// Initial State
const intialState = {
    user:{}
}

// Action
const GET_USER = 'GET_USER';

// Action Creator
export function getUser(){
    const user = axios.get('/auth/me').then(res => {
        return res.data
    })
    return{
        type: GET_USER,
        payload: user
    }
}

// Reducer
export default function reducer(state = intialState, action){
    switch(action.type){
        case GET_USER +'_FULFILLED': 
            return Object.assign({}, state, {user:action.payload})
        /*
        if slow you could add a loading screen
        case GET_USER +'_PENDING': 
            return Object.assign({}, state, {user:action.payload})
        */
        default: 
            return state;
    }
}