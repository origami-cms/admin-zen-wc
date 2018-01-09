import API from './API';

export default class Resource {
    constructor(resource) {
        this.resource = resource;
        this.getSize = 50;
    }
    get singular() { return this.resource.slice(0, -1); }
    get lower() { return this.resource.toLowerCase(); }
    get upper() { return this.resource.toUpperCase(); }

    default() {
        return {
            create: this.create(),
            get: this.get(),
            update: this.update(),
            remove: this.remove()
        };
    }

    create() {
        return dispatch =>
            data => {
                dispatch({type: `${this.upper}_CREATING_START`});

                return API.post(`/${this.lower}`, data)
                    .then(json => {
                        dispatch({
                            type: `${this.upper}_CREATED`,
                            [this.singular]: json.data
                        });
                        dispatch({type: `${this.upper}_CREATING_END`});

                        return json.data;
                    })
                    .catch(error => {
                        dispatch({type: `${this.upper}_CREATE_ERROR`, error});
                        dispatch({type: `${this.upper}_CREATING_END`});
                    });
            };
    }

    get() {
        return dispatch =>
            (id, cache, pagination = {}, qs) => {
                const loading = `${this.upper}_LOADING_${id ? 'SINGLE' : 'ALL'}_`;
                dispatch({type: `${loading}START`});

                const p = pagination || {};
                if (!p.items) p.items = this.getSize;
                const _qs = this._qs(p, qs);

                return API.get(`/${this.lower}/${id || ''}${_qs}`, cache)
                    .then(json => {
                        const data = id ? [json.data] : json.data;
                        dispatch({
                            type: `${this.upper}_SET`,
                            [this.lower]: data,
                            _pages: json.pages,
                            _page: json.page,
                            _sort: json.sort,
                            _filter: json.filter
                        });
                        dispatch({type: `${loading}END`});

                        return data;
                    })
                    .catch(error => {
                        dispatch({type: `${this.upper}_GET_ERROR`, error});
                        dispatch({type: `${loading}END`});
                    });
            };
    }

    update() {
        return dispatch =>
            (id, data) =>
                API.put(`/${this.lower}/${id}`, data)
                    .then(json => {
                        dispatch({type: `${this.upper}_UPDATED`, [this.singular]: json.data, id});

                        return json.data;
                    })
                    .catch(error => {
                        dispatch({type: `${this.upper}_UPDATE_ERROR`, error});
                    });
    }

    remove() {
        return dispatch =>
            idOrArray => {
                const run = _id => {
                    API.delete(`/${this.lower}/${_id}`)
                        .then(() => {
                            dispatch({type: `${this.upper}_REMOVED`, id: _id});
                        })
                        .catch(error => {
                            dispatch({type: `${this.upper}_REMOVED_ERROR`, error});
                        });
                };
                if (typeof idOrArray === 'string') run(idOrArray);
                else idOrArray.forEach(run);
            };
    }

    _qs(...rest) {
        // eslint-disable-next-line prefer-template
        return '?' +
            Object.entries(
                [...rest].reduce((combine, obj) => ({...combine, ...obj}), {})
            )
                .map(([key, value]) => `${key}=${value}`)
                .join('&');
    }
}
