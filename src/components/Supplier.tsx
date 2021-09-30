/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, Component , useEffect, useState  } from 'react';
import ComposableTableBasic from './table';
import { Context } from 'src/store/store';
import { getCustSuppliers} from 'src/services/APIservice';
import { Tabs, Tab, TabTitleText, Checkbox, Tooltip, TabContent, TabTitleIcon } from '@patternfly/react-core';
import {UsersIcon, ToolboxIcon } from '@patternfly/react-icons'

function GetSuppliers(globalDispatch: any){
    useEffect(()=>{
        getCustSuppliers().then((res) => {
            if(res.code === 200){
                console.log('here')
                globalDispatch({ type: "APISuppliers", data: res.data });
            }else {
                globalDispatch({ type: "SET_ERROR", data: res });
              }
        });
    },[globalDispatch]);
}


const Supplier = () => {
    const {state, dispatch} = useContext(Context)
    const [suppliersData, setSuppliersData] = useState([]);
    useEffect(()=>{
        const suppliersD = state.Suppliers
        console.log(suppliersD);
        setSuppliersData(suppliersD)

    },[state])
    GetSuppliers(dispatch);

    return (  
    <div>
        <ComposableTableBasic type={'Suppliers'} tableData={suppliersData}/>
     </div> 
    )
}

export default Supplier;