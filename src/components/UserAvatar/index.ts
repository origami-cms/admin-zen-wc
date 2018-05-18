import {Element} from 'origami-zen';
import HTML from './user-avatar.html';
import CSS from './user-avatar.scss';

export default class UserAvatar extends Element {
    user?: string;

    static observedAttributes = ['user'];
    static boundProps = ['user'];


    constructor() {
        super(HTML, CSS, 'user-avatar');
    }

    private get _img(): HTMLImageElement {
        return this._root.querySelector('img') as HTMLImageElement;
    }


    attributeChangedCallback(attr: keyof UserAvatar, oldV: any, newV: any) {
        switch (attr) {
            case 'user':
                if (this[attr] !== newV) this[attr] = newV;
                break;
        }
    }

    async propertyChangedCallback(prop: keyof UserAvatar, oldV: any, newV: any) {
        await this.ready();
        switch (prop) {
            case 'user':
                if (this.getAttribute('user') !== newV) this.setAttribute('user', newV);
                this._img.src = `/content/profiles/${newV}`;
                break;
        }
    }

}

window.customElements.define('user-avatar', UserAvatar);
