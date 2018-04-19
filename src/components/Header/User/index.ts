import {Element} from 'origami-zen';
import store from 'store';
import State, {Me} from 'store/state';
import connect from 'wc-redux';
import HTML from './header-user.html';
import CSS from './header-user.scss';

import profile from '../../../images/profile.png';


@connect(store, (state: State) => ({
    me: state.Me
}))
export default class HeaderUser extends Element {
    me?: Me;
    constructor() {
        super(HTML, CSS.toString(), 'HeaderUser', false);
    }

    static get boundProps() {
        return ['me'];
    }

    propertyChangedCallback(prop: keyof HeaderUser, oldV: any, newV: any) {
        switch (prop) {
            case 'me':
                // TODO: Replace with logo
                (this._root.querySelector('img.profile') as HTMLImageElement).src = profile;
                break;
        }
    }
}

window.customElements.define('zen-header-user', HeaderUser);

