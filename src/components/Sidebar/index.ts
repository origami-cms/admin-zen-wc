import {Element, Field, Form, Icon} from 'origami-zen';
import HTML from './sidebar.html';
import CSS from './sidebar.scss';
import logo from 'images/logo-mark.svg';
import logoText from 'images/logo-text.svg';


import connect from 'wc-redux';
import store from 'store';
import actions from 'actions';
import {BASE_URI} from 'const';
import State, {SidebarItem} from 'store/state';
import {Router, Link, MatchPathOptions} from 'wc-router';

@connect(
    store,
    (state: State) => ({
        me: state.Me,
        sidebar: state.App.sidebar
    }),
    {
        'sidebar-items-get': actions.App.getSidebarItems
    }
)
export default class Sidebar extends Element {
    router?: Router;
    logo?: HTMLImageElement;
    logoBottom?: HTMLImageElement;
    form?: Form;
    appsList?: HTMLUListElement;
    sidebar: {items: SidebarItem[]} = {items: []};

    search: Field[] = [
        {
            type: 'text',
            name: 'search',
            placeholder: 'Search',
            icon: 'search',
            iconColor: 'grey-300'
        }
    ];
    constructor() {
        super(HTML, CSS, 'Sidebar', false);
    }

    connectedCallback() {
        super.connectedCallback();
        let r: Router;
        this.router = r = document.querySelector('wc-router') as Router;
        if (!this.router.history) throw new Error('Router has no history');

        this.logo = this._root.querySelector('img.logo') as HTMLImageElement;
        this.logo.src = logo;
        this.appsList = this._root.querySelector('ul.apps') as HTMLUListElement;

        this.trigger('sidebar-items-get');
    }

    static get boundProps() {
        return ['me', 'sidebar'];
    }

    async propertyChangedCallback(prop: keyof Sidebar) {
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
        ).querySelector('li') as HTMLLIElement;

        const al = this.appsList as HTMLElement;
        al.innerHTML = '';

        this.sidebar.items.forEach(a => {
            const _li = li.cloneNode(true) as HTMLLIElement;
            (_li.querySelector('wc-link') as Link).to = a.path;
            const icon = _li.querySelector('zen-ui-icon') as Icon;
            icon.type = a.icon;
            icon.color = a.iconColor || 'white';
            (_li.querySelector('.app') as HTMLElement).classList.add(`gradient-${a.color}`);
            al.appendChild(_li);
        });
    }

    get app() {
        const r = this.router;
        if (!this.sidebar || !r) return false;

        return this.sidebar.items.find(i => Boolean(r.match(
            window.location.pathname,
            `${BASE_URI}${i.path}`
        )));
    }

}

window.customElements.define('zen-sidebar', Sidebar);

