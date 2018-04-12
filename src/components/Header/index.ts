import {Element} from 'origami-zen';
import store from 'store';
import connect from 'wc-redux';
import HTML from './header.html';
import CSS from './header.scss';
import State from 'store/state';


@connect(store, (state: State) => ({
    app: state.App
}))
export class Header extends Element {
    constructor() {
        super(HTML, CSS.toString());
    }

    static get boundProps() {
        return ['app'];
    }
}


window.customElements.define('zen-header', Header);

