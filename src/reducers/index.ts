import {combineReducers, AnyAction} from 'redux';
export {AnyAction} from 'redux';


import {APIReducer} from 'origami-zen';


import Auth from './Auth';
import App from './App';
import Me from './Me';
import Setup from './Setup';
// import Pages from './Pages';


export default combineReducers({
    Auth,
    App,
    Me,
    Setup,
    // Pages,
    Users: APIReducer('users'),
    Templates: APIReducer('templates', null, 'name')
});
