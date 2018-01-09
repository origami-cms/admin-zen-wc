import {Element} from 'lib';
import HTML from './not-found.html';
import CSS from './not-found.scss';


class NotFound extends Element {
    constructor() {
        super();
        this.html = HTML;
        this.css = CSS.toString();
    }
}

window.customElements.define('page-not-found', NotFound);
