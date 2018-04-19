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
        verify: actions.Auth.verify,
        getMe: actions.Me.getMe,
        'title-set': actions.App.titleSet
    }
)
export default class App extends Element {
    auth?: Auth;
    router?: Router;


    constructor() {
        super(HTML, CSS, 'PageApp', false);
    }

    static boundProps = ['me', 'auth'];

    connectedCallback() {
        super.connectedCallback();
        if (this.auth) {
            if (this.auth.token && !this.auth.loggedIn) this.trigger('verify', this.auth.token);
        }
        this.trigger('title-set', ['Home']);
        this.trigger('getMe');

        this.router = document.querySelector('wc-router') as Router;
    }

    async propertyChangedCallback(prop: keyof App, oldV: any, newV: any) {
        switch (prop) {
            case 'auth':
                if (
                    !newV.loggedIn &&
                    !newV.token &&
                    location.pathname !== '/admin/login'
                    && this.router
                ) this.router.replace('/login');

                break;
        }
    }
}

window.customElements.define('page-app', App);
