/// <reference types="seamless-immutable" />
import { AnyAction } from 'redux';
import immutable from 'seamless-immutable';
import { Me } from 'store/state';
export { ResourceState } from 'origami-zen';
declare const _default: (state: immutable.ImmutableObject<Me> | undefined, action: AnyAction) => immutable.ImmutableObject<Me>;
export default _default;
