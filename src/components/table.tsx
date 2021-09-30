import React, { useContext, useState } from 'react';

import { TableComposable, Thead, Tbody, Tr, Th, Td, Caption, } from '@patternfly/react-table';
import { Button, DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Drawer, DrawerActions, DrawerCloseButton, DrawerContent, DrawerContentBody, DrawerHead, DrawerPanelBody, DrawerPanelContent, getUniqueId, Menu, MenuContent, MenuItem, MenuList, MenuToggle, SearchInput, Select, SelectOption, SelectVariant, Title, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { ToggleGroup, ToggleGroupItem, ButtonVariant, DropdownToggle } from '@patternfly/react-core';
import AddModal from './addModal';
import DeleteModal from './deleteModal';
import {EllipsisVIcon} from '@patternfly/react-icons'
import { deleteCustSuppliers} from '../services/APIservice';
import { Context } from 'src/store/store';

type TableProps = {
    type: string;
    tableData: any;

};

function getcolumns(mode){
    if(mode === 'Suppliers') return ['Supplier ID', 'Supplier Name', 'E-mail', 'Phone No', 'Address', 'Contact Name', 'Nature of Products/Services', 'Actions']
    else return ['Customer ID', 'Customer Name', 'E-mail', 'Phone No', 'Address', 'Contact Name', 'Nature of Products/Services', 'Actions']
}

function constructTableData(data){
  var rows :any = []
  data.forEach(element => {
    var temp = [element.SID, element.SName, element.SEmail, element.SPhone, element.SAddress['City'], element.Contact.Name, element.Nature]
    rows.push(temp);
  });
  return rows;
}


const ComposableTableBasic = ({type, tableData}: TableProps) => {
  const columns = getcolumns(type)
  //const rows = constructTableData(tableData);
  var drawerRef = React.createRef<HTMLSpanElement>();
  const {state, dispatch} = useContext(Context);
  const [DetailsID, setDetailsID] = useState('');
  const [Banking, setBanking] = useState({});
  const [Address, setAddress] = useState({});
  const [contact, setcontact] = useState({});
  const [isExpanded, setisExpanded] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDModalOpen, setisDModalOpen] = useState(false);
  const [addORedit, setaddORedit] = useState('Add');
  const [OpenIndex, setOpenIndex] = useState(0);
  const [isEdit, setisEdit] = useState(false);
  const [Editid, setEditid] = useState('');
  const [deleteid, setdeleteid] = useState('');
  const [deletesid, setdeletesid] = useState('');
  const [sid, setSid] = useState('');
  const [EditData, setEditData] = useState({});
  const [filterOpen, setfilterOpen] = useState(false);
  const [selectedFilter, setFilter] = useState("");
  const [searchValue, setSearch] = useState("");
  const filterOptions = [
    { value: 'By Name', disabled: false, isPlaceholder: true },
    { value: 'id', disabled: false },
    { value: 'Phone no', disabled: false },
  ];
  function openDeleteModal(id:string, sid:string){
    setdeleteid(id);
    setdeletesid(sid);
    setisDModalOpen(true);
  }
  function openModalWithData(isedit?:boolean, data?:any, index?:any, id?:string, sid?:string){
    if(isedit){
    setisEdit(true);
    var EditData = data[index];
    //console.log(EditData)
    setSid(sid? sid: '');
    setEditid(id? id: '')
    setaddORedit('Edit')
    setEditData(EditData);
    }
    else{
      setisEdit(false);
      setEditData({});
    }
    setisModalOpen(true);
  }

  function onExpand(){
    drawerRef.current && drawerRef.current.focus();
  }
  
  function handlefilter(event, selection, isPlaceholder) {
    if (isPlaceholder) setFilter("")
    setFilter(selection)
    setfilterOpen(false);
  }
  function handleSearch(value, event){
    setSearch(value);
  }
  const customStyle = {
    borderLeft: '3px solid var(--pf-global--primary-color--100)'
  };
  function handleRowClick(index , element){
    setOpenIndex(index);
    console.log(element);
    setDetailsID(element.SID);
    setAddress(element.SAddress);
    setBanking(element.BankingDetails);
    setcontact(element.Contact);
    setisExpanded(true);
  }

  function onCloseDrawer(){
    setDetailsID('');
    setAddress({});
    setBanking({});
    setcontact({});
  }

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <span tabIndex={isExpanded ? 0 : -1} ref={drawerRef}>
        <Title headingLevel="h4" size="xl">
      Details {DetailsID}
    </Title>
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={()=>{setisExpanded(false); onCloseDrawer()}} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody> 
      <DescriptionList columnModifier={{
      default: '2Col'
    }}>
    
      <DescriptionListGroup>
    <Title headingLevel="h4" size="xl">
      Address
    </Title>
      <DescriptionListTerm>City</DescriptionListTerm>
      <DescriptionListDescription>{Address['City']}</DescriptionListDescription>
      <DescriptionListTerm>State</DescriptionListTerm>
      <DescriptionListDescription>{Address['State']}</DescriptionListDescription>
      <DescriptionListTerm>Pincode</DescriptionListTerm>
      <DescriptionListDescription>{Address['Pincode']}</DescriptionListDescription>
      <DescriptionListTerm>Country</DescriptionListTerm>
      <DescriptionListDescription>{Address['Country']}</DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
    <Title headingLevel="h4" size="xl">
      Banking Details
    </Title>
      <DescriptionListTerm>Bank Name</DescriptionListTerm>
      <DescriptionListDescription>{Banking['BankName']}</DescriptionListDescription>
      <DescriptionListTerm>Account Name</DescriptionListTerm>
      <DescriptionListDescription>{Banking['AccountName']}</DescriptionListDescription>
      <DescriptionListTerm>Account Type</DescriptionListTerm>
      <DescriptionListDescription>{Banking['AccountType']}</DescriptionListDescription>
      <DescriptionListTerm>IFSC Code</DescriptionListTerm>
      <DescriptionListDescription>{Banking['IFSC']}</DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
    <Title headingLevel="h4" size="xl">
      Contact Details
    </Title>
      <DescriptionListTerm>Contact Name</DescriptionListTerm>
      <DescriptionListDescription>{contact['Name']}</DescriptionListDescription>
      <DescriptionListTerm>Contact Email</DescriptionListTerm>
      <DescriptionListDescription>{contact['Email']}</DescriptionListDescription>
      <DescriptionListTerm>Contact Phone</DescriptionListTerm>
      <DescriptionListDescription>{contact['No']}</DescriptionListDescription>
    </DescriptionListGroup>
    </DescriptionList> </DrawerPanelBody>
    </DrawerPanelContent>
  );

  function isObjectEmpty(value) {
    return (
      Object.prototype.toString.call(value) === '[object Object]' &&
      JSON.stringify(value) === '{}'
    );
  }
  
  return (
    <React.Fragment>
      <Toolbar id="toolbar">
        <ToolbarContent>
        <ToolbarItem><SearchInput
        placeholder="Find by name"
        value={searchValue}
        onChange={handleSearch}
        onClear={evt => handleSearch('', evt)}
      /></ToolbarItem>
       <ToolbarItem>
            <Select
              variant={SelectVariant.single}
              aria-label="Select Input"
              onToggle={setfilterOpen}
              onSelect={handlefilter}
              selections={selectedFilter}
              isOpen={filterOpen}
            >
              {filterOptions.map((option, index) => (
                <SelectOption isDisabled={option.disabled} key={index} value={option.value} />
              ))}
            </Select>
          </ToolbarItem>
          <ToolbarItem variant="separator" />
      <ToolbarItem>
          <Button variant="secondary">Export</Button>
        </ToolbarItem>
        <ToolbarItem variant="separator" />
        <ToolbarItem>
        <Button variant="primary" onClick={() => openModalWithData(false)}>
                Add {type}
        </Button>
        </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Drawer isExpanded={isExpanded} onExpand={()=>onExpand()}>
          <DrawerContent panelContent={panelContent}>
            <DrawerContentBody>
      <TableComposable
        aria-label="Suppliers Table"
        borders={true}
      >
        <Caption>Table which displays details of : {type}</Caption>
        <DeleteModal Sid={deletesid} type={type} id={deleteid} isModalOpen={isDModalOpen} setisModalOpen={setisDModalOpen} />
        <AddModal addORedit={addORedit} type={type} isModalOpen={isModalOpen} isEdit={isEdit} data={EditData} editID={Editid} sid={sid} setisModalOpen={setisModalOpen}/>
        <Thead>
          <Tr>
            {columns.map((column, columnIndex) => (
              <Th key={columnIndex}>{column}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.length > 0 && tableData.map((element, rowIndex) => (
            <Tr isHoverable key={rowIndex} style={OpenIndex === rowIndex ? customStyle : {}} onRowClick={(event)=>{handleRowClick(rowIndex, element)}}>
            <Td key={`${rowIndex}_0`}>{element.SID}</Td>
            <Td key={`${rowIndex}_1`}>{element.SName}</Td>
            <Td key={`${rowIndex}_2`}>{element.SEmail}</Td>
            <Td key={`${rowIndex}_3`}>{element.SPhone}</Td>
            <Td key={`${rowIndex}_4`} >{element.SAddress['City']}</Td>
            <Td key={`${rowIndex}_5`}>{element.Contact.Name}</Td>
            <Td key={`${rowIndex}_6`}>{element.Nature}</Td>
            <Td key={`${rowIndex}_7`}>
              <Button variant="secondary" isSmall onClick={() => openModalWithData(true, tableData, rowIndex, element._id, element.SID)}>
                Edit
              </Button>{' '}
              <Button variant="danger" isSmall onClick={()=> openDeleteModal(element._id, element.SID)}>
                Delete
               </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
      </DrawerContentBody>
      </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
};

export default ComposableTableBasic;