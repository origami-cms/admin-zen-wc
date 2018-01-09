import {Element} from 'lib';

window.customElements.define('zen-ui-resource-table-column', class ZenResourceTable extends Element {
    static get defaultProps() {
        return {
            data: [],
            idKey: 'id'
        };
    }

    static get observedAttributes() {
        return ['key'];
    }

    attributeChangedCallback(attr, oldV, newV) {
        switch (attr) {
            case 'key':
                this[attr] = newV;
        }
    }


    // propertyChangedCallback(prop, oldV, newV) {
    //     switch (prop) {
    //         case 'key':
    //             this.
    //             break;

    //         default:
    //             break;
    //     }
    // }
});
