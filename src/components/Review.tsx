import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Context } from 'src/store/store';
import { getCategories, getQTYfromValueDescription } from '../services/APIservice';
import { ActionGroup, Button, Checkbox, Grid, GridItem, DatePicker, Tile, Form, FormGroup, ValidatedOptions, FormHelperText, FormSelect, FormSelectOption, NumberInput, Text, TextArea, TextInput, Wizard, Radio, TextVariants, FormFieldGroupExpandable, FormFieldGroupHeader, Divider, Switch, Alert, FormAlert, Spinner, Flex, FlexItem, Banner, Label, Title, ClipboardCopy, ClipboardCopyVariant, DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { PlusCircleIcon, MinusCircleIcon, PercentIcon } from '@patternfly/react-icons'
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

const Review = ({ data, Operation, NumberEntries, ModifyData, ToSendData, setReviewAPID }: any) => {
    var listf = ['Category', 'Sub-Category', 'Termination', 'Package', 'PartNo', 'Make', 'Description', 'Value', 'Project', 'Cost', 'GST', 'GST(amt)', 'Quantity', 'Present QTY', 'Total QTY' , 'SubTotal', 'Total' ,'Comments',  ]
    const [Reviewdata, setReviewd] = useState({});
    const [processing, setProcessing] = useState(false);
    const [columns, setCols] = useState<any>(listf);
    const [OpenIndex, setOpenIndex] = useState(0);
    const [TableD, setTableD] = useState<any>([]);
    
    async function MakeAPIPRep(r=Reviewdata, t=TableD){
        var temp : any = []
        //var r = Reviewdata
        // var loopd = r['ComponentDetails']
        // eslint-disable-next-line array-callback-return
        await t.forEach((element, i) => {
            var t = {
                Date: r['date'],
                Name: r['name'],
                PO: r['pon'],
                BillNo: r['billno'],
                BDate: r['billdate'],
                TotalNumberEntries: r['NoEntries'],
                EntryNumber: i,
                Category: element.Category,
                SubCat: element.SubCat,
                Termination: element.Termination,
                Package: element.Package,
                PartNo: element.PartNo,
                Make: element.Make,
                Description: element.Description,
                Value: element.Value,
                Comments: element.Comments,
                Quantity: element.Quantity,
                TotalQATM: element.PREVIOUSQTY,
                SubTotal: element.SubTotal,
                Project: element.Project,
                Cost: element.Cost,
                GST: element.GST,
                GSTAMT: element.GSTAMT,
                CalculatedQTY: element.CalculatedQTY,
                Total: element.Total
            }
            temp.push(t)
        });
        console.log(temp);
        setReviewAPID(temp);
    }
    async function prepdata() {
        var temp = data;
        temp['ComponentDetails'] = ToSendData;
        temp['NoEntries'] = NumberEntries;
        temp['Operation'] = Operation ? '+' : '-';
        // temp = JSON.stringify(temp)
        console.log(temp);
        await setReviewd(temp);
        await setTableD(temp['ComponentDetails'])
        await MakeAPIPRep(temp, temp['ComponentDetails']);
        setProcessing(false);
        return temp;
    }
    useEffect(() => {
        setProcessing(true);
        prepdata();
    }, [Reviewdata, setReviewd]);

    const customStyle = {
        borderLeft: '3px solid var(--pf-global--primary-color--100)'
      };
      function handleRowClick(index , element){
        setOpenIndex(index);
        console.log(element);
      }
    return (
        <React.Fragment>
            {processing && (
                <Spinner isSVG diameter="80px" />
            )}
            {!processing && (
                <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                        <DescriptionList columnModifier={{ lg: '3Col' }}>
                        <DescriptionListGroup>
                                <DescriptionListTerm>Date</DescriptionListTerm>
                                <DescriptionListDescription>{Reviewdata['date']}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Bill Date</DescriptionListTerm>
                                <DescriptionListDescription>{Reviewdata['billdate']}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Name</DescriptionListTerm>
                                <DescriptionListDescription>
                                {Reviewdata['name']}
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Bill No</DescriptionListTerm>
                                <DescriptionListDescription>{Reviewdata['billno']}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Number of Entries</DescriptionListTerm>
                                <DescriptionListDescription>
                                {Reviewdata['NoEntries']}
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            {Reviewdata['pon'] !== '' && (
                            <DescriptionListGroup>
                                <DescriptionListTerm>Purchase Order Number</DescriptionListTerm>
                                <DescriptionListDescription>{Reviewdata['pon']}</DescriptionListDescription>
                            </DescriptionListGroup>
                            )}
                        </DescriptionList>
                    </FlexItem>
                    <Divider />
                    <FlexItem>
                    <TableComposable
        aria-label="Suppliers Table"
        borders={true}
        variant="compact"
      >
          <Thead>
        
        <Tr>
          {columns.map((column, columnIndex) => (
            <Th key={columnIndex}>{column}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
          {TableD.length > 0 && TableD.map((element, rowIndex) => (
            <Tr isHoverable key={rowIndex} style={OpenIndex === rowIndex ? customStyle : {}} onRowClick={(event)=>{handleRowClick(rowIndex, element)}}>
            <Td key={`${rowIndex}_0`}>{element.Category}</Td>
            <Td key={`${rowIndex}_2`}>{element.SubCat}</Td>
            <Td key={`${rowIndex}_3`}>{element.Termination}</Td>
            <Td key={`${rowIndex}_4`}>{element.Package}</Td>
            <Td key={`${rowIndex}_5`}>{element.PartNo}</Td>
            <Td key={`${rowIndex}_6`}>{element.Make}</Td>
            <Td key={`${rowIndex}_7`}>{element.Description}</Td>
            <Td key={`${rowIndex}_8`}>{element.Value}</Td>
            <Td key={`${rowIndex}_9`}>{element.Project}</Td>
            <Td key={`${rowIndex}_10`}>{element.Cost}</Td>
            <Td key={`${rowIndex}_12`}>{element.GST}</Td>
            <Td key={`${rowIndex}_13`}>{element.GSTAMT}</Td>
            <Td key={`${rowIndex}_14`}>{element.Quantity}</Td>
            <Td key={`${rowIndex}_15`}>{element.PREVIOUSQTY}</Td>
            <Td key={`${rowIndex}_16`}>{element.CalculatedQTY}</Td>
            <Td key={`${rowIndex}_17`}>{element.SubTotal}</Td>
            <Td key={`${rowIndex}_18`}>{element.Total}</Td>
            <Td key={`${rowIndex}_19`}>{element.Comments}</Td>
            </Tr>
          ))}
        </Tbody>
          </TableComposable>
                    </FlexItem>
                </Flex>
            )}

            {/* <ClipboardCopy isCode hoverTip="Copy" clickTip="Copied" variant={ClipboardCopyVariant.expansion}>
        {Reviewdata}
        </ClipboardCopy> */}

        </React.Fragment>

    )
}

export default Review;