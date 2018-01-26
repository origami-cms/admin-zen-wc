import {Element} from 'lib';
import HTML from './user-create.html';
import CSS from './user-create.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class UserCreate extends Element {
    constructor() {
        super(HTML, CSS.toString());
        this.router = document.querySelector('wc-router');

        this.form = this.shadowRoot.querySelector('zen-ui-form');
        this.form.fields = this.constructor.formFields;
        this.form.addEventListener('submit', this.submit.bind(this));

        this.addEventListener('user-create-done', ({detail}) => {
            if (detail.id) this.router.push(`/users/${detail.id}`);
        });
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
                name: 'password',
                placeholder: 'Password',
                type: 'password'
            },
            {
                type: 'submit',
                value: 'Create',
                color: 'green'
            }
        ];
    }

    connectedCallback() {
        this.trigger('title-set', ['Create user']);
    }

    static get boundProps() {
        return ['user', 'errors'];
    }

    // propertyChangedCallback(prop, oldV, newV) {
    //     switch (prop) {
    //         case 'errors':
    //     }
    // }


    submit() {
        this.trigger('user-create', [this.form.values]);
    }
}


class ConnectedUsersCreate extends connect(store, UserCreate) {
    _mapStateToProps(state) {
        let user = state.Users.users.find(p => p.id === this.id);
        if (user) user = user.asMutable({deep: true});

        return {user, errors: state.Users.errors};
    }
    get mapDispatchToEvents() {
        return {
            'user-create': actions.Users.usersCreate,
            'title-set': actions.App.titleSet
        };
    }
}

window.customElements.define('page-app-user-create', ConnectedUsersCreate);
