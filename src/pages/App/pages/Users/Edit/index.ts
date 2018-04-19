import actions from 'actions';
import {Element, Form, Field} from 'origami-zen';
import store from 'store';
import State, {User} from 'store/state';
import connect from 'wc-redux';
import {Router} from 'wc-router';
import HTML from './user-edit.html';
import CSS from './user-edit.scss';



@connect(
    store,
    (state: State, el: UserEdit) => {
        // @ts-ignore this = UserCreate
        const user = state.Users.users.find(u => u.id === el.userId);

        let u: User | false = false;
        if (user) u = user.asMutable({deep: true});

        return {user: u, errors: state.Users.errors};
    },
    {
        'user-get': actions.Users.usersGet,
        'user-update': actions.Users.usersUpdate,
        'title-set': actions.App.titleSet
    }
)
export default class UserEdit extends Element {
    router: Router | null = null;
    form: Form | null = null;
    user?: User;
    errors?: object;

    constructor() {
        super(HTML, CSS.toString(), 'UserEdit', false);
    }

    static formFields: Field[] = [
        {
            name: 'fname',
            placeholder: 'First name',
            type: 'text'
        },
        {
            name: 'lname',
            placeholder: 'Last name',
            type: 'text'
        },
        {
            name: 'email',
            placeholder: 'Email',
            type: 'text'
        },
        {
            type: 'submit',
            name: '',
            value: 'Save'
        }
    ];


    get userId(): string | false {
        if (!this.router) return false;
        if (this.isConnected) return this.router.params.id;
        return false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('user-get', [this.userId]);
        this.trigger('user-properties-get', [this.userId]);

        this.router = document.querySelector('wc-router');

        this.form = this._root.querySelector('zen-ui-form') as Form;
        this.form.fields = (this.constructor as typeof UserEdit).formFields;
        this.form.addEventListener('submit', this.save.bind(this));
    }

    static get boundProps() {
        return ['user', 'errors'];
    }

    async propertyChangedCallback(prop: keyof UserEdit, oldV: any, newV: any) {
        switch (prop) {
            case 'user':
                if (newV) {
                    await this.ready();
                    this.trigger('title-set', [newV.fname]);
                    (this.form as Form).values = newV;
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

        this.trigger('user-update', [this.userId, f.values]);
    }
}

window.customElements.define('page-app-user-edit', UserEdit);
