import {Element} from 'lib';
import HTML from './page-create.html';
import CSS from './page-create.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class PageCreate extends Element {
    constructor() {
        super(HTML, CSS.toString());
        this.router = document.querySelector('wc-router');

        this.form = this.shadowRoot.querySelector('zen-ui-form');
        this.form.fields = this.constructor.formFields;
        this.form.addEventListener('submit', this.submit.bind(this));

        this.addEventListener('page-create-done', ({detail}) => {
            if (detail.id) this.router.push(`/pages/${detail.id}`);
        });
    }

    static get formFields() {
        return [
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
                type: 'submit',
                value: 'create page',
                color: 'green'
            }
        ];
    }

    connectedCallback() {
        this.trigger('title-set', ['Create page']);
    }

    submit() {
        this.trigger('page-create', [this.form.values]);
    }
}


class ConnectedPagesCreate extends connect(store, PageCreate) {
    get mapDispatchToEvents() {
        return {
            'page-create': actions.Pages.pagesCreate,
            'title-set': actions.App.titleSet
        };
    }
}

window.customElements.define('page-app-page-create', ConnectedPagesCreate);
