import {Element, Form, Field} from 'origami-zen';
import HTML from './page-setup-start.html';

import logoAnimated from 'images/logo-animated.svg';


export default class PageSetupStart extends Element {
    constructor() {
        super(HTML, false, false);
        const logo = logoAnimated;
    }
}

window.customElements.define('page-setup-start', PageSetupStart);
