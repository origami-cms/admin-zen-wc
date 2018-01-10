import immutable from 'seamless-immutable';
import {
    ME_SET,
    ME_EMAIL_SET
} from 'actions/const';

import {LS_EMAIL} from 'const';

const initialState = immutable({
    fname: null,
    lname: null,
    email: localStorage.getItem(LS_EMAIL)
    // email: null
});


export default (state = initialState, action) => {
    switch (action.type) {
        case ME_SET:
            return state.merge(action.me);


        case ME_EMAIL_SET:
            localStorage.setItem(LS_EMAIL, action.email);

            return state.set('email', action.email);

        default:
            return state;
    }
};
