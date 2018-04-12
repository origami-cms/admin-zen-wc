/// <reference types="seamless-immutable" />
import immutable from 'seamless-immutable';
import { AnyAction } from 'redux';
import { App } from 'store/state';
declare const _default: (state: immutable.ImmutableObject<App> | undefined, action: AnyAction) => immutable.ImmutableObject<App>;
export default _default;
