// https://gist.github.com/kevinpschaaf/995c9d1fd0f58fe021b174c4238b38c3#file-5-connect-element-mixin-js-L1

// This is a mixin that can be applied to custom elements, that codifies a simple
// pattern of connecting stateless elements to the redux store by mapping store
// state to element properties, and by mapping DOM events to store dispatch calls
// (inspired by concepts in https://github.com/reactjs/react-redux)

export const connect = (store, superClass) => class extends superClass {

    constructor() {
        super();
        // Map dispatch to events
        if (this._mapDispatchToEvents) {
            const eventMap = this._mapDispatchToEvents(store.dispatch);
            for (const type in eventMap) {
                this.addEventListener(type, event => {
                    event.stopImmediatePropagation();
                    eventMap[type](...event.detail || []);
                });
            }
        }
        // Map state to props
        if (this._mapStateToProps) {
            const setProps = this.setProperties
                ? props => this.setProperties(props)
                : props => Object.assign(this, props);
            const update = () => setProps(this._mapStateToProps(store.getState()));
            // Sync with store
            store.subscribe(update);
            update();
        }
    }

};
