import 'whatwg-fetch';
import {SERVER_API} from 'const';
import CODES from 'http-status-codes';

// Wraps API calls, sets the JWT in headers, basename etc
export default new class API {
    constructor() {
        this.base = SERVER_API;
        this._cache = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
    }


    get(url, cache = true, xhr = false) {
        return this[xhr ? '_xhr' : '_fetch']('GET', url, null, cache);
    }

    post(url, data, cache = false, xhr = false) {
        return this[xhr ? '_xhr' : '_fetch']('POST', url, data, cache);
    }

    put(url, data, cache = false, xhr = false) {
        return this[xhr ? '_xhr' : '_fetch']('PUT', url, data, cache);
    }

    delete(url, data, cache = false, xhr = false) {
        return this[xhr ? '_xhr' : '_fetch']('DELETE', url, data, cache);
    }

    get token() {
        return localStorage.getItem('token');
    }
    set token(v) {
        return localStorage.setItem('token', v);
    }


    reset() {
        this.token = undefined;
        this._cache = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
    }


    updateCache(method, url, value) {
        const cache = this._cache[method.toUpperCase()][url];
        if (cache) {
            this._cache[method.toUpperCase()][url] = value;

            return true;

        } else return false;
    }


    _fetch(method, url, data, cache) {
        if (cache && this._cache[method][url]) {
            return Promise.resolve(this._cache[method][url]);
        }
        const conf = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (this.token) conf.headers.Authorization = `Bearer ${this.token}`;
        if (data) {
            if (data instanceof FormData) {
                conf.body = data;
                delete conf.headers['Content-Type'];
            } else conf.body = JSON.stringify(data);
        }

        return fetch(this.base + url, conf)
            .then(r => r.json())
            .then(res => {
                if (res.statusCode >= CODES.BAD_REQUEST) {
                    const err = new Error(res.message);
                    err.code = res.statusCode;

                    throw err;
                }
                if (cache || this._cache[method][url]) {
                    this._cache[method][url] = res;
                }

                return res;
            });
    }

    _xhr(method, url, data) {
        const READYSTATE_OK = 4;
        const HTTP_OK = 200;

        const p = new Promise((res, rej) => {
            if (!this.token) return rej(new Error('No JWT stored'));

            let formData = new FormData();

            if (data instanceof FormData) {
                formData = data;
            } else {
                for (const [name, val] of Object.entries(data)) formData.append(name, val);
            }

            const xhr = new XMLHttpRequest();
            xhr.timeout = this.timeout;

            xhr.upload.addEventListener('progress', ({loaded, total}) => {
                p._trigger('progress', {
                    value: loaded,
                    max: total
                });
            });

            xhr.addEventListener('load', () => {
                p._trigger('progress', {
                    value: 100,
                    max: 100
                });
            });

            xhr.addEventListener('readystatechange', ({target}) => {
                if (xhr.readyState !== READYSTATE_OK) return;

                if (xhr.status !== HTTP_OK) {
                    return rej(new Error(xhr.status));
                }

                const {response} = target;

                const result = JSON.parse(response);
                const {error} = result;

                if (error) {
                    rej(new Error(error));
                } else {
                    res(result);
                }
            });

            xhr.open(method, this.base + url);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);

            xhr.send(formData);
        });

        p.handlers = {};
        p._trigger = (name, event) => {
            if (p.handlers[name]) {
                p.handlers[name].forEach(h => h(event));
            }
        };
        p.on = (name, handler) => {
            if (!p.handlers[name]) p.handlers[name] = [];

            p.handlers[name].push(handler);

            return p;
        };

        return p;
    }
}();
