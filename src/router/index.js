import HTML from './router.html';

class ZenApp extends HTMLElement {
    connectedCallback() {
        this.innerHTML = HTML;
    }
}
window.customElements.define('zen-router', ZenApp);
