import query from 'json-query';
export default class Element extends HTMLElement {
    constructor() {
        super();

        this.templates = {};
        this._textNodeMap = new Map();

        this.attachShadow({mode: 'open'});

        this.css = '@import "/admin/origami.css";';

        this.constructor.boundProps.forEach(p => {
            let prop;

            Object.defineProperty(this, p, {
                get: () => prop,
                set: v => {
                    if (prop === v) return v;
                    const oldV = prop;
                    prop = v;
                    this.propertyChangedCallback(p, oldV, prop);
                    if (this.isConnected) this.render();

                    return v;
                },
                configurable: true
            });

            this[p] = this.constructor.defaultProps[p];
        });

        this._updateTemplates();
    }

    static get boundProps() { return []; }
    static get defaultProps() { return {}; }

    set html(v) {
        this.shadowRoot.innerHTML = v;
        this.css = this._css;
        this._updateTemplates();
        this._updateTextNodeMap();
        this.render();
    }

    set css(v) {
        this._css = v;
        const style = document.createElement('style');
        style.innerHTML = v;
        this.shadowRoot.insertBefore(style, this.shadowRoot.firstChild);
    }

    _updateTemplates() {
        const ts = Array.from(this.shadowRoot.querySelectorAll('template'));
        ts.forEach(t => {
            if (t.id) this.templates[t.id] = t.content;
        });
    }

    propertyChangedCallback() {
    }

    render() {
        const existing = Array.from(this._textNodeMap);
        for (const [node, {words, template}] of existing) {
            let replace = template;
            words.forEach(w => {
                let {value: replacement} = query(w, {data: this});
                if (replacement == undefined) replacement = '';
                const r = new RegExp(`{{${w}}}`, 'g');
                replace = replace.replace(r, replacement);
            });

            node.nodeValue = replace;
        }
    }


    trigger(event, detail) {
        this.shadowRoot.dispatchEvent(new CustomEvent(event, {
            composed: true,
            bubbles: true,
            detail
        }));
    }

    _updateTextNodeMap() {
        // TODO: Move this to a Mutation Observer
        this._textNodeMap = new Map();
        const nodes = document.createTreeWalker(this.shadowRoot, NodeFilter.SHOW_TEXT, NodeFilter.SHOW_TEXT);
        let node;
        while (node = nodes.nextNode()) {
            const template = node.nodeValue;

            // Retrieve all the {{var}} declerations in the template
            const m = template.match(/{{\s*[\w\.]+\s*}}/g);

            if (m) {
                const words = m.map(x => x.match(/[\w\.]+/)[0]);
                this._textNodeMap.set(node, {
                    words, template
                });

                this._textNodeMap.set(node, {words, template});
            }
        }
    }
}
