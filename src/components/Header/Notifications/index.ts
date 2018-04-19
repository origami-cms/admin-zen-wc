import {Element} from 'origami-zen';
import HTML from './notifications.html';
import CSS from './notifications.scss';


export default class Notifications extends Element {
    constructor() {
        super(HTML, CSS.toString(), 'Notifications', false);
    }
}

window.customElements.define('zen-header-notifications', Notifications);

