import { Dispatch } from 'redux';
import State from 'store/state';
export declare const isSetup: () => (dispatch: Dispatch<State>) => Promise<void>;
export declare const setupUser: (user: object) => (dispatch: Dispatch<State>) => Promise<void>;
