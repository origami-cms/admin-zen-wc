import { Element } from 'origami-zen';
import { Auth } from 'store/state';
import './pages';
import { Router } from 'wc-router';
export default class App extends Element {
    auth?: Auth;
    router?: Router;
    constructor();
    static boundProps: string[];
    connectedCallback(): void;
    propertyChangedCallback(prop: keyof App, oldV: any, newV: any): Promise<void>;
}
