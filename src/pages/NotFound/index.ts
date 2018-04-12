import {Element} from 'origami-zen';
import HTML from './not-found.html';
import CSS from './not-found.scss';


import connect from 'wc-redux';
import store from 'store';
import actions from 'actions';

@connect(
    store,
    () => ({}),
    {
        'title-set': actions.App.titleSet
    }
)
export default class NotFound extends Element {
    constructor() {
        super(HTML, CSS);
    }
    static get boundProps() {return [];}

    connectedCallback() {
        super.connectedCallback();
        this.trigger('title-set', ['Not found']);
    }
}


window.customElements.define('page-not-found', NotFound);
