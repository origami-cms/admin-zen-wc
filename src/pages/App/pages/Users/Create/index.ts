import actions from 'actions';
import {Element, Field, Form} from 'origami-zen';
import store from 'store';
import State, {User} from 'store/state';
import connect from 'wc-redux';
import {Router} from 'wc-router';
import HTML from './user-create.html';
import CSS from './user-create.scss';


import img from 'images/icons/user/create.svg';


@connect(
    store,
    (state: State) => {
        // @ts-ignore this = UserCreate
        const user = state.Users.users.find(u => u.id === this.id);

        let u: User | false = false;
        if (user) u = user.asMutable({deep: true});

        return {user: u, errors: state.Users.errors};
    },
    {
        'user-create': actions.Users.usersCreate,
        'title-set': actions.App.titleSet
    }
)
export default class UserCreate extends Element {
    router: Router | null = null;
    form: Form | null = null;

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
            name: 'password',
            placeholder: 'Password',
            type: 'password',
            icon: 'lock',
            iconColor: 'grey-300'
        },
        {
            type: 'submit',
            name: '',
            value: 'Create',
            color: 'green'
        }
    ];


    constructor() {
        super(HTML, CSS.toString(), 'UserCreate', false);
    }


    connectedCallback() {
        super.connectedCallback();

        this.trigger('title-set', ['Create user']);


        let r: Router;
        this.router = r = document.querySelector('wc-router') as Router;

        let f;
        this.form = f = this._root.querySelector('zen-ui-form') as Form;

        f.fields = (this.constructor as typeof UserCreate).formFields;
        f.addEventListener('submit', this.submit.bind(this));
        f.addEventListener('change', this.render.bind(this));

        this.addEventListener('user-create-done', (e: CustomEventInit) => {
            if (e.detail.id) r.push(`/users/${e.detail.id}`);
        });

        (this.querySelector('img') as HTMLImageElement).src = img;
    }

    static get boundProps() {
        return ['user', 'errors'];
    }

    get firstName() {
        if (!this.form || !this.form.values.fname) return 'a user';
        return this.form.values.fname;
    }

    // propertyChangedCallback(prop, oldV, newV) {
    //     switch (prop) {
    //         case 'errors':
    //     }
    // }


    submit() {
        if (!this.form) return this._error('Not initialised');
        this.trigger('user-create', [this.form.values]);
    }
}

window.customElements.define('page-app-user-create', UserCreate);
