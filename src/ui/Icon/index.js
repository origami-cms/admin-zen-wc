import {Element} from 'lib';
import HTML from './icon.html';
import CSS from './icon.scss';

window.customElements.define('zen-ui-icon', class Icon extends Element {
    constructor() {
        super();
        this._prefix = '#zen-icon-';
        this.html = HTML;
        this.css = CSS.toString();
    }

    get svg() {
        return this.shadowRoot.querySelector('svg');
    }
    get use() {
        return this.svg.querySelector('use');
    }

    static get defaultProps() {
        return {
            'color': 'main',
            'size': 'main'
        };
    }
    static get boundProps() {
        return ['type', 'color', 'size'];
    }

    static get observedAttributes() {
        return ['type', 'color', 'size'];
    }

    attributeChangedCallback(attr, oldV, newV) {
        switch (attr) {
            case 'type':
            case 'color':
            case 'size':
                this[attr] = newV;
                break;
        }
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'type':
                // Remove all old symbols and replace with new one
                Array.from(this.svg.querySelectorAll('symbol')).forEach(s => s.remove());
                // Clone the new symbol from the icon set
                const symbol = document.querySelector(this._prefix + newV).cloneNode(true);
                this.svg.appendChild(symbol);
                // Update the ref on the use
                this.use.setAttribute('xlink:href', this._prefix + newV);
                break;

            case 'color':
                if (this.svg) {
                    this.svg.classList.toggle(oldV, false);
                    this.svg.classList.toggle(newV, true);
                }
                break;
        }
    }

    render() {
        super.render();
        const {svg} = this;
        if (svg) {
            svg.classList.toggle(this.color, true);
        }
    }
});
