import {Element} from 'lib';
import HTML from './button-group.html';
import CSS from './button-group.scss';

window.customElements.define('zen-ui-button-group', class Button extends Element {
    constructor() {
        super(HTML, CSS.toString());
        this.group = this.shadowRoot.querySelector('.button-group');
    }


    static get defaultProps() {
        return {
            'buttons': []
        };
    }


    static get boundProps() {
        return ['buttons'];
    }


    render() {
        super.render();
        this.updateButtons();
    }

    async updateButtons() {
        await this.ready();
        this.buttons.forEach((btn, i) => {
            let ele = this.group.children[i];
            let add = false;
            if (!ele) {
                add = true;
                ele = document.createElement('zen-ui-button');
            }

            Object.assign(ele, btn);
            if (add) this.group.appendChild(ele);
        });


        // Remove buttons over the supplied button length (old ones)
        Array.from(this.group.children)
            .slice(this.buttons.length)
            .forEach(e => e.remove());
    }
});
