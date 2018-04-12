import {APIActions} from 'origami-zen';
import {Dispatch} from 'redux';
import API from 'lib/api';
import State, {Page} from 'store/state';
import {PAGES_TREE_SET, PAGE_DATA_SET, PAGE_PROPERTIES_SET} from './const';
import {APIResponse} from '../../../zen/_bundles/lib/lib/API/API';


export const {
    pagesCreate,
    pagesGet,
    pagesUpdate,
    pagesRemove
} = APIActions('pages', API);


export const pagesPropertiesGet = async (id: string) =>
    async (dispatch: Dispatch<State>) => {
        const {data: properties} = await API.get(`/pages/${id}/properties`);
        dispatch({type: PAGE_PROPERTIES_SET, id, properties});
    };


export const pagesDataUpdate = async(id: string, data: object) =>
    async (dispatch: Dispatch<State>) => {
        await API.put(`/pages/${id}/properties`, data);
        dispatch({type: PAGE_DATA_SET, id, data});
    };


export const pagesTreeGet = async(parent = '') =>
    async (dispatch: Dispatch<State>) => {
        const {data: pages} = await API.get(`/pages/tree/${parent}`);
        dispatch({type: PAGES_TREE_SET, parent, pages});
    };


export const pagesTreeMove = (pages: Page[], parent: string) =>
    () => {
        const execs: Promise<APIResponse>[] = [];
        pages.forEach(p => {
            execs.push(API.post(`/pages/${p.id}/move`, {parent}));
        });

        return Promise.all(execs);

        // Dispatch({type: PAGES_TREE_SET, parent, pages});
    };
