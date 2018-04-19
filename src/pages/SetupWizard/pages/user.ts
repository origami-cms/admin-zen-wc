import {Element, Form, Field, Button} from 'origami-zen';
import HTML from './page-setup-user.html';
import CSS from './page-setup-user.scss';
import {Router} from 'wc-router';
import connect from 'wc-redux';
import store from 'store';
import State from 'store/state';
import actions from 'actions';

@connect(
    store,
    (state: State) => ({
        loading: state.Setup.loading.user,
        error: state.Setup.errors.user,
        user: state.Setup.user
    }),
    {
        setupUser: actions.Setup.setupUser
    }
)
export default class PageSetupUser extends Element {
    loading: boolean = false;
    error?: string;
    user?: object;

    fields: Field[] = [
        {
            type: 'text',
            name: 'name',
            placeholder: 'Full name',
            icon: 'user'
        },
        {
            type: 'email',
            name: 'email',
            placeholder: 'Email',
            icon: 'mail'
        },
        {
            type: 'password',
            name: 'password',
            placeholder: 'Password',
            icon: 'lock'
        }
    ];

    private _form?: Form;
    private _btnNext?: Button;


    static boundProps = ['loading', 'error', 'user'];


    constructor() {
        super(HTML, false, 'page-setup-user', false);
    }

    connectedCallback() {
        super.connectedCallback();
        this._form = this.querySelector('zen-ui-form') as Form;
        this._form.fields = this.fields;
        this._btnNext = this._root.querySelector('zen-ui-button.next') as Button;

        this._btnNext.addEventListener('click', this._submit.bind(this));
    }

    propertyChangedCallback(prop: keyof PageSetupUser, oldV: any, newV: any) {
        switch (prop) {
            case 'loading':
                if (this._btnNext) this._btnNext.loading = newV;
                break;

            case 'error':
                if (this._form) this._form.error = newV;
                break;

            case 'user':
                if (newV) (document.querySelector('wc-router') as Router).push('/setup/finish');

        }
    }

    private _submit() {
        if (!this._form) return;
        if (this._form.validate()) {
            const data = {...this._form.values};
            data.fname = data.name.split(' ')[0];
            data.lname = data.name.split(' ').slice(1).join(' ');
            delete data.name;

            this.trigger('setupUser', data);
        }
    }
}

window.customElements.define('page-setup-user', PageSetupUser);
