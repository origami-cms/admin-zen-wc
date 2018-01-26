import {Element} from 'lib';
import HTML from './form.html';
import CSS from './form.scss';

import './Checkbox';

window.customElements.define('zen-ui-form', class ZenForm extends Element {
    constructor() {
        super(HTML, CSS.toString());

        this.form = this.shadowRoot.querySelector('form');
    }

    connectedCallback() {
        super.connectedCallback();
        this.form.addEventListener('submit', this.submit.bind(this));
    }

    static get boundProps() {
        return ['fields', 'values', 'error'];
    }

    static get defaultProps() {
        return {
            fields: [],
            values: {}
        };
    }

    static get observedAttributes() {
        return [
            'fields'
        ];
    }

    attributeChangedCallback(attr, oldV, newV) {
        switch (attr) {
            case 'fields':
                this[attr] = newV;
        }
    }

    async propertyChangedCallback(prop) {
        await this.ready();
        switch (prop) {
            case 'error':
                this.updateError();
                break;

            default:
                break;
        }
    }

    updateError() {
        const err = this.shadowRoot.querySelector('.error');
        if (err) err.classList.toggle('hide', !this.error);
    }

    render() {
        super.render();
        this.fields.map(f => {
            let existing = this.shadowRoot.querySelector(`*[name='${f.name}'`);
            if (!existing && f.type == 'submit') existing = this.shadowRoot.querySelector('*[type="submit"');
            const v = this.values[f.name] || '';
            if (existing) {
                existing.value = v;
                if (f.type == 'submit') existing.value = f.value || 'Submit';

                return;
            }

            const row = document.importNode(
                this.templates['form-row'],
                true
            ).querySelector('div');

            const field = this.createField(f, v);
            if (!field) return;

            const icon = row.querySelector('zen-ui-icon');
            if (f.icon) {
                icon.type = f.icon;
                icon.color = f.iconColor || 'shade-5';
            } else icon.remove();

            row.appendChild(field);
            this.form.appendChild(row);
        });

        this.updateError();
    }

    createField(f, v) {
        let field = document.createElement('input');

        const keyup = () => {
            this.values = {
                ...this.values,
                ...{[f.name]: field.value}
            };
        };

        switch (f.type) {
            // case 'textarea':
            // field = document.createElement('textarea');
            // field.value = v;
            // field.name = f.name;
            // field.addEventListener('keyup', keyup);
            // break;

            case 'textarea':
                field = document.createElement('wc-wysiwyg');
                field.name = f.name;
                field.addEventListener('keyup', keyup);
                // TODO: Wait for ready
                setTimeout(() => {
                    field.value = v;
                }, 10);
                break;

            case 'text':
            case 'input':
            case 'password':
            case 'email':
                field.value = v;
                field.name = f.name;
                field.type = f.type;
                field.addEventListener('keyup', keyup);
                field.placeholder = f.placeholder;
                break;

            case 'submit':
                field.type = f.type;
                field.value = f.value || 'Submit';
                if (f.color) field.classList.add(f.color);
                break;

            default:
                console.warn(`Field type '${f.type}' is not supported`);

                return null;
        }

        return field;
    }


    submit(e) {
        e.preventDefault();
        e.stopPropagation();
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent('submit', false, false, {});
        this.dispatchEvent(event);

        return false;
    }
});
