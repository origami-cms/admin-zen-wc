import {Element} from 'origami-zen';
import HTML from './brokers.html';
import CSS from './brokers.scss';


import './List';
import './Edit';
import './Create';


class brokers extends Element {
    constructor() {
        super(HTML, CSS.toString(), false);
    }
}

window.customElements.define('page-app-brokers', brokers);
