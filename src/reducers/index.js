import {combineReducers} from 'redux';


import resource from 'lib/Resource/reducer';


import Auth from './Auth';
import App from './App';
import Me from './Me';
import Pages from './Pages';


export default combineReducers({
    Auth,
    App,
    Me,
    Pages,
    Users: resource('users'),
    Templates: resource('templates', null, 'name')
});
