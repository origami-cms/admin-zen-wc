import { Element, Field } from 'origami-zen';
export default class PageSetupUser extends Element {
    loading: boolean;
    error?: string;
    fields: Field[];
    private _form?;
    private _router?;
    private _btnNext?;
    static boundProps: string[];
    constructor();
    connectedCallback(): void;
    propertyChangedCallback(prop: keyof PageSetupUser, oldV: any, newV: any): void;
    private _submit();
}
