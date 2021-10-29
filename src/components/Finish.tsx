import React, { useContext, Component, useEffect, useState } from 'react';
import ComposableTableBasic from './table';
import { Context } from 'src/store/store';
import { getCustSuppliers } from 'src/services/APIservice';
import { Tabs, Tab, TabTitleText, Checkbox, Tooltip, TabContent, TabTitleIcon, Bullseye, Title, TitleSizes, Button, Flex, FlexItem } from '@patternfly/react-core';
import { CogsIcon } from '@patternfly/react-icons'
import { useHistory } from "react-router-dom";


const Finish = () => {
    const { state, dispatch } = useContext(Context)
    const history = useHistory();
    function gotoDash() {
        history.push("/");
    }
    return (
        <React.Fragment>
            <Bullseye>
            <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                <FlexItem alignSelf={{default: 'alignSelfCenter'}}><CogsIcon size="xl" /></FlexItem>
                <FlexItem alignSelf={{default: 'alignSelfCenter'}}><Title headingLevel="h1" size={TitleSizes['4xl']}>
                    Inventory Updated Successfully!
                </Title></FlexItem>
                <FlexItem alignSelf={{default: 'alignSelfCenter'}}><Button variant="primary" onClick={() => gotoDash()}>Go To Dashboard</Button></FlexItem>
            </Flex>
            </Bullseye>



        </React.Fragment>
    )
}

export default Finish;