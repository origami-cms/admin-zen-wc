import {Element} from 'origami-zen';
import store from 'store';
import connect from 'wc-redux';
import HTML from './header.html';
import CSS from './header.scss';
import State, {App} from 'store/state';


export * from './User';
export * from './Notifications';

@connect(store, (state: State) => ({
    app: state.App
}))
export class Header extends Element {
    app?: App;

    constructor() {
        super(HTML, CSS.toString(), false);
    }

    static boundProps = ['app'];

    get pageTitle() {
        if (!this.app) return null;
        return this.app.page.title || null;
    }
}


window.customElements.define('zen-header', Header);

