import _ from 'lodash';
import {Resource} from 'lib/API';
import * as c from 'actions/const';

export default name => {
    const r = new Resource(name).default();
    const funcs = {};

    ['create', 'get', 'update', 'remove'].forEach(a => {
        funcs[`${name}${_.upperFirst(a)}`] = r[a];
    });

    funcs[`${name}SetGroupId`] = groupId =>
        dispatch => dispatch({
            type: c[`${name}_GROUPID_SET`.toUpperCase()],
            groupId
        });

    return funcs;
};
