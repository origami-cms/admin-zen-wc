import {Element} from 'origami-zen';
import HTML from './users.html';
import CSS from './users.scss';


import './List';
import './Edit';
import './Create';


class Users extends Element {
    constructor() {
        super(HTML, CSS.toString(), false);
    }
}

window.customElements.define('page-app-users', Users);
