import {Element} from 'lib';
import HTML from './button.html';
import CSS from './button.scss';

window.customElements.define('zen-ui-button', class Button extends Element {
    constructor() {
        super(HTML, CSS.toString());

        this.button = this.shadowRoot.querySelector('button');
        this._icon = this.shadowRoot.querySelector('zen-ui-icon');
    }

    static get defaultProps() {
        return {
            'color': 'main',
            'size': 'main',
            'icon': false,
            'hollow': false
        };
    }
    static get boundProps() {
        return ['type', 'color', 'size', 'icon', 'hollow'];
    }

    static get observedAttributes() {
        return ['type', 'color', 'size', 'hollow'];
    }

    attributeChangedCallback(attr, oldV, newV) {
        switch (attr) {
            case 'icon':
            case 'color':
            case 'size':
            case 'hollow':
                this[attr] = newV;
                break;
        }
    }

    async propertyChangedCallback(prop, oldV, newV) {
        await this.ready();
        switch (prop) {
            case 'icon':
                this._icon.classList.toggle('hide', !newV);

                if (newV) {
                    this._icon.type = newV;
                    this._icon.size = this.size;
                }
                break;

            case 'color':
                this.button.classList.toggle(oldV, false);
                this.button.classList.toggle(newV, true);
                break;

            case 'size':
                this.button.classList.toggle(`size-${oldV}`, false);
                this.button.classList.toggle(`size-${newV}`, true);
                if (this.icon) this._icon.size = newV;
                break;

            case 'hollow':
                this.button.classList.toggle('hollow', Boolean(newV));
        }
    }
});
