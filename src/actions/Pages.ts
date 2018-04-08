import {
    PAGE_PROPERTIES_SET,
    PAGE_DATA_SET,
    PAGES_TREE_SET
} from './const';
import API from '~/lib/api';
import resource from 'lib/Resource/actions';


export const {
    pagesCreate,
    pagesGet,
    pagesUpdate,
    pagesRemove
} = resource('pages');


export const pagesPropertiesGet = dispatch =>
    async id => {
        const {data: properties} = await API.get(`/pages/${id}/properties`);
        dispatch({type: PAGE_PROPERTIES_SET, id, properties});
    };


export const pagesDataUpdate = dispatch =>
    async(id, data) => {
        await API.put(`/pages/${id}/properties`, data);
        dispatch({type: PAGE_DATA_SET, id, data});
    };


export const pagesTreeGet = dispatch =>
    async(parent = '') => {
        const {data: pages} = await API.get(`/pages/tree/${parent}`);
        dispatch({type: PAGES_TREE_SET, parent, pages});
    };


export const pagesTreeMove = () =>
    (pages, parent) => {
        const execs = [];
        pages.forEach(p => {
            execs.push(API.post(`/pages/${p.id}/move`, {parent}));
        });

        return Promise.all(execs);

        // Dispatch({type: PAGES_TREE_SET, parent, pages});
    };
