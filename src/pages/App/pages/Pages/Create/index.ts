import {Element, Form, Field} from 'origami-zen';
import HTML from './page-create.html';
import CSS from './page-create.scss';


import connect from 'wc-redux';
import store from 'store';
import actions from 'actions';
import {Router} from 'wc-router';

@connect(
    store,
    false,
    {
        'page-create': actions.Pages.pagesCreate,
        'title-set': actions.App.titleSet
    }
)
export default class PageCreate extends Element {
    router?: Router;
    form?: Form;

    static formFields: Field[] = [
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
            color: 'green',
            name: ''
        }
    ];


    constructor() {
        super(HTML, CSS.toString());
    }


    connectedCallback() {
        this.trigger('title-set', ['Create page']);

        let r: Router;
        this.router = r = document.querySelector('wc-router') as Router;

        this.form = this._root.querySelector('zen-ui-form') as Form;
        this.form.fields = (this.constructor as typeof PageCreate).formFields;
        this.form.addEventListener('submit', this.submit.bind(this));

        this.addEventListener('page-create-done', (e: CustomEventInit) => {
            if (e.detail.id) r.push(`/pages/${e.detail.id}`);
        });
    }

    submit() {
        if (!this.form) return this._error('Not initialised');
        this.trigger('page-create', [this.form.values]);
    }
}

window.customElements.define('page-app-page-create', PageCreate);
