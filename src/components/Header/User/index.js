import {Element} from 'lib';
import HTML from './header.html';
import CSS from './header.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
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

