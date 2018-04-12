/// <reference types="seamless-immutable" />
import { AnyAction } from 'redux';
import immutable from 'seamless-immutable';
import { Setup } from 'store/state';
export { ResourceState } from 'origami-zen';
declare const _default: (state: immutable.ImmutableObject<Setup> | undefined, action: AnyAction) => immutable.ImmutableObject<Setup>;
export default _default;
