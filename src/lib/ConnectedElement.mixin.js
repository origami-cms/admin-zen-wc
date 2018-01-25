// https://gist.github.com/kevinpschaaf/995c9d1fd0f58fe021b174c4238b38c3#file-5-connect-element-mixin-js-L1

// This is a mixin that can be applied to custom elements, that codifies a simple
// pattern of connecting stateless elements to the redux store by mapping store
// state to element properties, and by mapping DOM events to store dispatch calls
// (inspired by concepts in https://github.com/reactjs/react-redux)

export const connect = (store, superClass) => class extends superClass {

    constructor() {
        super();
        this._eventDispatchMap = {};
        this._bindEventsToDispatch();
    }

    _bindEventsToDispatch() {
        // Remove old events
        for (const [type, event] of Object.entries(this._eventDispatchMap)) {
            this.removeEventListener(type, event);
        }
        this._eventDispatchMap = {};

        // Map dispatch to events
        if (this.mapDispatchToEvents) {
            for (const [type, func] of Object.entries(this.mapDispatchToEvents)) {
                this._eventDispatchMap[type] = event => {
                    event.stopImmediatePropagation();
                    func(store.dispatch)(...event.detail || []);
                };
                this.addEventListener(type, this._eventDispatchMap[type]);
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
