import React from 'react';
import { TableComposable, Thead, Tbody, Tr, Th, Td, ExpandableRowContent } from '@patternfly/react-table';

import CodeBranchIcon from '@patternfly/react-icons/dist/esm/icons/code-branch-icon';
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';

// https://github.com/patternfly/patternfly-react/blob/main/packages/react-table/src/components/Table/composable-table-examples/DemoSortableTable.js

const Inventory = () => {
  const columns = ['Id', 'Bill Details', 'Component Details', 'Computing Details', 'Last commit', ''];
  const rows = [
    ['siemur/test-space', 10, 4, 4, '20 minutes', 'Open in Github'],
    ['siemur/test-space', 3, 4, 2, '10 minutes', 'Open in Github']
  ];
  // index corresponds to row index, and value corresponds to column index of the expanded, null means no cell is expanded
  const [activeChild, setActiveChild] = React.useState([1, null]);
  // key = row_col of the parent it corresponds to
  const childData = {
    '0_1': {
      component: (
        <p>hello</p>
      )
    },
    '0_2': {
      component: (
        <p>hello</p>
      )
    },
    '0_3': {
      component: (
        <p>hello</p>
      )
    },
    '1_1': {
      component: (
        <p>hello</p>
      )
    },
    '1_2': {
      component: (
        <p>hello</p>
      )
    },
    '1_3': {
      component: (
        <p>hello</p>
      )
    }
  };
  const customRender = (cell, index) => {
    if (index === 0) {
      return <a href="#">{cell}</a>;
    } else if (index === 1) {
      return (
        <React.Fragment>
          <CodeBranchIcon key="icon" /> {cell}
        </React.Fragment>
      );
    } else if (index === 2) {
      return (
        <React.Fragment>
          <CodeIcon key="icon" /> {cell}
        </React.Fragment>
      );
    } else if (index === 3) {
      return (
        <React.Fragment>
          <CubeIcon key="icon" /> {cell}
        </React.Fragment>
      );
    } else if (index === 5) {
      return <a href="#">{cell}</a>;
    }
    return cell;
  };
  const isCompoundExpanded = (rowIndex, cellIndex) => {
    // only columns 1 - 3 are compound expansion toggles in this example
    if (1 <= cellIndex && cellIndex <= 3) {
      return activeChild[rowIndex] === cellIndex;
    }
    return false;
  };
  return (
    <TableComposable aria-label="Compound expandable table">
      <Thead>
        <Tr>
          {columns.map((column, columnIndex) => (
            <Th key={columnIndex}>{column}</Th>
          ))}
        </Tr>
      </Thead>
      {rows.map((row, rowIndex) => {
        const isRowExpanded = activeChild[rowIndex] !== null;
        return (
          <Tbody key={rowIndex} isExpanded={isRowExpanded}>
            <React.Fragment>
              <Tr>
                {row.map((cell, cellIndex) => {
                  // for this example, only columns 1 - 3 are clickable
                  const compoundExpandParams =
                  1 <= cellIndex && cellIndex <= 3
                  ? {
                          compoundExpand: {
                            isExpanded: isCompoundExpanded(rowIndex, cellIndex),
                            onToggle: () => {
                              if (activeChild[rowIndex] === cellIndex) {
                                // closing the expansion on the current toggle
                                // set the corresponding item to null
                                const updatedActiveChild = activeChild.map((item, index) =>
                                  index === rowIndex ? null : item
                                );
                                setActiveChild(updatedActiveChild);
                              } else {
                                // expanding
                                // set the corresponding cell index
                                const updatedActiveChild = activeChild.map((item, index) =>
                                  index === rowIndex ? cellIndex : item
                                );
                                setActiveChild(updatedActiveChild);
                              }
                            }
                          }
                        } : {}
                  return (
                    <Td
                      key={`${rowIndex}_${cellIndex}`}
                      dataLabel={columns[cellIndex]}
                      component={cellIndex === 0 ? 'th' : 'td'}
                      {...compoundExpandParams}
                    >
                      {customRender(cell, cellIndex)}
                    </Td>
                  );
                })}
              </Tr>
              {isRowExpanded && (
                <Tr key={`${rowIndex}-child`} isExpanded={isRowExpanded}>
                  <Td dataLabel={columns[0]} noPadding colSpan={6}>
                    <ExpandableRowContent>
                      {childData[`${rowIndex}_${activeChild[rowIndex]}`].component}
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              )}
            </React.Fragment>
          </Tbody>
        );
      })}
    </TableComposable>
  );
};

export default Inventory;