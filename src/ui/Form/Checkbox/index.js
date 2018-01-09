import {Element} from 'lib';
import HTML from './checkbox.html';

window.customElements.define('zen-ui-checkbox', class Icon extends Element {
    constructor() {
        super();
        this.html = HTML;

        this.input = this.shadowRoot.querySelector('input');
        this.input.addEventListener('change', () => this.trigger('change'));
    }

    static get defaultProps() {
        return {
            'checked': false
        };
    }

    static get boundProps() {
        return ['checked'];
    }

    static get observedAttributes() {
        return ['checked'];
    }

    attributeChangedCallback(attr, oldV, newV) {
        switch (attr) {
            case 'checked':
                this[attr] = newV;
                break;
        }
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'checked':
                if (this.isConnected) this.input.checked = newV;
                break;
        }
    }
});
