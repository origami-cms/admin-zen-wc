import {Element} from 'lib';
import HTML from './pages-list.html';
import CSS from './pages-list.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class PagesList extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();

        this.table = this.shadowRoot.querySelector('zen-resource-table');
    }

    static get boundProps() {
        return ['pages'];
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('pages-get', [null, false]);
        this.trigger('title-set', ['Pages']);
    }

    async propertyChangedCallback(prop, oldV, newV) {
        await this.ready();
        switch (prop) {
            case 'pages':
                this.table.data = newV.pages;
        }
    }
}


class ConnectedPagesList extends connect(store, PagesList) {
    _mapStateToProps(state) {
        return {
            pages: state.Pages
        };
    }
    get mapDispatchToEvents() {
        return {
            'pages-get': actions.Pages.pagesGet,
            'title-set': actions.App.titleSet
        };
    }
}

window.customElements.define('page-app-pages-list', ConnectedPagesList);
