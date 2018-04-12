/// <reference types="seamless-immutable" />
import immutable from 'seamless-immutable';
import { AnyAction } from 'redux';
declare const _default: (state: immutable.ImmutableObject<{
    loggedIn: boolean;
    token: string | null;
    loading: {
        verifying: boolean;
        loggingIn: boolean;
    };
    errors: {
        loggingIn: null;
    };
}> | undefined, action: AnyAction) => immutable.ImmutableObject<{
    loggedIn: boolean;
    token: string | null;
    loading: {
        verifying: boolean;
        loggingIn: boolean;
    };
    errors: {
        loggingIn: null;
    };
}>;
export default _default;
