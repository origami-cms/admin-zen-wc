import actions from 'actions';
import {Element} from 'origami-zen';
import store from 'store';
import State, {Auth} from 'store/state';
import connect from 'wc-redux';
import HTML from './app.html';
import CSS from './app.scss';
import './pages';
import {Router} from 'wc-router';


@connect(
    store,
    (state: State) => ({
        me: state.Me,
        auth: state.Auth
    }),
    {
        login: actions.Auth.login,
        logout: actions.Auth.logout,
        verify: actions.Auth.verify,
        getMe: actions.Me.getMe,
        'title-set': actions.App.titleSet
    }
)
export default class App extends Element {
    auth?: Auth;


    constructor() {
        super(HTML, CSS, false);
    }

    static boundProps = ['me', 'auth'];

    connectedCallback() {
        super.connectedCallback();
        this.trigger('title-set', ['Home']);
    }

    get router(): Router {
        return document.querySelector('wc-router') as Router;
    }

    async propertyChangedCallback(prop: keyof App, oldV: any, newV: any) {
        switch (prop) {
            case 'auth':
                await this.ready();
                const a = newV as Auth;

                if (!a.verified &&
                    a.token &&
                    !a.loggedIn &&
                    location.pathname !== '/admin/logout'
                ) {
                    this.trigger('verify', a.token);

                } else if (
                    !a.loggedIn &&
                    location.pathname !== '/admin/login'
                ) this.router.replace('/login');
                else if (a.verified) this.trigger('getMe');

                break;
        }
    }
}

window.customElements.define('page-app', App);
