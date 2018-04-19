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
    }

    static get boundProps() {
        return ['auth'];
    }

    async propertyChangedCallback(prop: keyof Logout, oldV: any, newV: any) {
        switch (prop) {
            case 'auth':
                const r = document.querySelector('wc-router') as Router;

                if (
                    !newV.loggedIn &&
                    r &&
                    r.history &&
                    r.history.location.pathname === '/logout'
                ) r.replace('/login');
        }
    }
}

window.customElements.define('page-logout', Logout);
