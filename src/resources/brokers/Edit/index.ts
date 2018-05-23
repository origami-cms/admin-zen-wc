import actions from 'actions';
import {Element, Field, Form, FormValues} from 'origami-zen';
import connect from 'wc-redux';
import store from '../../../store';
import State, {Broker} from '../../../store/state';
import HTML from './broker-edit.html';
import CSS from './broker-edit.scss';

@connect(
    store,
    (state: State, el: BrokerEdit) => {
        const broker = state.Brokers.brokers.find(u => u.id === el.resource);

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
export default class BrokerEdit extends Element {
    resource?: string;
    form: Form | null = null;
    broker?: Broker;
    errors?: object;


    static observedAttributes = ['resource'];
    static boundProps = ['broker', 'errors', 'resource'];
    static formFields: Field[] = [
        {
            name: 'id',
            type: 'text',
            disabled: true
        },
        {
            name: 'name',
            placeholder: 'Name',
            type: 'text'
        },
        {
            name: 'logo',
            placeholder: 'Logo URL',
            type: 'text'
        },
        {
            name: 'colorMain',
            placeholder: 'Color main',
            type: 'text'
        },
        {
            name: 'colorSecondary',
            placeholder: 'Color Secondary',
            type: 'text'
        },
        {
            name: 'colorNeutral',
            placeholder: 'Color Neutral',
            type: 'text'
        },
        {
            name: 'avatarName',
            placeholder: 'Avatar name',
            type: 'text',
            validate: {
                required: false
            }
        },
        {
            name: 'nextSteps',
            placeholder: 'Next steps',
            type: 'textarea',
            validate: {
                required: false
            }
        },
        {
            type: 'submit',
            name: '',
            value: 'Save'
        }
    ];


    constructor() {
        super(HTML, CSS, false);
    }


    connectedCallback() {
        super.connectedCallback();

        this.form = this._root.querySelector('zen-ui-form') as Form;
        this.form.fields = (this.constructor as typeof BrokerEdit).formFields;
        this.form.addEventListener('submit', this.save.bind(this));
    }

    attributeChangedCallback(attr: keyof BrokerEdit, oldV: any, newV: any) {
        switch (attr) {
            case 'resource':
                this[attr] = newV;
                break;
        }
    }

    async propertyChangedCallback(prop: keyof BrokerEdit, oldV: any, newV: any) {
        switch (prop) {
            case 'resource':
                if (!oldV && newV) {

                    this.trigger('broker-get', [this.resource]);
                    this.trigger('broker-properties-get', [this.resource]);
                }
                break;
            case 'broker':
                if (newV) {
                    await this.ready();
                    this.trigger('title-set', [newV.fname]);
                    (this.form as Form).values = newV;
                }
                break;

            case 'errors':
                // if (newV.get && this.router) this.router.push('/404');

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

        this.trigger('broker-update', [this.resource, f.values]);
    }
}

window.customElements.define('broker-edit', BrokerEdit);
