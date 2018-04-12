import { Element } from 'origami-zen';
export interface Data {
    [key: string]: any;
}
export default class ResourceTable extends Element {
    resource?: string;
    selected: any[];
    idKey: string;
    data: any[];
    private _elementMap;
    private _buttonGroup?;
    private _table?;
    private _observer?;
    private _router?;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    static boundProps: string[];
    static observedAttributes: string[];
    attributeChangedCallback(attr: string, oldV: string, newV: string): void;
    propertyChangedCallback(prop: keyof ResourceTable, oldV: any, newV: any): Promise<void>;
    readonly resPlural: string | boolean;
    readonly resSingular: string | boolean;
    renderHeader(): void;
    renderRows(): void;
    renderRow(ele: Data): HTMLDivElement;
    updateRow(data: Data, ele: HTMLElement): void;
    updateButtons(): void;
    select(idOrBool: string | boolean): void;
    render(): Promise<void>;
    handleMutation(e: MutationRecord): void;
    actionOpen(res?: string): void;
    actionRemove(): void;
    actionCreate(): void;
}
