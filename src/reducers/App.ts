import immutable from 'seamless-immutable';


import {
    APP_SIDEBAR_ITEMS_SET,
    APP_TABS_NEW,
    APP_TABS_CLOSE,
    APP_TABS_NAME,
    APP_TITLE_SET
} from 'actions/const';

import {TITLE_PREFIX} from 'const';


const initialState = immutable({
    sidebar: {
        items: []
    },
    page: {
        title: ''
    },
    tabs: []
});


export default (state = initialState, action) => {
    switch (action.type) {
        case APP_SIDEBAR_ITEMS_SET:
            return state.setIn(['sidebar', 'items'], action.items);


        case APP_TABS_NEW:
            const existing = state.tabs.find(t => t.url === action.tab.url);
            if (existing) return state;

            return state.set('tabs',
                state.tabs.concat([action.tab])
            );


        case APP_TABS_CLOSE:
            return state.set('tabs', state.tabs.filter(t => t.url != action.url));


        case APP_TABS_NAME:
            const index = state.tabs.findIndex(t => t.url === action.url);
            if (index < 0) return state;

            return state.setIn(['tabs', index, 'name'], action.name);

        case APP_TITLE_SET:
            document.title = TITLE_PREFIX + action.title;

            return state.setIn(['page', 'title'], action.title);


        default:
            return state;
    }
};