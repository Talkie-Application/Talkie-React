import createDataContext from "./createDataContext";

const reducer = ( state, action ) => {
    switch( action.type ) {
        case 'set':
            return action.payload;
        case 'reset':
            return null;
        default:
            return null;
    }
}

const setID = dispatch => (payload) => {
    dispatch({type: 'set', payload});
}

const reset = dispatch => () => {
    dispatch({type: 'reset'});
}

export const { Context, Provider } =
    createDataContext(
        reducer,
        { setID, reset },
        null
    );