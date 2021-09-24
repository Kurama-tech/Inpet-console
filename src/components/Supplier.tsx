/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, Component , useEffect, useState  } from 'react';
import ComposableTableBasic from './table';
import { Context } from 'src/store/store';
import { getSuppliers } from 'src/services/APIservice';
import { Tabs, Tab, TabTitleText, Checkbox, Tooltip, TabContent, TabTitleIcon } from '@patternfly/react-core';
import {UsersIcon, ToolboxIcon } from '@patternfly/react-icons'

function GetSuppliers(globalDispatch: any){
    useEffect(()=>{
        getSuppliers().then((res) => {
            if(res.code === 200){
                globalDispatch({ type: "APIData", data: res.data });
            }else {
                globalDispatch({ type: "SET_ERROR", data: res });
              }
        });
    },[]);
}


const Supplier = () => {
    const {state, dispatch} = useContext(Context)
    const [suppliersData, setSuppliersData] = useState([]);
    const [activeTabKey, setActiveTabKey] = useState(0);
    useEffect(()=>{
        const suppliersD = state.APIData
        console.log(suppliersD);
        setSuppliersData(suppliersD)

    },[state])
    GetSuppliers(dispatch);

    function handleTabClick(event, tabIndex){
        setActiveTabKey(tabIndex);
    }
    return (
        
    <div>
        {/* <Tabs isFilled isBox activeKey={activeTabKey} onSelect={handleTabClick} >
          <Tab tabContentId="refTab1Section" eventKey={0} title={<><TabTitleIcon><UsersIcon /></TabTitleIcon><TabTitleText>Suppliers Table</TabTitleText></>}>
              <TabContent eventKey={0} id={'refTab1Section'}>
                  <ComposableTableBasic type={'Suppliers'} tableData={suppliersData}/>
              </TabContent>
          </Tab>
          <Tab tabContentId="refTab2Section" eventKey={1} title={<><TabTitleIcon><ToolboxIcon /></TabTitleIcon><TabTitleText>Add/Modify or Export</TabTitleText></>}>
          <TabContent eventKey={1} id={'refTab2Section'}>
                 <br />
                 Add
              </TabContent>
          </Tab>
        </Tabs> */}
        <ComposableTableBasic type={'Suppliers'} tableData={suppliersData}/>
     </div> 
    )
}

export default Supplier;