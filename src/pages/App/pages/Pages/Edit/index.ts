import actions from 'actions';
import {Element, Form, Field} from 'origami-zen';
import store from 'store';
import State, {Page} from 'store/state';
import connect from 'wc-redux';
import {Router} from 'wc-router';
import HTML from './page-edit.html';
import CSS from './page-edit.scss';



@connect(
    store,
    (state: State) => {
        // @ts-ignore this = UserCreate
        const page = state.Pages.pages.find(p => p.id === this.pageId);

        let p: Page | false = false;
        if (page) p = page.asMutable({deep: true});

        return {user: p, errors: state.Pages.errors};
    },
    {
        'user-get': actions.Users.usersGet,
        'user-update': actions.Users.usersUpdate,
        'title-set': actions.App.titleSet
    }
)
export default class PageEdit extends Element {
    router: Router | null = null;
    form: Form | null = null;
    page?: Page;
    errors?: object;

    constructor() {
        super(HTML, CSS.toString());
    }

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
            name: '',
            value: 'save'
        }
    ];


    get pageId() {
        if (this.isConnected && this.router) return this.router.params.id;
        return false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('page-get', [this.pageId]);
        this.trigger('page-properties-get', [this.pageId]);

        this.router = document.querySelector('wc-router');

        this.form = this._root.querySelector('zen-ui-form') as Form;
        this.form.fields = (this.constructor as typeof PageEdit).formFields;
        this.form.addEventListener('submit', this.save.bind(this));
    }

    static get boundProps() {
        return ['page', 'errors'];
    }

    async propertyChangedCallback(prop: keyof PageEdit, oldV: any, newV: any) {
        switch (prop) {
            case 'page':
                if (newV) {
                    if (!this.form) return;
                    this.trigger('title-set', [newV.title]);

                    // Prefix data properties as `data.propx` on main values
                    const d = newV;
                    Object.entries(d.data).forEach(([k, v]) => d[`data.${k}`] = v);
                    delete d.data;

                    const c = this.constructor as typeof PageEdit;

                    const p = newV as Page;
                    this.form.values = newV;

                    const properties = newV.properties as {[name: string]: Field};
                    const fields: Field[] = Object.entries(properties).map(([name, v]) => {
                        v.name = name;
                        return v;
                    });

                    if (newV.properties) {
                        const slice = -1;
                        this.form.fields = [
                            ...c.formFields.slice(0, slice),
                            ...fields,
                            // Submit at the end
                            ...c.formFields.slice(-1)
                        ];
                        this.form.render();
                    }
                }
                break;

            case 'errors':
                if (newV.get && this.router) this.router.push('/404');

        }
    }


    save() {
        const f = this.form;
        if (!f) return this._error('Not initialised');
        f.values.data = {};
        delete f.values.properties;

        Object.keys(f.values)
            .filter(k => (/^data\./).test(k))
            .map(k => ((/^data\.(.+)/).exec(k) as RegExpExecArray)[1])
            .forEach(k => {
                f.values.data[k] = f.values[`data.${k}`];
                delete f.values[`data.${k}`];
            });

        this.trigger('page-update', [this.pageId, f.values]);
    }
}

window.customElements.define('page-app-page-edit', PageEdit);
