import {Element} from 'lib';
import HTML from './app.html';
import CSS from './app.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


import './pages';


class App extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();
    }

    static get boundProps() {
        return ['me', 'auth'];
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.auth.token && !this.auth.loggedIn) this.trigger('verify', this.auth.token);
        this.trigger('title-set', ['Home']);
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'auth':
                if (
                    !newV.loggedIn &&
                    !newV.token &&
                    location.pathname != '/admin/login'
                ) document.querySelector('wc-router').replace('/login');

                break;
        }
    }
}


class ConnectedApp extends connect(store, App) {
    _mapStateToProps(state) {
        return {
            me: state.Me,
            auth: state.Auth
        };
    }
    get mapDispatchToEvents() {
        return {
            login: actions.Auth.login,
            verify: actions.Auth.verify,
            getMe: actions.Me.getMe,
            'title-set': actions.App.titleSet
        };
    }
}


window.customElements.define('page-app', ConnectedApp);
