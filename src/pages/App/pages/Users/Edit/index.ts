import actions from 'actions';
import {Element, Form, Field, FormValues} from 'origami-zen';
import store from 'store';
import State, {User} from 'store/state';
import connect from 'wc-redux';
import {Router} from 'wc-router';
import HTML from './user-edit.html';
import CSS from './user-edit.scss';
import UserAvatar from '~/components/UserAvatar';



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
    router?: Router;
    form: Form | null = null;
    user?: User;
    errors?: object;
    userId?: string;

    constructor() {
        super(HTML, CSS.toString(), false);
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

    connectedCallback() {
        super.connectedCallback();
        this.router = document.querySelector('wc-router') as Router;
        this.userId = this.router.params.id;

        this.trigger('user-get', [this.userId]);
        this.trigger('user-properties-get', [this.userId]);


        this.form = this._root.querySelector('zen-ui-form') as Form;
        this.form.fields = (this.constructor as typeof UserEdit).formFields;
        this.form.addEventListener('submit', this.save.bind(this));


        this.form.values = this.user as FormValues;
        (this.querySelector('user-avatar') as UserAvatar).user = this.userId;
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
