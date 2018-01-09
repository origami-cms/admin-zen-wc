import {Element} from 'lib';
import HTML from './sidebar.html';
import CSS from './sidebar.scss';
import logo from 'images/logo-mark.svg';
import logoText from 'images/logo-text.svg';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
// import actions from 'actions';


class Sidebar extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();

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
        this.logo = this.shadowRoot.querySelector('img.logo');
        this.logo.src = logo;
        this.logoBottom = this.shadowRoot.querySelector('img.logo-text');
        this.logoBottom.src = logoText;

        this.form = this.shadowRoot.querySelector('zen-ui-form');
        this.form.fields = this.search;
        this.appsList = this.shadowRoot.querySelector('ul.apps');

        this.apps = [
            {
                icon: 'page',
                color: 'red',
                to: '/pages'
            },
            {
                icon: 'dollar',
                color: 'green',
                to: '/app/engagement'
            },
            {
                icon: 'messages',
                color: 'orange',
                to: '/app/engagement'
            },
            {
                icon: 'user',
                color: 'blue',
                to: '/users'
            }
        ];
    }

    static get boundProps() {
        return ['me', 'apps'];
    }

    propertyChangedCallback(prop, oldV, newV) {
        switch (prop) {
            case 'apps':
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

        this.apps.forEach(a => {
            const _li = li.cloneNode(true);
            _li.querySelector('wc-link').to = a.to;
            _li.querySelector('zen-ui-icon').type = a.icon;
            _li.classList.add(`gradient-${a.color}`);
            this.appsList.appendChild(_li);
        });
    }

}


class ConnectedSidebar extends connect(store, Sidebar) {
    _mapStateToProps(state) {
        return {
            me: state.Me
        };
    }
}

window.customElements.define('zen-sidebar', ConnectedSidebar);

