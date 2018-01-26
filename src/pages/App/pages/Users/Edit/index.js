import {Element} from 'lib';
import HTML from './user-edit.html';
import CSS from './user-edit.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class UserEdit extends Element {
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
                value: 'Save'
            }
        ];
    }


    get id() {
        if (this.isConnected) return this.router.params.id;
        else return false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('user-get', [this.id]);
        this.trigger('user-properties-get', [this.id]);
    }

    static get boundProps() {
        return ['user', 'errors'];
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'user':
                if (newV) {
                    this.trigger('title-set', [newV.fname]);

                    this.form.values = newV;
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

        this.trigger('user-update', [this.id, this.form.values]);
    }
}


class ConnectedUsersEdit extends connect(store, UserEdit) {
    _mapStateToProps(state) {
        let user = state.Users.users.find(p => p.id === this.id);
        if (user) user = user.asMutable({deep: true});

        return {user, errors: state.Users.errors};
    }
    get mapDispatchToEvents() {
        return {
            'user-get': actions.Users.usersGet,
            'user-update': actions.Users.usersUpdate,
            'title-set': actions.App.titleSet
        };
    }
}

window.customElements.define('page-app-user-edit', ConnectedUsersEdit);
