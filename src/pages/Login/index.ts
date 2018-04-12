import HTML from './Login.html';
import CSS from './login.scss';
import {Element, Field, Form} from 'origami-zen';
import logo from 'images/logo.svg';

import connect from 'wc-redux';
import store from 'store';
import actions from 'actions';
import State, {Auth} from 'store/state';
import {Router} from 'wc-router';
@connect(
    store,
    (state: State) => ({
        email: state.Me.email,
        auth: state.Auth
    }),
    {
        login: actions.Auth.login,
        verify: actions.Auth.verify
    }
)
export default class Login extends Element {
    router?: Router;
    email?: string;
    form?: Form;
    auth?: Auth;

    loginFormFields: Field[] = [
        {
            type: 'email',
            name: 'email',
            placeholder: 'Email',
            icon: 'mail'
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            icon: 'lock'
        },
        {
            type: 'submit',
            value: 'Login',
            name: ''
        }
    ];

    constructor() {
        super(HTML, CSS, 'Login', false);
    }

    static get boundProps() {
        return ['email', 'auth'];
    }

    async connectedCallback() {
        super.connectedCallback();
        this.router = document.querySelector('wc-router') as Router;
        let f: Form;
        this.form = f = this._root.querySelector('zen-ui-form') as Form;
        const img = this._root.querySelector('img.logo') as HTMLImageElement;
        img.src = logo;

        await window.customElements.whenDefined('zen-ui-form');
        f.fields = this.loginFormFields;
        f.values = {
            email: this.email
        };

        (f.shadowRoot as ShadowRoot).addEventListener('submit', e => {
            const {email, password} = f.values;
            this.login(email, password);

            return false;
        });

        const a = this.auth as Auth;
        if (a.token) this.trigger('verify', a.token);
    }

    async propertyChangedCallback(prop: keyof Login, oldV: any, newV: any) {
        switch (prop) {
            case 'auth':
                if (oldV) {
                    console.log(newV);

                    if (!oldV.loggedIn && newV.loggedIn && this.isConnected && this.router) {
                        this.router.replace('/');
                    }
                }

                if (this.form) {
                    if (newV.errors.loggingIn) this.form.error = newV.errors.loggingIn;
                    else if (newV.errors.verify) this.form.error = newV.errors.verify;
                }

                break;
        }
    }

    login(email: string, password: string) {
        this.trigger('login', [
            email, password
        ]);
    }
}

window.customElements.define('page-login', Login);
