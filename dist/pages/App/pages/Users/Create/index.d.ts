import { Element, Field, Form } from 'origami-zen';
import { Router } from 'wc-router';
export default class UserCreate extends Element {
    router: Router | null;
    form: Form | null;
    static formFields: Field[];
    constructor();
    connectedCallback(): void;
    static readonly boundProps: string[];
    submit(): void;
}
