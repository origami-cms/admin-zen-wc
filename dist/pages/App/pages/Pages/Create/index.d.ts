import { Element, Form, Field } from 'origami-zen';
import { Router } from 'wc-router';
export default class PageCreate extends Element {
    router?: Router;
    form?: Form;
    static formFields: Field[];
    constructor();
    connectedCallback(): void;
    submit(): void;
}
