import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import MainReducer from 'reducers';

export default createStore(
    MainReducer,
    applyMiddleware(
        thunkMiddleware
    )
);
