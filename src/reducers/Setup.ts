import {
    SETUP_USER_ERROR_SET,
    SETUP_LOADING_SET,
    SETUP_SET,
    SETUP_USER_SET
} from 'actions/const';
import {AnyAction} from 'redux';
import immutable, {ImmutableObject} from 'seamless-immutable';
import {Setup} from 'store/state';
export {ResourceState} from 'origami-zen';




const initialState = immutable<Setup>({
    setup: null,
    user: null,
    errors: {
        user: null
    },
    loading: {
        user: null
    }
});


export default (state: ImmutableObject<Setup> = initialState, action: AnyAction) => {
    switch (action.type) {
        case SETUP_USER_ERROR_SET:
            return state.setIn(['errors', 'user'], action.error);


        case SETUP_LOADING_SET:
            return state.setIn(['loading', 'user'], action.loading);


        case SETUP_SET:
            return state.set('setup', action.setup);


        case SETUP_USER_SET:
            return state.set('user', action.user);




        default:
            return state;
    }
};
