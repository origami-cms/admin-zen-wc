import {ME_EMAIL_SET, ME_SET} from 'actions/const';
import {LS_EMAIL} from 'const';
import {AnyAction} from 'redux';
import immutable, {ImmutableObject} from 'seamless-immutable';
import {Me} from 'store/state';
export {ResourceState} from 'origami-zen';




const initialState = immutable({
    id: null,
    fname: null,
    lname: null,
    email: localStorage.getItem(LS_EMAIL)
    // email: null
});


export default (state: ImmutableObject<Me> = initialState, action: AnyAction) => {
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
