/// <reference types="seamless-immutable" />
import { Element } from 'origami-zen';
import { ImmutableObject } from 'seamless-immutable';
import { Page } from 'store/state';
export default class PagesList extends Element {
    table?: HTMLElement;
    pages?: ImmutableObject<Page>;
    constructor();
    static boundProps: string[];
    connectedCallback(): void;
    propertyChangedCallback(prop: keyof PagesList, oldV: any, newV: any): Promise<void>;
}
