/**
 * Allows objects within state to be updated without affecting other data.
 *
 * const [state, setState] = useState({first: 1, second: 2});
 *
 * // results will be state = {first: 3} instead of {first: 3, second: 2}
 * setState({first: 3})
 *
 * // To resolve that you need to use object destructing every time
 * // results will be state = {first: 3, second: 2}
 * setState(prev => ({...prev, first: 3}))
 *
 * // To solve this, use stateReducer.
 * const [state, setState] = useReducer(stateReducer, {first: 1, second: 2});
 *
 * // results will be state = {first: 3, second: 2}
 * setState({first: 3})
 *
 * // you can also access the previous state callback if you want
 * // results will remain same, state = {first: 3, second: 2}
 * setState(prev => ({...prev, first: 3}))
 * @see https://stackoverflow.com/a/71093607
 * @param state
 * @param action
 */
export const stateReducer = (state, action) => ({
    ...state,
    ...(typeof action === 'function' ? action(state) : action),
});

/**
 * Custom hook for useReducer
 * @param initial
 * @param lazyInitializer
 * @returns {[*,(<A>(value: A) => void)]}
 */
const useReducer = (initial, lazyInitializer = null) => {
    const [state, setState] = React.useReducer(stateReducer, initial, init =>
        lazyInitializer ? lazyInitializer(init) : init
    );

    return [state, setState];
};

export default useReducer;