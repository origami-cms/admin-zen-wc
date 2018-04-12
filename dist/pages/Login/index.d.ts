import { Element, Field, Form } from 'origami-zen';
import { Auth } from 'store/state';
import { Router } from 'wc-router';
export default class Login extends Element {
    router?: Router;
    email?: string;
    form?: Form;
    auth?: Auth;
    loginFormFields: Field[];
    constructor();
    static readonly boundProps: string[];
    connectedCallback(): Promise<void>;
    propertyChangedCallback(prop: keyof Login, oldV: any, newV: any): Promise<void>;
    login(email: string, password: string): void;
}
