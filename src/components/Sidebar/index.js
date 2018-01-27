import {Element} from 'lib';
import HTML from './sidebar.html';
import CSS from './sidebar.scss';
import logo from 'images/logo-mark.svg';
import logoText from 'images/logo-text.svg';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class Sidebar extends Element {
    constructor() {
        super(HTML, CSS.toString());
        this.search = [
            {
                type: 'text',
                name: 'search',
                placeholder: 'Search',
                icon: 'search',
                iconColor: 'shade-3'
            }
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this.logo = this.shadowRoot.querySelector('img.logo');
        this.logo.src = logo;
        this.logoBottom = this.shadowRoot.querySelector('img.logo-text');
        this.logoBottom.src = logoText;

        this.form = this.shadowRoot.querySelector('zen-ui-form');
        this.form.fields = this.search;
        this.appsList = this.shadowRoot.querySelector('ul.apps');

        this.trigger('sidebar-items-get');
    }

    static get boundProps() {
        return ['me', 'sidebar'];
    }

    async propertyChangedCallback(prop) {
        switch (prop) {
            case 'sidebar':
                await this.ready();
                this.renderApps();
                break;
        }
    }

    renderApps() {
        const li = document.importNode(
            this.templates['app'],
            true
        ).querySelector('li');

        this.appsList.innerHTML = '';

        this.sidebar.items.forEach(a => {
            const _li = li.cloneNode(true);
            _li.querySelector('wc-link').to = a.to;
            const icon = _li.querySelector('zen-ui-icon');
            icon.type = a.icon;
            icon.color = a.iconColor || 'white';
            _li.querySelector('span.name').innerHTML = a.name;
            _li.classList.add(`gradient-${a.color}`);
            this.appsList.appendChild(_li);
        });
    }

}


class ConnectedSidebar extends connect(store, Sidebar) {
    _mapStateToProps(state) {
        return {
            me: state.Me,
            sidebar: state.App.sidebar
        };
    }
    get mapDispatchToEvents() {
        return {
            'sidebar-items-get': actions.App.getSidebarItems
        };
    }
}

window.customElements.define('zen-sidebar', ConnectedSidebar);

