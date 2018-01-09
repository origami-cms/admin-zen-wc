import {singular} from 'pluralize';


import {
    APP_SIDEBAR_ITEMS_SET,
    APP_TABS_NEW,
    APP_TABS_CLOSE,
    APP_TABS_NAME,
    APP_TITLE_SET
} from './const';


export const getSidebarItems = dispatch =>
    () => {
        // TODO: Convert to endpoint
        dispatch({type: APP_SIDEBAR_ITEMS_SET, items: [
            {
                icon: 'page',
                color: 'red',
                to: '/pages'
            },
            {
                icon: 'dollar',
                color: 'green',
                to: '/app/engagement'
            },
            {
                icon: 'messages',
                color: 'orange',
                to: '/app/engagement'
            },
            {
                icon: 'user',
                color: 'blue',
                to: '/users'
            }
        ]});
    };


export const titleSet = dispatch =>
    title => dispatch({type: APP_TITLE_SET, title});


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
