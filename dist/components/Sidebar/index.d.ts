import { Element, Field, Form } from 'origami-zen';
import { SidebarItem } from 'store/state';
import { Router } from 'wc-router';
export default class Sidebar extends Element {
    router?: Router;
    logo?: HTMLImageElement;
    logoBottom?: HTMLImageElement;
    form?: Form;
    appsList?: HTMLUListElement;
    sidebar: {
        items: SidebarItem[];
    };
    search: Field[];
    constructor();
    connectedCallback(): void;
    static readonly boundProps: string[];
    propertyChangedCallback(prop: keyof Sidebar): Promise<void>;
    renderApps(): void;
    readonly appContainer: HTMLElement | null;
    readonly app: boolean | SidebarItem | undefined;
    open(a: SidebarItem): void;
    close(): void;
    private _updateApp();
}
