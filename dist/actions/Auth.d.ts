import { Dispatch } from 'redux';
import State from 'store/state';
export declare const login: (email: string, password: string) => (dispatch: Dispatch<State>) => Promise<object | undefined>;
export declare const verify: () => (dispatch: Dispatch<State>) => Promise<string | false>;
export declare const logout: () => (dispatch: Dispatch<State>) => {
    type: string;
};
