import {Element} from 'lib';
import HTML from './sidebar-search.html';
import CSS from './sidebar-search.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
// Import actions from 'actions';


class Sidebar extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();
    }

    static get boundProps() {
        return ['me'];
    }

    propertyChangedCallback() {
        this.render();
    }

    connectedCallback() {
        this.logo = this.shadowRoot.querySelector('img.logo');
        this.logo.src = logo;
        this.logoBottom = this.shadowRoot.querySelector('img.logo-text');
        this.logoBottom.src = logoText;
    }
}


class ConnectedSidebar extends connect(store, Sidebar) {
    _mapStateToProps(state) {
        return {
            me: state.Me
        };
    }
}

window.customElements.define('zen-sidebar', ConnectedSidebar);

