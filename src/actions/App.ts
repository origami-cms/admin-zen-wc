// import {singular} from 'pluralize';
import {Dispatch} from 'redux';


import {
    APP_SIDEBAR_ITEMS_SET,
    APP_TABS_NEW,
    APP_TABS_CLOSE,
    APP_TABS_NAME,
    APP_TITLE_SET
} from './const';
import State from 'store/state';


export const getSidebarItems = () =>
    (dispatch: Dispatch<State>) => {
        // TODO: Convert to endpoint
        dispatch({type: APP_SIDEBAR_ITEMS_SET, items: [
            {
                icon: 'home',
                color: 'red',
                path: '/brokers',
                name: 'Brokers'
            },
            {
                icon: 'page',
                color: 'red',
                path: '/pages',
                name: 'Pages'
            },
            {
                icon: 'dollar',
                color: 'green',
                path: '/app/sales',
                name: 'Sales'
            },
            {
                icon: 'messages',
                color: 'orange',
                path: '/app/engagement',
                name: 'Engagement'
            },
            {
                icon: 'user',
                color: 'blue',
                path: '/users',
                name: 'Users'
            },
            {
                icon: 'image',
                color: 'gold',
                path: '/images',
                name: 'Images'
            },
            {
                icon: 'settings',
                color: 'white',
                path: '/settings',
                name: 'Settings',
                iconColor: 'grey-500'
            }
        ]});
    };


export const titleSet = (title: string) =>
    (dispatch: Dispatch<State>) => dispatch({type: APP_TITLE_SET, title});


// export const tabsNew = (url: string) =>
//     (dispatch: Dispatch<State>) => {
//         let type;
//         try {
//             [, type] = (/^\/([\w\d]+)/).exec(url);
//             if (type) type = singular(type);
//         } catch (e) {
//             throw new Error('Invalid url format. Should be `/pageType/xyz/etc`');
//         }
//         const tab = {type, url};
//         dispatch({type: APP_TABS_NEW, tab});
//     };

export const tabsClose = (url: string) =>
    (dispatch: Dispatch<State>) => dispatch({type: APP_TABS_CLOSE, url});

export const tabsName = (url: string, name: string) =>
    (dispatch: Dispatch<State>) => dispatch({type: APP_TABS_NAME, url, name});
