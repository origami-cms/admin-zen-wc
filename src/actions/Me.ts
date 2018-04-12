import API from 'lib/API';
import {Dispatch} from 'redux';
import {ME_SET} from './const';
import State from 'store/state';


export const getMe = () =>
    async (dispatch: Dispatch<State>) => {
        const {data: me} = await API.get('/users/me');
        dispatch({type: ME_SET, me});
    };
