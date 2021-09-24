import React, { useState } from 'react';

import { TableComposable, Thead, Tbody, Tr, Th, Td, Caption, } from '@patternfly/react-table';
import { Button, SearchInput, Select, SelectOption, SelectVariant, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { ToggleGroup, ToggleGroupItem, ButtonVariant, DropdownToggle } from '@patternfly/react-core';
import AddModal from './addModal';

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
  const rows = constructTableData(tableData);
  const [OpenIndex, setOpenIndex] = useState(0);
  const [filterOpen, setfilterOpen] = useState(false);
  const [selectedFilter, setFilter] = useState("");
  const [searchValue, setSearch] = useState("");
  const filterOptions = [
    { value: 'By Name', disabled: false, isPlaceholder: true },
    { value: 'id', disabled: false },
    { value: 'Phone no', disabled: false },
  ];
  const defaultActions = [
    {
      title: 'Delete',
      onClick: (event, rowId, rowData, extra) => console.log('clicked on Some action, on row: ', rowId)
    },
    {
      title: 'Edit',
      variant: ButtonVariant.secondary,
      onClick: (event, rowId, rowData, extra) => console.log('clicked on extra action, on row: ', rowData),
      isOutsideDropdown: true
    }
  ];
  
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
  function handleRowClick(index){
    setOpenIndex(index);
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
          <AddModal type={type} />
        </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    
      <TableComposable
        aria-label="Suppliers Table"
        borders={true}
      >
        <Caption>Table which displays details of : {type}</Caption>
        <Thead>
          <Tr>
            {columns.map((column, columnIndex) => (
              <Th key={columnIndex}>{column}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, rowIndex) => (
            <Tr isHoverable key={rowIndex} style={OpenIndex === rowIndex ? customStyle : {}} onRowClick={(event)=>{handleRowClick(rowIndex)}}>
              {row.map((cell, cellIndex) => (
                <Td key={`${rowIndex}_${cellIndex}`} dataLabel={columns[cellIndex]}>
                  {cell}
                </Td>
              ))}
              <Td key={`${rowIndex}_7`} actions={{ items: defaultActions}}></Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </React.Fragment>
  );
};

export default ComposableTableBasic;