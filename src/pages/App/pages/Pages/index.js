import {Element} from 'lib';
import HTML from './pages.html';
import CSS from './pages.scss';


import './List';
import './Edit';


class Pages extends Element {
    constructor() {
        super(HTML, CSS.toString());
    }
}

window.customElements.define('page-app-pages', Pages);
