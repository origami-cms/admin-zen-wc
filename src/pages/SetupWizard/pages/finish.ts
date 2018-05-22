import {Element, Form, Field} from 'origami-zen';
import HTML from './page-setup-finish.html';
import 'images/placeholders/dashboard.svg';
export default class PageSetupFinish extends Element {
    constructor() {
        super(HTML, false, false);
    }
}

window.customElements.define('page-setup-finish', PageSetupFinish);
