import {Element, Checkbox, Button, ButtonGroup, Icon, Tooltip, VerticalMenu} from 'origami-zen';
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
    private _table?: HTMLDivElement;
    private _observer?: MutationObserver;
    private _router?: Router;

    constructor() {
        super(HTML, CSS);

        console.log('creating ersource table');
    }


    connectedCallback() {

        super.connectedCallback();

        this._table = this._root.querySelector('.table') as HTMLDivElement;
        this._observer = new MutationObserver(this.handleMutation.bind(this));
        this._observer.observe(this, {childList: true});
        this._router = document.querySelector('wc-router') as Router;
    }

    disconnectedCallback() {
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

    private get _buttonGroup() {
        return this._root.querySelector('header zen-ui-button-group') as ButtonGroup;
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
        checkTD.classList.add('icon');
        const check = document.createElement('zen-ui-checkbox') as Checkbox;
        check.checked = this.selected.length === this.data.length;
        check.size = 'medium';

        check.addEventListener('change', e => {
            this.select(Boolean((e.target as Checkbox).checked));
        });
        checkTD.appendChild(check);
        header.appendChild(checkTD);


        header.classList.add('header');
        Array.from(this.children).forEach(col => {
            const td = document.createElement('span');
            if (col.hasAttribute('icon')) td.classList.add('icon');

            td.innerHTML = (col as ResourceTableColumn).header as string;
            header.appendChild(td);
        });

        const editCol = document.createElement('span');
        editCol.classList.add('icon');
        header.appendChild(editCol);
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
        check.size = 'medium';


        check.checked = this.selected.includes(ele[this.idKey]);
        checkTD.appendChild(check);
        checkTD.classList.add('icon');
        checkTD.addEventListener('change', e => {
            e.stopPropagation();
            this.select(ele[this.idKey]);
        });
        tr.appendChild(checkTD);


        Array.from(this.children).forEach((col, i) => {
            const td = document.createElement('span');

            const c = this.children[i] as ResourceTableColumn;
            if (c.hasAttribute('icon')) td.classList.add('icon');

            td.innerHTML = c.content(ele);

            tr.appendChild(td);
        });


        const editTD = document.createElement('span');
        editTD.classList.add('icon');
        const editIcon = document.createElement('zen-ui-icon') as Icon;
        editIcon.type = 'menu';
        editIcon.color = 'grey-500';
        editIcon.setAttribute('size', 'medium');

        editIcon.addEventListener('click', () => {
            this.openMenu(ele, tr);
        });
        editTD.appendChild(editIcon);
        tr.appendChild(editTD);


        return tr;
    }


    updateRow(data: Data, ele: HTMLElement) {
        const selected = this.selected.includes(data[this.idKey]);
        (ele.querySelector('zen-ui-checkbox') as Checkbox).checked = selected;
        ele.classList.toggle('selected', selected);

        Array.from(ele.children)
            // Remove 'checkbox'
            // Remove edit button
            .slice(1, -1)
            .forEach((td, i) => {
                td.innerHTML = (this.children[i] as ResourceTableColumn).content(data);
            });
    }

    updateButtons() {
        console.log(this._buttonGroup, this._root.querySelector('header zen-ui-button-group'));

        if (!this._buttonGroup) return this._error('Not initialised');

        type B = {[prop in keyof Button]?: any };
        let buttons: B[] = [];

        const buttonCreate: B = {
            innerHTML: 'create', icon: 'add', color: 'green', onclick: () => this.actionCreate()
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

        // buttons.forEach(b => b.hollow = true);
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
        const modal = this._renderTemplate('edit-resource').firstElementChild as Element;
        modal.id = `modal-edit-${this.resource}`;
        const edit = document.createElement(`${this.resource}-edit`);
        edit.setAttribute('resource', res || this.selected[0]);
        modal.appendChild(edit);
        document.body.appendChild(modal);
        // if (!this._router) return this._error('Not initialised');
        // this._router.push(`/${this.resPlural}/${res || this.selected[0]}`);
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


    openMenu(data: Data, row: HTMLElement) {
        const tt = this._renderTemplate('menu').firstElementChild as Tooltip;
        tt.for = row.querySelector('zen-ui-icon') as HTMLElement;
        tt.removeable = true;
        const menu = tt.querySelector('zen-ui-vertical-menu') as VerticalMenu;
        menu.items = [
            {
                icon: 'edit',
                content: 'Edit',
                color: 'alt',
                action: () => this.actionOpen(data.id)
            }
        ];
        row.appendChild(tt);
    }
}

window.customElements.define('zen-resource-table', ResourceTable);
