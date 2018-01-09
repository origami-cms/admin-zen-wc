import * as constants from 'actions/const';
import immutable from 'seamless-immutable';

export default (resource, func, key = 'id') => {
    const up = resource.toUpperCase();
    const singular = resource.slice(0, -1);
    const initialState = immutable({
        [resource]: [],
        loadedInitial: false,
        loading: {
            all: false,
            single: false
        }
    });

    return (state = initialState, action) => {
        const resourceList = state[resource].asMutable();

        switch (action.type) {
            case constants[`${up}_LOADING_SINGLE_START`]:
                return state.setIn(['loading', 'single'], true);
            case constants[`${up}_LOADING_SINGLE_END`]:
                return state.setIn(['loading', 'single'], false);

            case constants[`${up}_LOADING_ALL_START`]:
                return state.setIn(['loading', 'all'], true);
            case constants[`${up}_LOADING_ALL_END`]:
                return state.setIn(['loading', 'all'], false);


            case constants[`${up}_SET`]:
                if (!action[resource]) return state;
                else return state.merge({
                    [resource]: action[resource],
                    loadedInitial: true
                });


            case constants[`${up}_CREATED`]:
                resourceList.push(action[singular]);

                return state.set(resource, resourceList);


            case constants[`${up}_REMOVED`]:
                return state.set(
                    resource,
                    resourceList.filter(u => u[key] != action[key])
                );


            case constants[`${up}_UPDATED`]:
                let r;
                const rIndex = state[resource].findIndex(_r => {
                    if (_r[key] == action[key]) return r = _r;
                });

                return state.setIn(
                    [resource, rIndex],
                    r.merge(action[singular])
                );

            default:
                if (func) return func(state, action);
                else return state;
        }
    };
};
