import _ from 'lodash';

import {
    PAGE_PROPERTIES_SET,
    PAGE_DATA_SET,
    PAGES_TREE_SET
} from 'actions/const';

import resource from 'lib/Resource/reducer';

// Find a page deeply nesteds in the tree store with an id
const findDeepById = (tree, id) => tree.find(page => {
    if (!tree) return false;

    const exists = _.find(tree, {id});
    if (exists) return exists;
    else if (page.children) return findDeepById(page.children, id);
    else {
        return false;
    }
});

export default resource('pages', (state, action) => {
    let pageIndex;
    if (action.id) {
        pageIndex = state.pages.findIndex(page => {
            if (page.id == action.id) return page;
        });
    }

    switch (action.type) {
        case PAGE_PROPERTIES_SET:
            return state.setIn(
                ['pages', pageIndex, 'properties'],
                action.properties
            );

        case PAGE_DATA_SET:
            return state.setIn(
                ['pages', pageIndex, 'data'],
                action.data
            );

        case PAGES_TREE_SET:
            let pageTree = !state.pageTree ? [] : state.pageTree.asMutable(
                {deep: true}
            );
            const adding = action.page ? [action.page] : action.pages;
            // If there is a parent, find it in the tree, and add it as a child
            if (action.parent) {
                const parent = findDeepById(pageTree, action.parent);
                // If there are no children, create an empty array for it
                if (!parent.children) parent.children = [];
                parent.children = parent.children.concat(adding);
            // Otherwise add it to the root
            } else pageTree = adding;

            return state.set('pageTree', pageTree);

        default:
            return state;
    }
});
