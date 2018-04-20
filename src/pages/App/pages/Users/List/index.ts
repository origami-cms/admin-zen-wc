import {Element} from 'origami-zen';
import HTML from './users-list.html';
import CSS from './users-list.scss';


import connect from 'wc-redux';
import store from 'store';
import actions from 'actions';
import State, {User} from 'store/state';
import {ImmutableObject} from 'seamless-immutable';

@connect(
    store,
    (state: State) => ({
        users: state.Users
    }),
    {
        'users-get': actions.Users.usersGet,
        'title-set': actions.App.titleSet
    }
)
export default class UsersList extends Element {
    users?: ImmutableObject<User>;
    table?: HTMLElement;
    constructor() {
        super(HTML, CSS, 'UsersList', false);
    }

    static get boundProps() {
        return ['users'];
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('users-get', [null, false]);
        this.trigger('title-set', ['Users']);

        this.table = this._root.querySelector('zen-resource-table') as HTMLElement;
    }

    async propertyChangedCallback(prop: keyof UsersList, oldV: any, newV: any) {
        await this.ready();
        switch (prop) {
            case 'users':
                // TODO: Make type of table
                // @ts-ignore
                if (this.table) this.table.data = newV.users;
        }
    }
}

window.customElements.define('page-app-users-list', UsersList);
