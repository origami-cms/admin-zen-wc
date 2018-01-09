import Element from 'lib/Element';

import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class Logout extends Element {

    connectedCallback() {
        this.trigger('logout');
    }

    static get boundProps() {
        return ['auth'];
    }

    propertyChangedCallback(prop, oldV, newV) {
        const router = document.querySelector('wc-router');
        switch (prop) {
            case 'auth':
                if (!newV.loggedIn && router.history.location.pathname === '/logout') router.replace('/login');
        }
    }
}


class ConnectedLogout extends connect(store, Logout) {
    _mapStateToProps(state) {
        return {
            auth: state.Auth
        };
    }
    _mapDispatchToEvents(dispatch) {
        return {
            logout: actions.Auth.logout(dispatch)
        };
    }
}

window.customElements.define('page-logout', ConnectedLogout);
