import {Element, Checkbox, Button, ButtonGroup} from 'origami-zen';
import HTML from './resource-table.html';
import CSS from './resource-table.scss';
import pluralize from 'pluralize';
import {upperFirst} from 'lodash';

import ResourceTableColumn from './Column';
export * from './Column';


import connect from 'wc-redux';
import store from 'store';
import actions from 'actions';
import {Router} from 'wc-router';
import State from 'store/state';

export interface Data {
    [key: string]: any;
}

@connect(
    store,
    (state: State) => ({
        me: state.Me,
        sidebar: state.App.sidebar
    }),
    el => {
        // @ts-ignore
        return actions[upperFirst(el.resPlural)];
    }
)
export default class ResourceTable extends Element {
    resource?: string;
    selected: any[] = [];
    idKey: string = 'id';
    data: any[] = [];

    private _elementMap: Map<Data, HTMLElement> = new Map();
    private _buttonGroup?: ButtonGroup;
    private _table?: HTMLDivElement;
    private _observer?: MutationObserver;
    private _router?: Router;

    constructor() {
        super(HTML, CSS);
    }


    connectedCallback() {
        super.connectedCallback();

        this._buttonGroup = this._root.querySelector('header zen-ui-button-group') as ButtonGroup;
        this._table = this._root.querySelector('.table') as HTMLDivElement;
        this._observer = new MutationObserver(this.handleMutation.bind(this));
        this._observer.observe(this, {childList: true});
        this._router = document.querySelector('wc-router') as Router;
    }

    disconnectedCallback() {
        super.connectedCallback();
        if (this._observer) (this._observer as MutationObserver).disconnect();
    }

    static boundProps = ['data', 'idKey', 'selected', 'resource'];

    static observedAttributes = ['resource'];

    attributeChangedCallback(attr: string, oldV: string, newV: string) {
        switch (attr) {
            case 'resource':
                this[attr] = newV;
                break;
        }
    }


    async propertyChangedCallback(prop: keyof ResourceTable, oldV: any, newV: any) {
        await this.ready();

        switch (prop) {
            case 'selected':
                this.updateButtons();
                this.trigger('change');
                break;

            case 'resource':
                // @ts-ignore Provided by wc-redux
                this._bindEventsToDispatch();
                break;
        }
    }


    get resPlural() {
        return this.resource ? pluralize(this.resource) : false;
    }

    get resSingular() {
        return this.resource ? pluralize.singular(this.resource) : false;
    }


    renderHeader() {
        if (!this._table) return this._error('Not initialised');

        let header = this._table.querySelector('div.header') as HTMLElement;

        if (!header) {
            header = header = document.createElement('div');
            this._table.appendChild(header);
        }

        // TODO: Move to update function instead of replace
        header.innerHTML = '';


        const checkTD = document.createElement('span');
        checkTD.classList.add('fixed');
        const check = document.createElement('zen-ui-checkbox') as Checkbox;
        check.checked = this.selected.length === this.data.length;

        check.addEventListener('change', e => {
            this.select(Boolean((e.target as Checkbox).checked));
        });
        checkTD.appendChild(check);
        header.appendChild(checkTD);


        header.classList.add('header');
        Array.from(this.children).forEach(col => {
            const td = document.createElement('span');

            td.innerHTML = (col as ResourceTableColumn).key as string;
            header.appendChild(td);
        });

        header.appendChild(document.createElement('span'));
    }


    renderRows() {
        const t = this._table;
        if (!t) return this._error('Not initialised');

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
            if (!(ele as Element).isConnected) t.appendChild(ele);
        });
    }


    renderRow(ele: Data) {
        const tr = document.createElement('div');
        const checkTD = document.createElement('span');
        const check = document.createElement('zen-ui-checkbox') as Checkbox;


        check.checked = this.selected.includes(ele[this.idKey]);
        checkTD.appendChild(check);
        checkTD.classList.add('fixed');
        checkTD.addEventListener('change', e => {
            e.stopPropagation();
            this.select(ele[this.idKey]);
        });
        tr.appendChild(checkTD);


        Array.from(this.children).forEach(col => {
            const td = document.createElement('span');
            td.innerHTML = ele[(col as ResourceTableColumn).key as string];
            tr.appendChild(td);
        });


        const editTD = document.createElement('span');
        editTD.classList.add('text-right');
        const editButton = document.createElement('zen-ui-button') as Button;
        editButton.innerHTML = 'Edit';
        editButton.setAttribute('size', 'main');
        editButton.setAttribute('hollow', 'true');

        editButton.addEventListener('click', () => {
            this.actionOpen(ele.id);
        });
        editTD.appendChild(editButton);
        tr.appendChild(editTD);


        return tr;
    }


    updateRow(data: Data, ele: HTMLElement) {
        (ele.querySelector('zen-ui-checkbox') as Checkbox).checked =
            this.selected.includes(data[this.idKey]);

        Array.from(ele.children)
            // Remove 'checkbox'
            // Remove edit button
            .slice(1, -1)
            .forEach((td, i) => {
                td.innerHTML = data[(this.children[i] as ResourceTableColumn).key as string];
            });
    }

    updateButtons() {
        if (!this._buttonGroup) return this._error('Not initialised');

        type B = {[prop in keyof Button]?: any };
        let buttons: B[] = [];

        const buttonCreate: B = {
            innerHTML: 'create', color: 'green', onclick: () => this.actionCreate()
        };
        const buttonEdit: B = {
            innerHTML: 'edit', color: 'main', onclick: () => this.actionOpen()
        };
        const buttonRemove: B = {
            innerHTML: 'remove', color: 'red', onclick: this.actionRemove.bind(this)
        };


        switch (this.selected.length) {
            case 0:
                buttons = [buttonCreate];
                break;

            case 1:
                buttons = [buttonEdit, buttonRemove];
                break;

            default:
                buttons = [buttonRemove];
                break;
        }

        buttons.forEach(b => b.hollow = true);
        this._buttonGroup.buttons = buttons;
    }

    select(idOrBool: string | boolean) {
        if (idOrBool === true) this.selected = this.data.map(e => e[this.idKey]);
        else if (idOrBool === false) this.selected = [];

        else if (this.selected.includes(idOrBool)) {
            this.selected = this.selected.filter(_id => idOrBool !== _id);
        } else this.selected = [...this.selected, idOrBool];
    }


    async render() {
        super.render();
        await this.ready();
        if (this.isConnected) {
            this.renderHeader();
            this.renderRows();
        }
    }


    handleMutation(e: MutationRecord) {
        if (e.addedNodes || e.removedNodes) this.render();
    }


    actionOpen(res?: string) {
        if (!this._router) return this._error('Not initialised');
        this._router.push(`${this.resPlural}/${res || this.selected[0]}`);
    }


    actionRemove() {
        this.selected.forEach(id => {
            this.trigger(`${this.resPlural}Remove`, [id]);
        });
    }


    actionCreate() {
        if (!this._router) return this._error('Not initialised');
        this._router.push(`${this.resPlural}/create`);
    }
}

window.customElements.define('zen-resource-table', ResourceTable);
