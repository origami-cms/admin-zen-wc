import {Dispatch} from 'redux';
import API from 'lib/API';
import State, {Page} from 'store/state';
import {SETUP_USER_ERROR_SET, SETUP_LOADING_SET, SETUP_SET} from './const';


export const isSetup = () =>
    async (dispatch: Dispatch<State>) => {
        const {data} = await API.get(`/setup`);
        dispatch({type: SETUP_SET, setup: (data as {setup: boolean}).setup});
    };

export const setupUser = (user: object) =>
    async (dispatch: Dispatch<State>) => {
        dispatch({type: SETUP_LOADING_SET, loading: true});

        try {
            const {data} = await API.post(`/setup/user`, user);
            console.log(data);
        } catch (e) {
            dispatch({type: SETUP_USER_ERROR_SET, error: e.message});
        }


        dispatch({type: SETUP_LOADING_SET, loading: false});
        // dispatch({type: PAGE_PROPERTIES_SET, id, properties});
    };
