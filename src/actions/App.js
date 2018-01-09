import {singular} from 'pluralize';


import {
    APP_JEWEL_ITEMS_SET,
    APP_TABS_NEW,
    APP_TABS_CLOSE,
    APP_TABS_NAME
} from './const';


export const getJewelItems = () =>
    dispatch => {
        // TODO: Convert to endpoint
        dispatch({type: APP_JEWEL_ITEMS_SET, items: [
            {
                name: 'Pages',
                url: '/pages',
                icon: 'page'
            },
            {
                name: 'Users',
                url: '/users',
                icon: 'user'
            },
            {
                name: 'Settings',
                url: '/settings',
                icon: 'settings'
            }
        ]});
    };


export const tabsNew = url =>
    dispatch => {
        let type;
        try {
            [, type] = (/^\/([\w\d]+)/).exec(url);
            if (type) type = singular(type);
        } catch (e) {
            throw new Error('Invalid url format. Should be `/pageType/xyz/etc`');
        }
        const tab = {type, url};
        dispatch({type: APP_TABS_NEW, tab});
    };

export const tabsClose = url =>
    dispatch => dispatch({type: APP_TABS_CLOSE, url});

export const tabsName = (url, name) =>
    dispatch => dispatch({type: APP_TABS_NAME, url, name});
