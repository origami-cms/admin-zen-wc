import HTML from './Login.html';
import CSS from './login.scss';
import Element from 'lib/Element';
import logo from 'images/logo.svg';

import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class Login extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();
        this.loginFormFields = [
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
                value: 'Login'
            }
        ];
    }

    static get boundProps() {
        return ['email', 'auth'];
    }

    async connectedCallback() {
        const form = this.shadowRoot.querySelector('zen-ui-form');
        const img = this.shadowRoot.querySelector('img.logo');
        img.src = logo;
        await window.customElements.whenDefined('zen-ui-form');
        form.fields = this.loginFormFields;
        form.values = {
            email: this.email
        };

        form.addEventListener('submit', e => {
            const {email, password} = e.target.values;
            this.login(email, password);

            return false;
        });

        if (this.auth.token) this.trigger('verify', this.auth.token);
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'auth':
                if (oldV) {
                    if (!oldV.loggedIn && newV.loggedIn && this.isConnected) {
                        document.querySelector('wc-router').replace('/');
                    }
                }
                const form = this.shadowRoot.querySelector('zen-ui-form');

                if (newV.errors.loggingIn) form.error = newV.errors.loggingIn;
                else if (newV.errors.verify) form.error = newV.errors.verify;

                break;
        }
    }

    login(email, password) {
        this.trigger('login', [
            email, password
        ]);
    }
}


// Subclass and implement `connect` callbacks
class ConnectedLogin extends connect(store, Login) {
    _mapStateToProps(state) {
        return {
            email: state.Me.email,
            auth: state.Auth
        };
    }
    _mapDispatchToEvents(dispatch) {
        return {
            login: actions.Auth.login(dispatch),
            verify: actions.Auth.verify(dispatch)
        };
    }
}

window.customElements.define('page-login', ConnectedLogin);
