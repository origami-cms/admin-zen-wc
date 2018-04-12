import { Element, Form, Field } from 'origami-zen';
import { Page } from 'store/state';
import { Router } from 'wc-router';
export default class PageEdit extends Element {
    router: Router | null;
    form: Form | null;
    page?: Page;
    errors?: object;
    constructor();
    static formFields: Field[];
    readonly pageId: any;
    connectedCallback(): void;
    static readonly boundProps: string[];
    propertyChangedCallback(prop: keyof PageEdit, oldV: any, newV: any): Promise<void>;
    save(): void;
}
