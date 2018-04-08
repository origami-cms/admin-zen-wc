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
        this.form.fields = this.constructor.formFields;
        this.form.addEventListener('submit', this.save.bind(this));
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
                value: 'save'
            }
        ];
    }


    get id() {
        if (this.isConnected) return this.router.params.id;
        else return false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('page-get', [this.id]);
        this.trigger('page-properties-get', [this.id]);
    }

    static get boundProps() {
        return ['page', 'errors'];
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'page':
                if (newV) {
                    this.trigger('title-set', [newV.title]);

                    // Prefix data properties as `data.propx` on main values
                    const d = newV;
                    Object.entries(d.data).forEach(([k, v]) => d[`data.${k}`] = v);
                    delete d.data;

                    this.form.values = newV;
                    if (newV.properties) {
                        const slice = -1;
                        this.form.fields = [
                            ...this.constructor.formFields.slice(0, slice),
                            ...Object.entries(newV.properties).map(([name, v]) => ({
                                name: `data.${name}`,
                                placeholder: v.label,
                                type: v.type
                            })),
                            // Submit at the end
                            ...this.constructor.formFields.slice(-1)
                        ];
                        this.form.render();
                    }
                }
                break;

            case 'errors':
                if (newV.get) this.router.push('/404');

        }
    }


    save() {
        this.form.values.data = {};
        delete this.form.values.properties;

        Object.keys(this.form.values)
            .filter(k => (/^data\./).test(k))
            .map(k => (/^data\.(.+)/).exec(k)[1])
            .forEach(k => {
                this.form.values.data[k] = this.form.values[`data.${k}`];
                delete this.form.values[`data.${k}`];
            });

        this.trigger('page-update', [this.id, this.form.values]);
    }
}


class ConnectedPagesEdit extends connect(store, PagedEdit) {
    _mapStateToProps(state) {
        let page = state.Pages.pages.find(p => p.id === this.id);
        if (page) page = page.asMutable({deep: true});

        return {page, errors: state.Pages.errors};
    }
    get mapDispatchToEvents() {
        return {
            'page-get': actions.Pages.pagesGet,
            'page-update': actions.Pages.pagesUpdate,
            'page-properties-get': actions.Pages.pagesPropertiesGet,
            'title-set': actions.App.titleSet
        };
    }
}

window.customElements.define('page-app-page-edit', ConnectedPagesEdit);
