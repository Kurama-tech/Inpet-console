import React, { useContext, useEffect, useState } from 'react';

import { TableComposable, Thead, Tbody, Tr, Th, Td, Caption, } from '@patternfly/react-table';
import { Button, DescriptionList, Text, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Drawer, DrawerActions, DrawerCloseButton, DrawerContent, DrawerContentBody, DrawerHead, DrawerPanelBody, DrawerPanelContent, getUniqueId, Menu, MenuContent, MenuItem, MenuList, MenuToggle, SearchInput, Select, SelectOption, SelectVariant, Title, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { ToggleGroup, ToggleGroupItem, ButtonVariant, DropdownToggle } from '@patternfly/react-core';
import AddModal from './addModal';
import DeleteModal from './deleteModal';
import {EllipsisVIcon} from '@patternfly/react-icons'
import { deleteCustSuppliers} from '../services/APIservice';
import { Context } from 'src/store/store';
import ExportModal from './ExportModal';

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
  const [TableData, SetTableData] = useState<any>([]);

  useEffect(()=>{
    SetTableData(tableData);
  },[tableData])
  const [DetailsID, setDetailsID] = useState('');
  const [Banking, setBanking] = useState({});
  const [Address, setAddress] = useState({});
  const [contact, setcontact] = useState({});
  const [isExpanded, setisExpanded] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDModalOpen, setisDModalOpen] = useState(false);
  const [isEModalOpen, setisEModalOpen] = useState(false);
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
  const [allRowsSelected, setAllRowsSelected] = React.useState(false);
  const [selected, setSelected] = React.useState(TableData.map(row => false));
  const [recentSelection, setRecentSelection] = React.useState(null);
  const [shifting, setShifting] = React.useState(false);
  const [exportData, setExportData] = useState<any>([]);

  
  
  const onSelect = (event, isSelected, rowId) => {
    let newSelected = selected.map((sel, index) => (index === rowId ? isSelected : sel))
    
    // if the user is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelection !== null && isSelected) {
      const numberSelected = rowId - recentSelection;
      newSelected = newSelected.map((sel, index) => {
        // select all between recentSelection and current rowId;
        const intermediateIndexes = numberSelected > 0 ? 
          Array.from(new Array(numberSelected + 1), (x, i) => i + (recentSelection)) : 
          Array.from(new Array(Math.abs(numberSelected) + 1), (x, i) => i + rowId);
        return intermediateIndexes.includes(index) ? true : sel;
      })
    }
    setSelected(newSelected);
    setRecentSelection(rowId);
    console.log(newSelected);
    //prepareElement(TableData[rowId]);
    //for(let i=0;i<newSelected.length;i++){
     // if(newSelected[i] === true) prepareElement(TableData[i])
      //else RemoveItem(i)
   // }
    //console.log(exportData);
    
    if (!isSelected && allRowsSelected) {
      setAllRowsSelected(false);
    } else if (isSelected && !allRowsSelected) {
      let allSelected = true;
      for (let i = 0; i < selected.length; i++) {
        if (i !== rowId) {
          //RemoveItem(i)
          if (!selected[i]) {
            allSelected = false;
            
          }
        }
      }
      if (allSelected) {
        setAllRowsSelected(true);
      }
    }
  };
  
  
  const onSelectAll = (event, isSelected) => {
    setAllRowsSelected(isSelected);
    setSelected(TableData.map(sel => isSelected));
  
  };
  
  const ExportData = () => {
    
    var temp: any = [];
    if(selected.length <= 0){
      TableData.forEach(element => {
        temp.push(prepareElement(element))
      });
    }
    else{
      for(let i=0;i<selected.length; i++){
        if(selected[i] === true) temp.push(prepareElement(TableData[i]))
      }
    }
    setExportData(temp);
    console.log(temp);
    setisEModalOpen(true);
  }
  const prepareElement = (element) => {
    //var selectedLst: any = [];
    var temp = {
      "SID" : element.SID,
      "Name": element.SName,
      "Email": element.SEmail,
      "Phone": element.SPhone,
      "Address": element.SAddress['AddressLine'] + ', ' +element.SAddress['City'] + ', ' + element.SAddress['PinCode'] + ', ' + element.SAddress['State'] + ', ' + element.SAddress['Country'],
      "Contact": element.Contact.Name,
      "Nature": element.Nature
    }
    //selectedLst.push(temp);
    //setExportData(selectedLst);
    return temp;

  }

  useEffect(() => {
    
    document.addEventListener("keydown", (e)=>{
      if (e.key === 'Shift') {
        setShifting(true);
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === 'Shift') {
        setShifting(false);
      }
    });
    
    return () => {
      document.removeEventListener("keydown", (e)=>{
        if (e.key === 'Shift') {
          setShifting(true);
        }
      });
      document.removeEventListener("keyup", (e) => {
        if (e.key === 'Shift') {
          setShifting(false);
        }
      });
    }
  }, []);

  const filterOptions = [
    { value: 'Name', disabled: false, isPlaceholder: true },
    { value: 'id', disabled: false },
    //{ value: 'Phone', disabled: false },
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
  function getFilter(value){
    if(value === 'id'){
      return 'SID'
    }
    //else if(value === 'Phone'){
    //  return 'SPhone'
    //}
    return 'SName'
    
  }
  function handleSearch(value, event){
    setSearch(value);
    var tableD :any = []
    if(value === ''){
      tableD = tableData;
    }
    else{
      var filter = getFilter(selectedFilter);
      tableD = TableData.filter(function(o){return o[filter].includes(value)} )
      console.log(tableD);
      
    }
    SetTableData(tableD);
    
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
      <DescriptionListTerm>Address Line</DescriptionListTerm>
      <DescriptionListDescription>{Address['AddressLine']}</DescriptionListDescription>
      <DescriptionListTerm>City</DescriptionListTerm>
      <DescriptionListDescription>{Address['City']}</DescriptionListDescription>
      <DescriptionListTerm>State</DescriptionListTerm>
      <DescriptionListDescription>{Address['State']}</DescriptionListDescription>
      <DescriptionListTerm>Pincode</DescriptionListTerm>
      <DescriptionListDescription>{Address['PinCode']}</DescriptionListDescription>
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
      <DescriptionListTerm>Account Number</DescriptionListTerm>
      <DescriptionListDescription>{Banking['AccountNumber']}</DescriptionListDescription>
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
      <DescriptionListDescription><Text>{contact['Name']}</Text></DescriptionListDescription>
      <DescriptionListTerm>Contact Email</DescriptionListTerm>
      <DescriptionListDescription><a href={"mailto:"+contact['Email']}>{contact['Email']}</a></DescriptionListDescription>
      <DescriptionListTerm>Contact Phone</DescriptionListTerm>
      <DescriptionListDescription><a href={"tel:"+contact['No']}>{contact['No']}</a></DescriptionListDescription>
    </DescriptionListGroup>
    </DescriptionList> </DrawerPanelBody>
    </DrawerPanelContent>
  );
  
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
          <Button onClick={ExportData} variant="secondary">Export</Button>
          {/* <CsvDownload data={TableData}></CsvDownload> */}
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
        <ExportModal type={type} data={exportData} setisModalOpen={setisEModalOpen} isModalOpen={isEModalOpen} /> 
        <Thead>
        
          <Tr>
          <Th
            select={{
              onSelect: onSelectAll,
              isSelected: allRowsSelected
            }}
          />
            {columns.map((column, columnIndex) => (
              <Th key={columnIndex}>{column}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {TableData.length > 0 && TableData.map((element, rowIndex) => (
            <Tr isHoverable key={rowIndex} style={OpenIndex === rowIndex ? customStyle : {}} onRowClick={(event)=>{handleRowClick(rowIndex, element)}}>
            <Td
              key={`${rowIndex}_8`}
              select={{
                rowIndex,
                onSelect,
                isSelected: selected[rowIndex],
              }}
            />
            <Td key={`${rowIndex}_0`}>{element.SID}</Td>
            <Td key={`${rowIndex}_1`}>{element.SName}</Td>
            <Td key={`${rowIndex}_2`}><a href={'mailto:'+element.SEmail}>{element.SEmail}</a></Td>
            <Td key={`${rowIndex}_3`}><a href={'tel:'+element.SPhone}>{element.SPhone}</a></Td>
            <Td key={`${rowIndex}_4`} >{element.SAddress['AddressLine']}</Td>
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