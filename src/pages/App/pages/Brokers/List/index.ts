import {Element} from 'origami-zen';
import HTML from './brokers-list.html';
import CSS from './brokers-list.scss';


import connect from 'wc-redux';
import store from 'store';
import actions from 'actions';
import State, {Broker} from 'store/state';
import {ImmutableObject} from 'seamless-immutable';

@connect(
    store,
    (state: State) => ({
        brokers: state.Brokers
    }),
    {
        'brokers-get': actions.Brokers.brokersGet,
        'title-set': actions.App.titleSet
    }
)
export default class brokersList extends Element {
    brokers?: ImmutableObject<Broker>;
    table?: HTMLElement;
    constructor() {
        super(HTML, CSS, false);
    }

    static get boundProps() {
        return ['brokers'];
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('brokers-get', [null, false]);
        this.trigger('title-set', ['brokers']);

        this.table = this._root.querySelector('zen-resource-table') as HTMLElement;
    }

    async propertyChangedCallback(prop: keyof brokersList, oldV: any, newV: any) {
        await this.ready();
        switch (prop) {
            case 'brokers':
                // TODO: Make type of table
                // @ts-ignore
                if (this.table) this.table.data = newV.brokers;
        }
    }
}

window.customElements.define('page-app-brokers-list', brokersList);
