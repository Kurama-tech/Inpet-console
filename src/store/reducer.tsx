import { AlertActionCloseButton } from "@patternfly/react-core";


export interface StateContext {
    APIData: [];
    Suppliers: [];
    Customers: [];
    error: string;
    alerts: [];
}



const Reducer = (state, action) => {
    switch (action.type) {
        case 'APIData':
            return {
                ...state,
                APIData: action.data
            };
        case 'APISuppliers':
            return {
                ...state,
                Suppliers: action.data
            };
        case 'APICustomers':
            return {
                ...state,
                Customers: action.data
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.data
            };
        case 'ADD_Alert':
            return {
                ...state,
                alerts: state.alerts.concat(action.data)
            }
        case 'REMOVE_Alert':
            return {
                ...state,
                alerts: state.alerts.filter(el => el.key !== action.data)
            };
        default:
            return state;
    }
};

export default Reducer;
