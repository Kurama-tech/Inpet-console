/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect, useState } from "react";
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
    Brand
  } from '@patternfly/react-core';
  import Logo from '../logo.svg';


  type NavigationBarProps = {
    manifest: string;
  };
  
  const NavigationBar = ({ manifest }: NavigationBarProps) => {

    const logo = (<Brand src='https://patternfly-react.surge.sh/images/logo.4189e7eb1a0741ea2b3b51b80d33c4cb.svg' alt="Patternfly Logo" />)
    const nav = (
      <Nav variant="horizontal">
        <NavList>
          <NavItem isActive>{manifest}</NavItem>
        </NavList>
      </Nav>
    );
    return <PageHeader  showNavToggle logo={logo} topNav={nav} />;
  };
  
const Layout = () => {
    const Header = <NavigationBar manifest={'Inpet'} />;
    return (
        <Page header={Header}>
      <PageSection>
      <Brand src='https://www.patternfly.org/v4/images/pfLogo.ffdafb0c74aa4c9c011251aa8f0c144c.svg' alt="Patternfly Logo" />
      </PageSection>
    </Page>
    )
}

export default Layout;