import {Element} from 'lib';
import HTML from './pages.html';
import CSS from './pages.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class Pages extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();
    }

    connectedCallback() {
        this.trigger('pages-get');
    }

    static get boundProps() {
        return ['pages'];
    }

    // connectedCallback() {
    //     if (this.auth.token && !this.auth.loggedIn) this.trigger('verify', this.auth.token);
    // }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'pages':
        }
    }
    //             if (!newV.loggedIn && !newV.token) document.querySelector('wc-router').replace('/login');
    //             if (newV.loggedIn && newV.token) this.trigger('getMe');

    //             break;
    //     }
    // }
}


class ConnectedPages extends connect(store, Pages) {
    _mapStateToProps(state) {
        return {
            pages: state.Pages
        };
    }
    _mapDispatchToEvents(dispatch) {
        return {
            'pages-get': actions.Pages.pagesGet(dispatch)
        };
    }
}

window.customElements.define('page-app-pages', ConnectedPages);
