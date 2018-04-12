import { Element } from 'origami-zen';
export default class PageSetupWizard extends Element {
    isSetup?: boolean;
    constructor();
    static boundProps: string[];
    connectedCallback(): void;
    propertyChangedCallback(prop: keyof PageSetupWizard, oldV: any, newV: any): void;
}
