import axios, { AxiosResponse, AxiosError } from "axios";

type ApiResponse = {
    code: number;
    data: any;
};

const API_URL = (process.env.REACT_APP_API_SERVER_URL || 'http://inpet-api-server-msawood-stage.apps.sandbox-m2.ll9k.p1.openshiftapps.com/api')

async function getSuppliers(){
    const result: ApiResponse = { code: 0, data: {} };
    const uri = API_URL + '/get/suppliers';
    await axios.get(uri).then((res: AxiosResponse) => {
        result.code = res.status;
        result.data = res.data;
    }).catch((err) => {
        console.log(err);
        result.code = err.response.status;
        result.data = err.response.data;
    });
    return result;
}

async function postCallCustSuppliers(data :any, mode=0){
    const result: ApiResponse = { code: 0, data: {} };
    let subPath = '/add/supplier';
    if (mode === 1) subPath = '/add/customers';
    const uri = API_URL + subPath;
    await axios.post(uri, data).then((res: AxiosResponse) => {
        result.code = res.status;
        result.data = res.data;
    }).catch((err) => {
        console.log(err);
        result.code = err.response.status;
        result.data = err.response.data;
    });
    return result;
}

async function putCallCustSupply(data:any, mode=0){
    const result: ApiResponse = { code: 0, data: {} };
    let subPath = '/add/supplier';
    if (mode === 1) subPath = '/add/customers';
    const uri = API_URL + subPath;
}


export {getSuppliers, postCallCustSuppliers}