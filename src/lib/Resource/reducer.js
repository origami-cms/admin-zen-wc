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

        const findIndexByKey = res =>
            resourceList.findIndex(r => r[key] === res[key]);


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
                // If there is no resource, return state
                if (!action[resource]) return state;


                let updated = state;

                action[resource].forEach(res => {
                    const existing = findIndexByKey(res);

                    // If there is an existing resource that matches the id,
                    // then update it
                    if (existing >= 0) updated = updated.setIn([resource, existing], {
                        ...state[resource][existing],
                        ...res
                    });
                    // Otherwise merge the resource into the array
                    else {
                        updated = updated.merge({
                            [resource]: [
                                ...updated[resource],
                                res
                            ],
                            loadedInitial: true
                        });
                    }
                });

                return updated;


            case constants[`${up}_CREATED`]:
                resourceList.push(action[singular]);

                return state.set(resource, resourceList);


            case constants[`${up}_REMOVED`]:
                return state.set(
                    resource,
                    resourceList.filter(u => u[key] != action[key])
                );


            case constants[`${up}_UPDATED`]:
                const index = findIndexByKey(action[singular]);

                const s = state.setIn(
                    [resource, index],
                    {
                        ...state[resource][index],
                        ...action[singular]
                    }
                );

                return s;


            default:
                if (func) return func(state, action);
                else return state;
        }
    };
};
