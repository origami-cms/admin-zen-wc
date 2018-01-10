import {Element} from 'lib';
import HTML from './resource-table.html';
import CSS from './resource-table.scss';
import pluralize from 'pluralize';

import './Column';


window.customElements.define('zen-ui-resource-table', class ZenResourceTable extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();
        this._elementMap = new Map();

        this.table = this.shadowRoot.querySelector('.table');
        this.observer = new MutationObserver(this.handleMutation.bind(this));
        this.observer.observe(this, {childList: true});
        this.router = document.querySelector('wc-router');
    }

    disconnectedCallback() {
        this.observer.disconnect();
    }

    static get boundProps() {
        return ['data', 'idKey', 'selected'];
    }


    static get defaultProps() {
        return {
            data: [],
            idKey: 'id',
            selected: []
        };
    }

    static get observedAttributes() {
        return ['resource'];
    }

    attributeChangedCallback(attr, oldV, newV) {
        switch (attr) {
            case 'resource':
                this[attr] = newV;
                break;
        }
    }


    get resPlural() {
        return pluralize(this.resource);
    }

    get resSingular() {
        return pluralize.singular(this.resource);
    }


    renderRows() {
        const eles = this._elementMap;
        // Remove any old elements that the data no longer contains
        eles.forEach((ele, data) => {
            if (!this.data.find(e => e[this.idKey] === data[this.idKey])) {
                ele.remove();
                eles.delete(data);
            }
        });

        // Add in the new data
        this.data.forEach(ele => {
            const existing = Array.from(eles).find(([e]) => e.id === ele.id);

            if (!existing) {
                eles.set(ele, this.renderRow(ele));
            } else this.updateRow(ele, existing[1]);
        });

        eles.forEach(ele => {
            if (!ele.isConnected) this.table.appendChild(ele);
        });
    }


    renderRow(ele) {
        const tr = document.createElement('div');
        const checkTD = document.createElement('span');
        const check = document.createElement('zen-ui-checkbox');


        check.checked = this.selected.includes(ele[this.idKey]);
        checkTD.appendChild(check);
        checkTD.classList.add('fixed');
        checkTD.addEventListener('change', () => this.select(ele[this.idKey]));
        tr.appendChild(checkTD);


        Array.from(this.children).forEach(col => {
            const td = document.createElement('span');
            td.innerHTML = ele[col.key];
            tr.appendChild(td);
        });


        const editTD = document.createElement('span');
        editTD.classList.add('text-right');
        const editButton = document.createElement('zen-ui-button');
        editButton.innerHTML = 'Edit';
        editButton.setAttribute('size', 'main');
        editButton.addEventListener('click', () => {
            this.open(ele);
        });
        editTD.appendChild(editButton);
        tr.appendChild(editTD);


        return tr;
    }


    updateRow(data, ele) {
        ele.querySelector('zen-ui-checkbox').checked = this.selected.includes(data[this.idKey]);
        Array.from(ele.children)
            // Remove 'checkbox'
            // Remove edit button
            .slice(1, -1)
            .forEach((td, i) => {
                td.innerHTML = data[this.children[i].key];
            });
    }


    select(id) {
        if (this.selected.includes(id)) {
            this.selected = this.selected.filter(_id => id != _id);
        } else this.selected = [...this.selected, id];
    }


    async render() {
        super.render();
        await this.ready();
        if (this.isConnected) this.renderRows();
    }


    open(res) {
        this.router.push(`${this.resPlural}/${res.id}`);
    }


    handleMutation(e) {
        if (e.addedNodes || e.removedNodes) this.render();
    }
});
