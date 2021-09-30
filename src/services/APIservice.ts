import axios, { AxiosResponse, AxiosError } from "axios";

type ApiResponse = {
    code: number;
    data: any;
};

const API_URL = (process.env.REACT_APP_API_SERVER_URL || 'http://inpet-api-server-msawood-stage.apps.sandbox-m2.ll9k.p1.openshiftapps.com/api')

async function getCustSuppliers(mode=0){
    const result: ApiResponse = { code: 0, data: {} };
    let subPath ='/get/suppliers';
    if (mode === 1) subPath = '/get/customers';
    const uri = API_URL + subPath;
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

async function deleteCustSuppliers(mode=0, id:string){
    const result: ApiResponse = { code: 0, data: {} };
    let subPath ='/delete/supplier/' + id;
    if (mode === 1) subPath = '/delete/customer/' +id;
    const uri = API_URL + subPath;
    await axios.delete(uri).then((res: AxiosResponse) => {
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

async function putCallCustSupply(id:any, sid:any, data:any, mode=0){
    const result: ApiResponse = { code: 0, data: {} };
    let subPath = '/edit/supplier/'+ id+ '/' + sid;
    if (mode === 1) subPath = '/edit/customer/'+ id+ '/' + sid;
    const uri = API_URL + subPath;
    await axios.put(uri, data).then((res: AxiosResponse) => {
        result.code = res.status;
        result.data = res.data;
    }).catch((err) => {
        console.log(err);
        result.code = err.response.status;
        result.data = err.response.data;
    });
    return result;
}


export {getCustSuppliers, postCallCustSuppliers, putCallCustSupply, deleteCustSuppliers}