import actions from 'actions';
import {Element} from 'origami-zen';
import store from 'store';
import State, {Auth} from 'store/state';
import connect from 'wc-redux';
import {Router} from 'wc-router';


@connect(
    store,
    (state: State) => ({
        auth: state.Auth
    }),
    {
        logout: actions.Auth.logout
    }
)
export default class Logout extends Element {
    auth?: Auth;
    router?: Router;

    connectedCallback() {
        this.trigger('logout');
        this.router = document.querySelector('wc-router') as Router;
    }

    static get boundProps() {
        return ['auth'];
    }

    async propertyChangedCallback(prop: keyof Logout, oldV: any, newV: any) {
        switch (prop) {
            case 'auth':
                if (
                    !newV.loggedIn &&
                    this.router &&
                    this.router.history &&
                    this.router.history.location.pathname === '/logout'
                ) this.router.replace('/login');
        }
    }
}

window.customElements.define('page-logout', Logout);
