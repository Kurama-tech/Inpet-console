import React, { useState } from 'react';

import { TableComposable, Thead, Tbody, Tr, Th, Td, Caption, } from '@patternfly/react-table';
import { SearchInput } from '@patternfly/react-core';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';

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
  const [searchValue, setSearch] = useState("");
  function handleSearch(value, event){
    setSearch(value);
  }
  return (
    <React.Fragment>
      <br />
      <SearchInput
        placeholder="Find by name"
        value={searchValue}
        onChange={handleSearch}
        onClear={evt => handleSearch('', evt)}
      />
      <br />
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
            <Tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Td key={`${rowIndex}_${cellIndex}`} dataLabel={columns[cellIndex]}>
                  {cell}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </React.Fragment>
  );
};

export default ComposableTableBasic;