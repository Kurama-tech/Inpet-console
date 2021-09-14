/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import {
    Page,
    PageHeader,
    PageHeaderTools,
    PageSidebar,
    PageSection,
    PageSectionVariants,
    Nav,
    NavItem,
    NavList,
    Brand,
    InputGroup
  } from '@patternfly/react-core';
  import './Layout.css';
  import './input.tsx'
import InputInventory from "./input";
import OutputInventory from "./output";
import ReportInventory from "./report";

  type NavigationBarProps = {
    Company: string;
    setisNavO: () => void;
    isNavO : boolean;

  };
  
  const HeaderBar = ({ Company, setisNavO, isNavO}: NavigationBarProps) => {
    const logo = (<Brand src={process.env.PUBLIC_URL + '/inpetlogo.png'} alt="Logo" />)
    return (<PageHeader  isNavOpen={isNavO} showNavToggle logo={logo} onNavToggle={setisNavO}><h1 className='font-face-gm'>Inpet Private Limited</h1></PageHeader>);
  };
  
const Layout = () => {

    
    const [isNavO, setisNavO] = useState(true);
    const [activeItem, setActiveItem] = useState(0);


    function onNavToggle(){
        setisNavO(!isNavO);
    }
    function onSelect(result) {
        setActiveItem(result.itemId)
    }
    const Header = <HeaderBar setisNavO={onNavToggle} isNavO={isNavO} Company={'Inpet'} />;
    const nav = (<Nav onSelect={onSelect}>
        <NavList>
          <NavItem itemId={0} isActive={activeItem === 0} ><Link to ="/input">Home</Link></NavItem>
          <NavItem itemId={1} isActive={activeItem === 1}><Link to ="/report" >Entry</Link></NavItem>
          <NavItem itemId={2} isActive={activeItem === 2}><Link to ="/output" >Search</Link></NavItem>
        </NavList>
        
        
      </Nav>)
      
      const sidebar = (<PageSidebar  nav={nav} isNavOpen={isNavO} />)
    return (
        <Page className='mynav' sidebar={sidebar} header={Header}>
      <PageSection isFilled hasOverflowScroll>
        <Router>
        <switch>
        <Route exact path='/input' component={InputInventory} />
        <Route exact path='/report' component={ReportInventory} />
        <Route exact path='/output' component={OutputInventory} />
        </switch>

        </Router>
      
      <Brand src={process.env.PUBLIC_URL + '/inpetlogo.png'} alt="Patternfly Logo" />
      </PageSection>
    </Page>
    )
}

export default Layout;