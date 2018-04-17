import actions from 'actions';
import {Element} from 'origami-zen';
import store from 'store';
import State from 'store/state';
import connect from 'wc-redux';
import HTML from './page-setup-wizard.html';
import CSS from './page-setup-wizard.scss';
import {Router} from 'wc-router';



@connect(
    store,
    (state: State) => ({
        loading: state.Setup.loading.user,
        isSetup: state.Setup.setup
    }),
    {
        isSetup: actions.Setup.isSetup
    }
)
export default class PageSetupWizard extends Element {
    isSetup?: boolean;

    constructor() {
        super(HTML, CSS, 'page-setup-wizard', false);
    }

    static boundProps = ['isSetup'];

    connectedCallback() {
        super.connectedCallback();
        this.trigger('isSetup', {});
    }

    propertyChangedCallback(prop: keyof PageSetupWizard, oldV: any, newV: any) {
        switch (prop) {
            case 'isSetup':
                // If Origami is already setup, redirect to dashboard
                if (newV) (document.querySelector('wc-router') as Router).replace('/');

                break;
        }
    }

}

window.customElements.define('page-setup-wizard', PageSetupWizard);
