import {Element, Form, Field} from 'origami-zen';
import HTML from './page-setup-start.html';

export default class PageSetupStart extends Element {
    constructor() {
        super(HTML, false, 'page-setup-start', false);
    }
}

window.customElements.define('page-setup-start', PageSetupStart);
