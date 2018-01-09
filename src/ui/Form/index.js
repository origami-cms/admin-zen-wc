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

    async propertyChangedCallback(prop, oldV, newV) {
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
        if (!err) return;
        else err.classList.toggle('hide', !this.error);
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
        const field = document.createElement('input');

        switch (f.type) {
            case 'text':
            case 'input':
            case 'password':
            case 'email':
                field.value = v;
                field.name = f.name;
                field.type = f.type;
                field.addEventListener('keyup', () => {
                    this.values = {
                        ...this.values,
                        ...{[f.name]: field.value}
                    };
                });
                field.placeholder = f.placeholder;
                break;

            case 'submit':
                console.log('hereee', f.value || 'Submit');
                field.type = f.type;
                field.value = f.value || 'Submit';
                break;
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
