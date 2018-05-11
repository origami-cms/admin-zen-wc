import immutable from 'seamless-immutable';
import {AnyAction} from 'redux';

import {
    AUTH_LOADING_SET_VERIFYING,
    AUTH_LOADING_SET_LOGGINGIN,

    AUTH_CLEAR,

    AUTH_VERIFIED,
    AUTH_VERIFIED_FAILED,

    AUTH_LOGIN,
    AUTH_LOGIN_FAILED,

    AUTH_LOGOUT
} from 'actions/const';

import {
    LS_JWT,
    LS_EMAIL
} from 'const';
import api from '~/lib/API';
import {Auth} from '~/store/state';


const intitialState = immutable<Auth>({
    verified: null,
    loggedIn: false,
    token: localStorage.getItem(LS_JWT),
    loading: {
        verifying: false,
        loggingIn: false
    },
    errors: {
        loggingIn: null,
        verify: null
    }
});

export default (state = intitialState, action: AnyAction) => {
    switch (action.type) {
        case AUTH_LOADING_SET_VERIFYING:
            return state.setIn(['loading', 'verifying'], action.loading);
        case AUTH_LOADING_SET_LOGGINGIN:
            return state.setIn(['loading', 'loggingIn'], action.loading);


        case AUTH_LOGOUT:
        case AUTH_CLEAR:
            localStorage.removeItem(LS_JWT);

            return state.merge({
                loggedIn: false,
                token: null
            });


        case AUTH_VERIFIED:
        case AUTH_LOGIN:
            const merging = {
                loggedIn: true,
                errors: {
                    loggingIn: null
                },
                token: null,
                verified: true
            };

            if (action.token) {
                localStorage.setItem(LS_JWT, `Bearer ${action.token}`);
                merging.token = action.token;
            }
            if (action.email) localStorage.setItem(LS_EMAIL, action.email);

            return state.merge(merging);


        case AUTH_LOGIN_FAILED:
            return state.setIn(['errors', 'loggingIn'], action.message);


        case AUTH_VERIFIED_FAILED:
            let {message} = action;

            if (action.message.includes('Supplied JWT has expired')) {
                message = 'You were logged out due to inactivity';
            }

            const mergingVerifiedFailed = {
                errors: {
                    verify: message
                },
                verified: true
            };

            return state.merge(mergingVerifiedFailed);


        default:
            return state;
    }
};
