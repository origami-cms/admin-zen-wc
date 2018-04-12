/// <reference types="seamless-immutable" />
import { Element } from 'origami-zen';
import { User } from 'store/state';
import { ImmutableObject } from 'seamless-immutable';
export default class UsersList extends Element {
    users?: ImmutableObject<User>;
    table?: HTMLElement;
    constructor();
    static readonly boundProps: string[];
    connectedCallback(): void;
    propertyChangedCallback(prop: keyof UsersList, oldV: any, newV: any): Promise<void>;
}
