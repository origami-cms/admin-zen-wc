import {Dispatch} from 'redux';
import API from 'lib/API';
import CODES from 'http-status-codes';


import {
    // AUTH_LOADING_SET_VERIFYING,
    AUTH_LOADING_SET_LOGGINGIN,
    AUTH_CLEAR,
    AUTH_VERIFIED,
    AUTH_VERIFIED_FAILED,
    AUTH_LOGIN,
    AUTH_LOGIN_FAILED,
    AUTH_LOGOUT,

    ME_EMAIL_SET
} from 'actions/const';
import State from 'store/state';


export const login = (email: string, password: string) =>
    async (dispatch: Dispatch<State>) => {
        dispatch({type: ME_EMAIL_SET, email});
        dispatch({type: AUTH_LOADING_SET_LOGGINGIN, loading: true});
        try {
            const {data} = await API.post('/auth/login', {
                email, password
            });
            dispatch({type: AUTH_LOGIN, ...data});
            dispatch({type: AUTH_LOADING_SET_LOGGINGIN, loading: false});

            return data;
        } catch (e) {
            dispatch({type: AUTH_LOADING_SET_LOGGINGIN, loading: false});

            return dispatch({type: AUTH_LOGIN_FAILED, message: e.message});
        }


    };

export const verify = () =>
    async (dispatch: Dispatch<State>) => {
        try {
            const {data} = await API.get('/auth/verify');

            dispatch({type: AUTH_VERIFIED});

            return (data as {token: string}).token;

        } catch (e) {
            if (e.code === CODES.UNAUTHORIZED || e.code === CODES.BAD_REQUEST) {
                dispatch({type: AUTH_VERIFIED_FAILED, message: e.message});
                dispatch({type: AUTH_CLEAR});
            }

            return false;
        }
    };


export const logout = () =>
    (dispatch: Dispatch<State>) => dispatch({type: AUTH_LOGOUT});
