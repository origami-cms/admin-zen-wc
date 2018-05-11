import actions from 'actions';
import {Element} from 'origami-zen';
import store from 'store';
import {Auth} from 'store/state';
import connect from 'wc-redux';


@connect(
    store,
    false,
    {logout: actions.Auth.logout}
)
export default class Logout extends Element {
    auth?: Auth;

    connectedCallback() {
        super.connectedCallback();
        this.trigger('logout');
    }
}

window.customElements.define('page-logout', Logout);
