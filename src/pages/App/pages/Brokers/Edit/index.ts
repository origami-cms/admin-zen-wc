import actions from 'actions';
import {Element, Form, Field, FormValues} from 'origami-zen';
import store from 'store';
import State, {Broker} from 'store/state';
import connect from 'wc-redux';
import {Router} from 'wc-router';
import HTML from './broker-edit.html';
import CSS from './broker-edit.scss';



@connect(
    store,
    (state: State, el: brokerEdit) => {
        // @ts-ignore this = brokerCreate
        const broker = state.Brokers.brokers.find(u => u.id === el.brokerId);

        let u: Broker | false = false;
        if (broker) u = broker.asMutable({deep: true});

        return {broker: u, errors: state.Brokers.errors};
    },
    {
        'broker-get': actions.Brokers.brokersGet,
        'broker-update': actions.Brokers.brokersUpdate,
        'title-set': actions.App.titleSet
    }
)
export default class brokerEdit extends Element {
    router?: Router;
    form: Form | null = null;
    broker?: Broker;
    errors?: object;
    brokerId?: string;

    constructor() {
        super(HTML, CSS.toString(), false);
    }

    static formFields: Field[] = [
        {
            name: 'name',
            placeholder: 'name',
            type: 'text'
        },
        {
            name: 'logo',
            placeholder: 'logo',
            type: 'text'
        },
        {
            name: 'colorMain',
            placeholder: 'colorMain',
            type: 'text'
        },
        {
            name: 'colorSecondary',
            placeholder: 'colorSecondary',
            type: 'text'
        },
        {
            name: 'colorNeutral',
            placeholder: 'colorNeutral',
            type: 'text'
        },
        {
            type: 'submit',
            name: '',
            value: 'Save'
        }
    ];

    connectedCallback() {
        console.log('here');

        super.connectedCallback();
        this.router = document.querySelector('wc-router') as Router;
        this.brokerId = this.router.params.id;
        console.log(this.brokerId);


        this.trigger('broker-get', [this.brokerId]);
        this.trigger('broker-properties-get', [this.brokerId]);


        this.form = this._root.querySelector('zen-ui-form') as Form;
        this.form.fields = (this.constructor as typeof brokerEdit).formFields;
        this.form.addEventListener('submit', this.save.bind(this));


        this.form.values = this.broker as FormValues;
    }

    static get boundProps() {
        return ['broker', 'errors'];
    }

    async propertyChangedCallback(prop: keyof brokerEdit, oldV: any, newV: any) {
        switch (prop) {
            case 'broker':
                if (newV) {
                    await this.ready();
                    this.trigger('title-set', [newV.fname]);
                    (this.form as Form).values = newV;
                }
                break;

            case 'errors':
                if (newV.get && this.router) this.router.push('/404');

        }
    }


    save() {
        const f = this.form;
        if (!f) return this._error('Not initialised');
        f.values.data = {};
        delete f.values.properties;

        Object.keys(f.values)
            .filter(k => (/^data\./).test(k))
            .map(k => ((/^data\.(.+)/).exec(k) as RegExpExecArray)[1])
            .forEach(k => {
                f.values.data[k] = f.values[`data.${k}`];
                delete f.values[`data.${k}`];
            });

        this.trigger('broker-update', [this.brokerId, f.values]);
    }
}

window.customElements.define('page-app-broker-edit', brokerEdit);
