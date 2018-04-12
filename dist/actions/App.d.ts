import { Dispatch } from 'redux';
import State from 'store/state';
export declare const getSidebarItems: () => (dispatch: Dispatch<State>) => void;
export declare const titleSet: (title: string) => (dispatch: Dispatch<State>) => {
    type: string;
    title: string;
};
export declare const tabsClose: (url: string) => (dispatch: Dispatch<State>) => {
    type: string;
    url: string;
};
export declare const tabsName: (url: string, name: string) => (dispatch: Dispatch<State>) => {
    type: string;
    url: string;
    name: string;
};
