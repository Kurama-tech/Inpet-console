import React, { useContext, Component , useEffect, useState  } from 'react';
import ComposableTableBasic from './table';
import { Context } from 'src/store/store';
import { getCustSuppliers } from 'src/services/APIservice';
import { Tabs, Tab, TabTitleText, Checkbox, Tooltip, TabContent, TabTitleIcon } from '@patternfly/react-core';
import {UsersIcon, ToolboxIcon } from '@patternfly/react-icons'

function GetSuppliers(globalDispatch: any){
    useEffect(()=>{
        getCustSuppliers(1).then((res) => {
            if(res.code === 200){
                console.log('here')
                globalDispatch({ type: "APICustomers", data: res.data });
            }else {
                globalDispatch({ type: "SET_ERROR", data: res });
              }
        });
    },[globalDispatch]);
}

const Customer = () => {
    const {state, dispatch} = useContext(Context)
    const [CustomersData, setCustomersData] = useState([]);
    useEffect(()=>{
        const CustomersD = state.Customers
        console.log(CustomersD);
        setCustomersData(CustomersD)

    },[state])
    GetSuppliers(dispatch);
    return (    
    <div>
        <ComposableTableBasic type={'Customers'} tableData={CustomersData}/>
     </div> 
    )
}

export default Customer;