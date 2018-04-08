import {Element} from 'lib';
import HTML from './not-found.html';
import CSS from './not-found.scss';


import {connect} from 'lib/ConnectedElement.mixin.js';
import store from 'store';
import actions from 'actions';


class NotFound extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('title-set', ['Not found']);
    }
}

class ConnectedNotFound extends connect(store, NotFound) {
    get mapDispatchToEvents() {
        return {
            'title-set': actions.App.titleSet
        };
    }
}


window.customElements.define('page-not-found', ConnectedNotFound);
