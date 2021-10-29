import { AlertActionCloseButton } from "@patternfly/react-core";


export interface StateContext {
    APIData: [];
    Suppliers: [];
    Customers: [];
    error: string;
    alerts: [];
    categories: [];
    trimcategories: [];
    package: [];
    termination: [];
    inventory: [];
}

function PreCat(data) {
    var temp :any = []
    temp.push({value: 'Select', label: 'Select', disabled: true})
    data.forEach((element)=>{
        let k = element['name']
        let j = element['SubCat']
        var temp2: any = []
        j.forEach(item => {
            temp2.push(item.name)   
        });
        var d = {value: k, label: k, disabled : false, sub: temp2}
        temp.push(d);
    });
    console.log(temp);
    return temp;
}
function PreTerPAk(data){
    var temp :any = []
    temp.push({value: 'Select', label: 'Select', disabled: true})
    data.forEach(element => {
        let k = element['name']
        var d = {value: k, label: k, disabled : false}
        temp.push(d);
    });
    return temp;
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
        case 'SET_CAT':
            return {
                ...state,
                categories: action.data,
                trimcategories: PreCat(action.data)
            }
        case 'SET_INV':
            return {
                ...state,
                inventory: action.data
            }
        case 'SET_TER':
            return {
                ...state,
                termination: PreTerPAk(action.data)
            }
        case 'SET_PKG':
            return {
                ...state,
                package: PreTerPAk(action.data)
            }
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
