import actions from 'actions';
import {Element, Field, Form, FormValues} from 'origami-zen';
import connect from 'wc-redux';
import store from '../../../store';
import State, {User} from '../../../store/state';
import HTML from './user-edit.html';
import CSS from './user-edit.scss';
import UserAvatar from '~/components/UserAvatar';

@connect(
    store,
    (state: State, el: UserEdit) => {
        const user = state.Users.users.find(u => u.id === el.resource);

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
    resource?: string;
    form: Form | null = null;
    user?: User;
    errors?: object;


    static observedAttributes = ['resource'];
    static boundProps = ['user', 'errors', 'resource'];
    static formFields: Field[] = [
        {
            name: 'fname',
            placeholder: 'First name',
            type: 'text',
            width: 'half',
            icon: 'user',
            iconColor: 'grey-300'
        },
        {
            name: 'lname',
            placeholder: 'Last name',
            type: 'text',
            width: 'half',
            icon: 'user',
            iconColor: 'grey-300'
        },
        {
            name: 'email',
            placeholder: 'Email',
            type: 'text',
            icon: 'mail',
            iconColor: 'grey-300'
        },
        {
            type: 'submit',
            name: '',
            value: 'Save'
        }
    ];


    constructor() {
        super(HTML, CSS, 'user-edit', false);
    }


    connectedCallback() {
        super.connectedCallback();

        this.form = this._root.querySelector('zen-ui-form') as Form;
        this.form.fields = (this.constructor as typeof UserEdit).formFields;
        this.form.addEventListener('submit', this.save.bind(this));
    }

    attributeChangedCallback(attr: keyof UserEdit, oldV: any, newV: any) {
        switch (attr) {
            case 'resource':
                this[attr] = newV;
                break;
        }
    }

    async propertyChangedCallback(prop: keyof UserEdit, oldV: any, newV: any) {
        switch (prop) {
            case 'resource':
                console.log(newV);
                if (!oldV && newV) {

                    this.trigger('user-get', [this.resource]);
                    this.trigger('user-properties-get', [this.resource]);
                }
                break;
            case 'user':
                if (newV) {
                    await this.ready();
                    this.trigger('title-set', [newV.fname]);
                    (this.form as Form).values = newV;
                    (this._root.querySelector('user-avatar') as UserAvatar).user = this.resource;
                }
                break;

            case 'errors':
                // if (newV.get && this.router) this.router.push('/404');

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

        this.trigger('user-update', [this.resource, f.values]);
    }
}

window.customElements.define('user-edit', UserEdit);
