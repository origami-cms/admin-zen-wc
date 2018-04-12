import actions from 'actions';
import {Element} from 'origami-zen';
import {ImmutableObject} from 'seamless-immutable';
import store from 'store';
import connect from 'wc-redux';
import State, {Page} from 'store/state';
import HTML from './pages-list.html';
import CSS from './pages-list.scss';



@connect(
    store,
    (state: State) => ({
        pages: state.Pages
    }),
    {
        'pages-get': actions.Pages.pagesGet,
        'title-set': actions.App.titleSet
    }
)
export default class PagesList extends Element {
    table?: HTMLElement;
    pages?: ImmutableObject<Page>;

    constructor() {
        super(HTML, CSS);

    }

    static boundProps = ['pages'];

    connectedCallback() {
        super.connectedCallback();
        this.trigger('pages-get', [null, false]);
        this.trigger('title-set', ['Pages']);

        this.table = this._root.querySelector('zen-resource-table') as HTMLElement;

    }

    async propertyChangedCallback(prop: keyof PagesList, oldV: any, newV: any) {
        await this.ready();
        switch (prop) {
            case 'pages':
                // TODO: Make type of table
                // @ts-ignore
                this.table.data = newV.pages;
        }
    }
}

window.customElements.define('page-app-pages-list', PagesList);
