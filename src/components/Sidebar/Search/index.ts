import {Element} from 'lib';
import HTML from './sidebar-search.html';
import CSS from './sidebar-search.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';


class SidebarSearch extends Element {
    constructor() {
        super(HTML, CSS.toString());
    }
}


class ConnectedSidebarSearch extends connect(store, SidebarSearch) {
    _mapStateToProps(state) {
        return {
            me: state.Me
        };
    }
}

window.customElements.define('zen-sidebar', ConnectedSidebarSearch);

