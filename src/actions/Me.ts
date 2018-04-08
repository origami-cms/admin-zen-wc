import {
    ME_SET
} from './const';
import {API} from 'lib/API';

export const getMe = dispatch =>
    async() => {
        const {data: me} = await API.get('/users/me');
        dispatch({type: ME_SET, me});
    };
