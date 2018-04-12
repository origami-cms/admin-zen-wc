import { Element, Form, Field } from 'origami-zen';
import { User } from 'store/state';
import { Router } from 'wc-router';
export default class UserEdit extends Element {
    router: Router | null;
    form: Form | null;
    user?: User;
    errors?: object;
    constructor();
    static formFields: Field[];
    readonly userId: string | false;
    connectedCallback(): void;
    static readonly boundProps: string[];
    propertyChangedCallback(prop: keyof UserEdit, oldV: any, newV: any): Promise<void>;
    save(): void;
}
