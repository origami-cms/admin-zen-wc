import { Dispatch } from 'redux';
import State, { Page } from 'store/state';
import { APIResponse } from '../../../zen/_bundles/lib/lib/API/API';
export declare const pagesCreate: Function, pagesGet: Function, pagesUpdate: Function, pagesRemove: Function;
export declare const pagesPropertiesGet: (id: string) => Promise<(dispatch: Dispatch<State>) => Promise<void>>;
export declare const pagesDataUpdate: (id: string, data: object) => Promise<(dispatch: Dispatch<State>) => Promise<void>>;
export declare const pagesTreeGet: (parent?: string) => Promise<(dispatch: Dispatch<State>) => Promise<void>>;
export declare const pagesTreeMove: (pages: Page[], parent: string) => () => Promise<APIResponse[]>;
