import { Element } from 'origami-zen';
import { Auth } from 'store/state';
import { Router } from 'wc-router';
export default class Logout extends Element {
    auth?: Auth;
    router?: Router;
    connectedCallback(): void;
    static readonly boundProps: string[];
    propertyChangedCallback(prop: keyof Logout, oldV: any, newV: any): Promise<void>;
}
