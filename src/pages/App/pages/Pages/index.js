import {Element} from 'lib';
import HTML from './pages.html';
import CSS from './pages.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


import './Edit';


class Pages extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();

        this.table = this.shadowRoot.querySelector('zen-ui-resource-table');
    }

    connectedCallback() {
        this.trigger('title-set', ['Pages']);
        this.trigger('pages-get');
    }

    static get boundProps() {
        return ['pages'];
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'pages':
                this.table.data = newV.pages;
        }
    }
}


class ConnectedPages extends connect(store, Pages) {
    _mapStateToProps(state) {
        return {
            pages: state.Pages
        };
    }
    _mapDispatchToEvents(dispatch) {
        return {
            'pages-get': actions.Pages.pagesGet(dispatch),
            'title-set': actions.App.titleSet(dispatch)
        };
    }
}

window.customElements.define('page-app-pages', ConnectedPages);
