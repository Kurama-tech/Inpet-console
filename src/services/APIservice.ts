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

async function postSuppliers(data :any){
    const result: ApiResponse = { code: 0, data: {} };
    const uri = API_URL + '/add/supplier';
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

export {getSuppliers, postSuppliers}