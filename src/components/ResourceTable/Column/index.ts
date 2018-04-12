import {Element} from 'origami-zen';

export default class ResourceTableColumn extends Element {
    key?: string;
    static defaultProps = {
        data: [],
        idKey: 'id'
    };

    static observedAttributes = ['key'];

    attributeChangedCallback(attr: string, oldV: any, newV: any) {
        switch (attr) {
            case 'key':
                this[attr] = newV;
        }
    }
}

window.customElements.define('zen-ui-resource-table-column', ResourceTableColumn);
