import {Element} from 'origami-zen';
import HTML from './header.html';
import CSS from './header.scss';


import connect from 'wc-redux';
import store from 'store';


class HeaderUser extends Element {
    constructor() {
        super(HTML, CSS.toString());
    }

    static get boundProps() {
        return ['app'];
    }
}


class ConnectedHeader extends connect(store, HeaderUser) {
    _mapStateToProps(state) {
        return {
            app: state.App
        };
    }
}


window.customElements.define('zen-header', ConnectedHeader);

