import { Element } from 'origami-zen';
export default class ResourceTableColumn extends Element {
    key?: string;
    static defaultProps: {
        data: never[];
        idKey: string;
    };
    static observedAttributes: string[];
    attributeChangedCallback(attr: string, oldV: any, newV: any): void;
}
