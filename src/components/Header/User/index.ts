import {Element} from 'origami-zen';
import store from 'store';
import State, {Me} from 'store/state';
import connect from 'wc-redux';
import HTML from './header-user.html';
import CSS from './header-user.scss';


@connect(store, (state: State) => ({
    me: state.Me
}))
export default class HeaderUser extends Element {
    me?: Me;
    constructor() {
        super(HTML, CSS.toString(), false);
    }

    static get boundProps() {
        return ['me'];
    }

    async propertyChangedCallback(prop: keyof HeaderUser, oldV: any, newV: any) {
        switch (prop) {
            case 'me':
                const me = newV as Me;
                await this.ready();
                (this._root.querySelector('img.profile') as HTMLImageElement)
                    .src = `/content/profiles/${me.id}`;
                break;
        }
    }
}

window.customElements.define('zen-header-user', HeaderUser);

