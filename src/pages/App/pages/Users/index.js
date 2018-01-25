import {Element} from 'lib';
import HTML from './users.html';
import CSS from './users.scss';


import './List';
import './Edit';


class Users extends Element {
    constructor() {
        super(HTML, CSS.toString());
    }
}

window.customElements.define('page-app-users', Users);
