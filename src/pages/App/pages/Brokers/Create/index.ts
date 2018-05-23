import actions from 'actions';
import {Element, Field, Form} from 'origami-zen';
import store from 'store';
import State, {Broker} from 'store/state';
import connect from 'wc-redux';
import {Router} from 'wc-router';
import HTML from './broker-create.html';
import CSS from './broker-create.scss';


import img from 'images/icons/user/create.svg';


@connect(
    store,
    (state: State) => {
        // @ts-ignore this = brokerCreate
        const broker = state.Brokers.brokers.find(u => u.id === this.id);

        let u: Broker | false = false;
        if (broker) u = broker.asMutable({deep: true});

        return {broker: u, errors: state.Brokers.errors};
    },
    {
        'broker-create': actions.Brokers.brokersCreate,
        'title-set': actions.App.titleSet
    }
)
export default class brokerCreate extends Element {
    router: Router | null = null;
    form: Form | null = null;

    static formFields: Field[] = [
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
            value: 'Create'
        }
    ];


    constructor() {
        super(HTML, CSS.toString(), false);
    }


    connectedCallback() {
        super.connectedCallback();

        this.trigger('title-set', ['Create broker']);


        let r: Router;
        this.router = r = document.querySelector('wc-router') as Router;

        let f;
        this.form = f = this._root.querySelector('zen-ui-form') as Form;

        f.fields = (this.constructor as typeof brokerCreate).formFields;
        f.addEventListener('submit', this.submit.bind(this));
        f.addEventListener('change', this.render.bind(this));

        this.addEventListener('broker-create-done', (e: CustomEventInit) => {
            if (e.detail.id) r.push(`/brokers/${e.detail.id}`);
        });

        (this.querySelector('img') as HTMLImageElement).src = img;
    }

    static get boundProps() {
        return ['broker', 'errors'];
    }

    get firstName() {
        if (!this.form || !this.form.values.fname) return 'a broker';
        return this.form.values.fname;
    }

    // propertyChangedCallback(prop, oldV, newV) {
    //     switch (prop) {
    //         case 'errors':
    //     }
    // }


    submit() {
        if (!this.form) return this._error('Not initialised');
        this.trigger('broker-create', [this.form.values]);
    }
}

window.customElements.define('page-app-broker-create', brokerCreate);
