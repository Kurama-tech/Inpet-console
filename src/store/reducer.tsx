

export interface StateContext {
    APIData: [];
    error: string;
}



const Reducer = (state, action) => {
    switch (action.type) {
        case 'APIData':
            return {
                ...state,
                APIData: action.data
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.data
            };
        default:
            return state;
    }
};

export default Reducer;
