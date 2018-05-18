import {Element} from 'origami-zen';

export default class ResourceTableColumn extends Element {
    key: string = 'id';

    static observedAttributes = ['key'];
    static boundProps = ['key'];

    attributeChangedCallback(attr: string, oldV: any, newV: any) {
        switch (attr) {
            case 'key':
                this[attr] = newV;
        }
    }

    content(data: {[key: string]: any}): string {
        const existing = this.innerHTML.trim();

        if (existing) return this._renderTemplateString(existing, data) || data[this.key];
        return data[this.key];
    }
}

window.customElements.define('zen-ui-resource-table-column', ResourceTableColumn);
