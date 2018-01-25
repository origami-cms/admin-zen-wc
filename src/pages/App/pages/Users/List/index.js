import {Element} from 'lib';
import HTML from './users-list.html';
import CSS from './users-list.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class UsersList extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();


        this.table = this.shadowRoot.querySelector('zen-resource-table');
    }

    static get boundProps() {
        return ['users'];
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('users-get', [null, false]);
        this.trigger('title-set', ['Users']);
    }

    async propertyChangedCallback(prop, oldV, newV) {
        await this.ready();
        switch (prop) {
            case 'users':
                this.table.data = newV.users;
        }
    }
}


class ConnectedUsersList extends connect(store, UsersList) {
    _mapStateToProps(state) {
        return {
            users: state.Users
        };
    }
    get mapDispatchToEvents() {
        return {
            'users-get': actions.Users.usersGet,
            'title-set': actions.App.titleSet
        };
    }
}

window.customElements.define('page-app-users-list', ConnectedUsersList);
