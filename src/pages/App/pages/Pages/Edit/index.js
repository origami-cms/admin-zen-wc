import {Element} from 'lib';
import HTML from './page-edit.html';
import CSS from './page-edit.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class PagedEdit extends Element {
    constructor() {
        super(HTML, CSS.toString());
        this.router = document.querySelector('wc-router');

        this.form = this.shadowRoot.querySelector('zen-ui-form');
        this.form.fields = [
            {
                name: 'title',
                placeholder: 'Title',
                type: 'text'
            },
            {
                name: 'url',
                placeholder: 'URL',
                type: 'text'
            },
            {
                type: 'submit'
            }
        ];
        this.form.addEventListener('submit', this.save.bind(this));
    }

    get id() {
        if (this.isConnected) return this.router.params.id;
        else return false;
    }

    connectedCallback() {
        this.trigger('page-get', [this.id]);
    }

    static get boundProps() {
        return ['page'];
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'page':
                if (newV) {
                    this.trigger('title-set', [newV.title]);
                    this.form.values = newV;
                }

        }
    }


    save() {
        this.trigger('page-update', [this.id, this.form.values]);
    }
}


class ConnectedPagesEdit extends connect(store, PagedEdit) {
    _mapStateToProps(state) {
        let page = state.Pages.pages.find(p => p.id === this.id);
        if (page) page = page.asMutable({deep: true});

        return {page};
    }
    _mapDispatchToEvents(dispatch) {
        return {
            'page-get': actions.Pages.pagesGet(dispatch),
            'page-update': actions.Pages.pagesUpdate(dispatch),
            'title-set': actions.App.titleSet(dispatch)
        };
    }
}

window.customElements.define('page-app-page-edit', ConnectedPagesEdit);
