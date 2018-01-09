import {Element} from 'lib';
import HTML from './resource-table.html';
import CSS from './resource-table.scss';

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
    }

    connectedCallback() {
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
            if (!eles.get(ele)) eles.set(ele, this.renderRow(ele));
            else this.updateRow(ele);
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
        checkTD.classList.add('check');
        checkTD.addEventListener('change', () => this.select(ele[this.idKey]));
        tr.appendChild(checkTD);


        Array.from(this.children).forEach(col => {
            const td = document.createElement('span');
            td.innerHTML = ele[col.key];
            tr.appendChild(td);
        });

        return tr;
    }


    updateRow(data) {
        const ele = this._elementMap.get(data);
        ele.querySelector('zen-ui-checkbox').checked = this.selected.includes(data[this.idKey]);
    }


    select(id) {
        if (this.selected.includes(id)) {
            this.selected = this.selected.filter(_id => id != _id);
        } else this.selected = [...this.selected, id];
    }


    render() {
        super.render();
        if (this.isConnected) this.renderRows();
    }


    handleMutation(e) {
        if (e.addedNodes || e.removedNodes) this.render();
    }
});
