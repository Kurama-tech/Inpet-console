import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Context } from 'src/store/store';
import { getCategories, getQTYfromValueDescription } from '../services/APIservice';
import { ActionGroup, Button, Checkbox, Grid, GridItem, DatePicker, Tile, Form, FormGroup, ValidatedOptions, FormHelperText, FormSelect, FormSelectOption, NumberInput, Text, TextArea, TextInput, Wizard, Radio, TextVariants, FormFieldGroupExpandable, FormFieldGroupHeader, Divider, Switch, Alert, FormAlert, Spinner, Flex, FlexItem, Banner, Label, Title } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import {PlusCircleIcon, MinusCircleIcon, PercentIcon} from '@patternfly/react-icons'

type ComponentDetailsProps = {
    NumberEntries: Number;
    ModifyData: (index: any, value: any) => void;
    error: boolean;
    ToSendData: any;
    Operation: boolean;
    SetOperation: (value) => void;


}

type LoopRowProps = {
    n: any;
    error: boolean;
    PreData: any;
    Operation: boolean;
    ModifyData: (index: any, value: any) => void;
}

const LoopRow = ({ n, ModifyData, PreData, Operation }: LoopRowProps) => {
    const { state, dispatch } = useContext(Context);
    const [Category, setCategory] = useState("Select");
    const [SpecificD, setSepcificD] = useState<any>({
        Category: "",
        Comments: "",
        Description: "",
        Make: "",
        Package: "",
        PartNo: "",
        Quantity: "",
        SubCat: "",
        Termination: "",
        Value: ""
    });
    const [calculatedQTY, setCalculated] = useState(0);
    const [updating, setupdating] = useState(false);
    const [SubCat, setSubCat] = useState("Select");
    const [Termination, setTermination] = useState("Select");
    const [Package, setPackage] = useState("Select");
    const [Pno, setPno] = useState("");
    const [Make, setMake] = useState("");
    const [Description, setDescription] = useState("");
    const [Value, setValue] = useState("");
    const [Comment, setComment] = useState("");
    const [Quantity, setQuantity] = useState("");
    const [PrevQTY, setPrevQTY] = useState(0);
    const [Project, setPrj] = useState("");
    const [cost,setCost] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [GST,setGST] = useState(0);
    const [Total, setTotal] = useState(0);
    type validateType = "error" | "default" | "success" | "warning" | undefined
    let validations: validateType[] = [];
    for (let i = 0; i < 14; i++) {
        validations[i] = "default"
    }
    const [categoriesList, setCatagoriesList] = useState<any>([]);
    const [terminationlist, setTerminationList] = useState<any>([]);
    const [packagelist, setpackageList] = useState<any>([]);
    const [SubCats, setSubCats] = useState<any>([]);
    const [validated, setValidated] = useState<validateType[]>(validations)


    const HandleChange = (key, value) => {
        var temp = SpecificD;
        temp[key] = value;
        setSepcificD(temp);
        ModifyData(Number(n), temp);
    }
    function setValidInvalid(mode, index) {
        var temp = validated;
        temp[index] = mode;
        setValidated(temp);
    }
    function NormalValidate(value, i) {
        if (value !== '') {
            setValidInvalid("success", i)
        }
        else {
            setValidInvalid("error", i)
        }
    }
    function runOperation(operation, a, b) {
        if (operation) {
            return Number(a) + Number(b);
        }
        return Number(a) - Number(b);
    }

    
    async function HandleQTYChange(value, Val = Value, DES = Description, Cost = cost, gst = GST) {
        
        setupdating(true)
        if (value === '') {
            setCalculated(0);
            setupdating(false)
            setQuantity('');
            return;
        }
        if (Val === '') {
            setValidInvalid("error", 7)
            setupdating(false)
        }
        else if (DES === '') {
            setValidInvalid("error", 5)
            setupdating(false)
        }
        else if(Cost <= 0){
            setValidInvalid("error", 11)
            setupdating(false)
        }
        else if(gst <= 0){
            setValidInvalid("error", 12)
            setupdating(false)
        }
        else {
            if (Number(value) > 0 && Cost > 0 && gst > 0) {
                await setQuantity(value)
                HandleChange("Quantity", value);
                NormalValidate(value, 9)
                await getQTYfromValueDescription(Val, DES).then((resp) => {
                    if (resp.code === 200) {
                        console.log(resp.data)
                        // Set state here
                        var previousQTY = resp.data.totalQTY
                        console.log(value)
                        setPrevQTY(previousQTY);
                        HandleChange("PREVIOUSQTY", previousQTY)
                        previousQTY = runOperation(Operation, previousQTY, value);
                        console.log(previousQTY)
                        if (previousQTY < 0) {
                            setCalculated(0);
                            NormalValidate(value, 9)
                            setSubTotal(0);
                        }
                        else {
                            setCalculated(previousQTY);
                            var subtotal = Cost * previousQTY;
                            setSubTotal(subtotal)
                            var gstamt = (subtotal * gst) / 100; 
                            var total = gstamt + subtotal;
                            console.log(total)
                            setTotal(total);
                            HandleChange("Total", total)
                            HandleChange("SubTotal", subtotal)
                            HandleChange("Cost", Cost)
                            HandleChange("GST", gst)
                            HandleChange("GSTAMT", gstamt)
                            
                            HandleChange("CalculatedQTY", previousQTY)

                            
                        }
                        setupdating(false)
                    }
                    else {
                        dispatch({ type: "SET_ERROR", data: resp });
                        setupdating(false)
                    }
                })

            }
            else {
                setQuantity('');
                setCalculated(0)
                setupdating(false)
            }
        }
    }
    const onCatSelectChange = (value, event) => {
        if (value === '') {
            value = "Select"
            setCategory(value);
            NormalValidate("", 0)
            HandleChange("Category", "")
        }
        else {
            setCategory(value);
            NormalValidate(value, 0)
            HandleChange("Category", value)
            categoriesList.forEach(element => {
                if (element.value === value) {
                    let temp: any = []
                    temp.push({ value: 'Select', label: 'Select', disabled: true })
                    element.sub.forEach((value) => {
                        let k = { value: value, label: value, disabled: false }
                        temp.push(k)
                    });
                    setSubCats(temp)
                }
            });
        }
    }
    const onSubCatSelect = (value, event) => {
        NormalValidate(value, 1)
        HandleChange("SubCat", value)
        if (value === '') {
            value = "Select"
        }
        setSubCat(value);

    }
    const onTerminationChange = (value, event) => {
        NormalValidate(value, 2)
        HandleChange("Termination", value)
        if (value === '') {
            value = "Select"
        }
        setTermination(value);

    }
    const onPackageChange = (value, event) => {
        NormalValidate(value, 3)
        HandleChange("Package", value)
        if (value === '') {
            value = "Select"
        }
        setPackage(value);

    }

    useEffect(() => {
        console.log(PreData)
        setCatagoriesList(state.trimcategories);
        setTerminationList(state.termination);
        //setTermination(state.termination[1]?.value);
        console.log("in use effect")
        setpackageList(state.package);
        if (PreData !== undefined) {
            var d = 0;
            onCatSelectChange(PreData['Category'] ? PreData['Category'] : '', d)
            onSubCatSelect(PreData['SubCat'] ? PreData['SubCat'] : '', d)
            onPackageChange(PreData['Package'] ? PreData['Package'] : '', d)
            onTerminationChange(PreData['Termination'] ? PreData['Termination'] : '', d)
            setDescription(PreData['Description'] ? PreData['Description'] : '')
            NormalValidate(PreData['Description'] ? PreData['Description'] : '', 5)
            HandleChange("Description", PreData['Description'] ? PreData['Description'] : '')
            setMake(PreData['Make'] ? PreData['Make'] : '')
            HandleChange("Make", PreData['Make'] ? PreData['Make'] : '')
            NormalValidate(PreData['Make'] ? PreData['Make'] : '', 6)
            setPno(PreData['PartNo'] ? PreData['PartNo'] : '')
            HandleChange("PartNo", PreData['PartNo'] ? PreData['PartNo'] : '')
            NormalValidate(PreData['PartNo'] ? PreData['PartNo'] : '', 4)
            setComment(PreData['Comments'] ? PreData['Comments'] : '')
            HandleChange("Comments", PreData['Comments'] ? PreData['Comments'] : '')
            NormalValidate(PreData['Comments'] ? PreData['Comments'] : '', 8)
            setQuantity(PreData['Quantity'] ? PreData['Quantity'] : '')
            HandleChange("Quantity", PreData['Quantity'] ? PreData['Quantity'] : '')
            NormalValidate(PreData['Quantity'] ? PreData['Quantity'] : '', 9)
            setValue(PreData['Value'] ? PreData['Value'] : '')
            HandleChange("Value", PreData['Value'] ? PreData['Value'] : '')
            NormalValidate(PreData['Value'] ? PreData['Value'] : '', 7)
            setPrj(PreData['Project'] ? PreData['Project'] : '')
            HandleChange("Project", PreData['Project'] ? PreData['Project'] : '')
            NormalValidate(PreData['Project'] ? PreData['Project'] : '', 10)
            setCost(PreData['Cost'] ? PreData['Cost'] : 0)
            HandleChange("Cost", PreData['Cost'] ? PreData['Cost'] : 0)
            NormalValidate(PreData['Cost'] ? PreData['Cost'] : '', 11)
            setGST(PreData['GST'] ? PreData['GST'] : 0)
            HandleChange("GST", PreData['GST'] ? PreData['GST'] : 0)
            NormalValidate(PreData['GST'] ? PreData['GST'] : '', 12)
            HandleQTYChange(PreData['Quantity'] ? PreData['Quantity'] : '', PreData['Value'] ? PreData['Value'] : '', PreData['Description'] ? PreData['Description'] : '', PreData['Cost'] ? PreData['Cost'] : 0, PreData['GST'] ? PreData['GST'] : 0)
        }
        //setCatagoriesList(state.trimcategories);
        //setTerminationList(state.termination);
        //setTermination(state.termination[1]?.value);
        setpackageList(state.package);
    }, [categoriesList, setCatagoriesList, terminationlist, packagelist, setTerminationList, setpackageList, state])
    return (
        <React.Fragment>
            <FormFieldGroupExpandable
                toggleAriaLabel={"Entry " + Number(n + 1)}
                header={
                    <FormFieldGroupHeader
                        titleText={{ text: "Entry " + Number(n + 1), id: 'field-group2-titleText-id' }}
                        titleDescription="Expand This And Fill up the Details for the Specific Entry"
                    />
                }
            >

                <Grid hasGutter md={3}>
                    <GridItem>
                        <FormGroup label="Category" fieldId={"Autogen-cat-" + String(n)}>
                            <FormSelect value={Category} onChange={onCatSelectChange} validated={validated[0]} isRequired aria-label="Select Category">
                                {
                                    categoriesList.map((option, index) => (
                                        <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
                                    ))
                                }
                            </FormSelect>
                        </FormGroup>
                        <FormGroup label="Sub Category" fieldId={"Autogen-sub-" + String(n)}>
                            <FormSelect value={SubCat} onChange={onSubCatSelect} validated={validated[1]} isRequired aria-label="Select Sub Category">
                                {
                                    SubCats.map((option, index) => (
                                        <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
                                    ))
                                }
                            </FormSelect>
                        </FormGroup>
                        <FormGroup label="Termination" fieldId={"Autogenter" + String(n)}>
                            {/* <TextInput
                    isRequired
                    type="text"
                    id={"simple-form-name-t-"+ String(n) }
                    name={"simple-form-name-t-"+ String(n) }
                    value={Termination}
                    onChange={(value)=> {setTermination(value); HandleChange("Termination", value)}}
                /> */}
                            <FormSelect value={Termination} onChange={onTerminationChange} validated={validated[2]} isRequired aria-label="Select Termination">
                                {
                                    terminationlist.map((option, index) => (
                                        <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
                                    ))
                                }
                            </FormSelect>
                        </FormGroup>
                        <FormGroup label="Package" fieldId={"Autogenpkg" + String(n)}>
                            {/* <TextInput
                    isRequired
                    type="text"
                    id={"simple-form-name-p-"+ String(n) }
                    name={"simple-form-name-p-"+ String(n) }
                    value={Package}
                    onChange={(value)=> {setPackage(value); HandleChange("Package", value)}}
                /> */}
                            <FormSelect value={Package} onChange={onPackageChange} isRequired validated={validated[3]} aria-label="Select Package">
                                {
                                    packagelist.map((option, index) => (
                                        <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
                                    ))
                                }
                            </FormSelect>
                        </FormGroup>
                    </GridItem >
                    <GridItem>
                        <FormGroup label="Part No" fieldId={"Autogenprt" + String(n)}>
                            <TextInput
                                isRequired
                                type="text"
                                id={"simple-form-name-pr-" + String(n)}
                                name={"simple-form-name-pr-" + String(n)}
                                value={Pno}
                                validated={validated[4]}
                                onChange={(value) => { setPno(value); HandleChange("PartNo", value); NormalValidate(value, 4) }}
                            />
                        </FormGroup>
                        <FormGroup label="Description" fieldId={"Autogen-des" + String(n)}>
                            <TextInput
                                isRequired
                                type="text"
                                id={"simple-form-name-d-" + String(n)}
                                name={"simple-form-name-d-" + String(n)}
                                value={Description}
                                validated={validated[5]}
                                onChange={(value) => { setDescription(value); HandleChange("Description", value); NormalValidate(value, 5) }}
                            />
                        </FormGroup>
                        <FormGroup label="Make" fieldId={"Autogen-mke" + String(n)}>
                            <TextInput
                                isRequired
                                type="text"
                                id={"simple-form-name-m-" + String(n)}
                                name={"simple-form-name-m-" + String(n)}
                                value={Make}
                                validated={validated[6]}
                                onChange={(value) => { setMake(value); HandleChange("Make", value); NormalValidate(value, 6) }}
                            />
                        </FormGroup>
                        <FormGroup label="Value" fieldId={"Autogen-value" + String(n)}>
                            <TextInput
                                isRequired
                                type="text"
                                id={"simple-form-name-" + String(n)}
                                name={"simple-form-name-" + String(n)}
                                validated={validated[7]}
                                value={Value}
                                onChange={(value) => { setValue(value); HandleChange("Value", value); NormalValidate(value, 7) }}
                            />
                        </FormGroup>
                    </GridItem>
                    <GridItem>
                        <FormGroup label="Project" fieldId={"Autogen-prj-" + String(n)}>
                            <TextInput
                                isRequired
                                type="text"
                                id={"simple-form-name-ct-" + String(n)}
                                name={"simple-form-name-ct-" + String(n)}
                                value={Project}
                                validated={validated[10]}
                                onChange={(value) => { setPrj(value); HandleChange("Project", value); NormalValidate(value, 10) }}
                            />
                        </FormGroup>
                        <FormGroup label="Cost" fieldId={"Autogen-cst-" + String(n)}>
                            <TextInput
                                isRequired
                                type="number"
                                id={"simple-form-name-ct-" + String(n)}
                                name={"simple-form-name-ct-" + String(n)}
                                value={cost}
                                validated={validated[11]}
                                onChange={(value) => { setCost(Number(value)); HandleChange("Cost", value); NormalValidate(value, 11) }}
                            />
                        </FormGroup>
                        <FormGroup label="GST %" fieldId={"Autogen-gst-" + String(n)}>
                            <TextInput
                                isRequired
                                type="number"
                                id={"simple-form-name-ct-" + String(n)}
                                name={"simple-form-name-ct-" + String(n)}
                                value={GST}
                                validated={validated[12]}
                                onChange={(value) => { setGST(Number(value)); HandleChange("GST", value); NormalValidate(value, 12) }}
                            />
                        </FormGroup>
                        <FormGroup label="Quantity" fieldId={"Autogen-qty-" + String(n)}>
                            <TextInput
                                isRequired
                                type="number"
                                id={"simple-form-name-qty-" + String(n)}
                                name={"simple-form-name-qty-" + String(n)}
                                value={Quantity}
                                validated={validated[9]}
                                onChange={(value) => { HandleQTYChange(value) }}
                            />
                        </FormGroup>
                        
                    </GridItem>
                    <GridItem>
                    <FormGroup label="Comments" fieldId={"Autogen-cmt-" + String(n)}>
                            <TextInput
                                isRequired
                                type="text"
                                id={"simple-form-name-ct-" + String(n)}
                                name={"simple-form-name-ct-" + String(n)}
                                value={Comment}
                                validated={validated[8]}
                                onChange={(value) => { setComment(value); HandleChange("Comments", value); NormalValidate(value, 8) }}
                            />
                        </FormGroup>
                    <FormGroup label="Estimated QTY" fieldId={"AUTOgen-qty" + String(n)}>
                            <Flex>
                                <Flex>
                                    <FlexItem>{updating && (
                                        <Spinner isSVG size="md" />
                                    )}</FlexItem>
                                    
                                    <FlexItem>
                                        {Operation && (
                                        <Title headingLevel="h2" size="3xl" >
                                        <Banner variant="success">{calculatedQTY}</Banner>
                                            </Title>
                                        )}
                                        {!Operation && (
                                        <Title headingLevel="h2" size="3xl" >
                                        <Banner variant="danger">{calculatedQTY}</Banner>
                                            </Title>
                                        )}
                                        </FlexItem>
                                        <FlexItem>
                                        {Operation && (
                                            <Label color="green" icon={<PlusCircleIcon />}>
                                            {Quantity} + {PrevQTY} = {calculatedQTY}
                                            </Label>
                                        )}
                                        {!Operation && (
                                            <Label color="red" icon={<MinusCircleIcon />}>
                                            {Quantity} - {PrevQTY} = {calculatedQTY}
                                            </Label>
                                        )
                                        }
                                        </FlexItem>
                                        
                                </Flex>
                            </Flex>
                        </FormGroup>
                        <FormGroup label="Sub Total" fieldId={"AUTOgen-subtotl" + String(n)}>
                                        
                                        <Title headingLevel="h2" size="3xl" >
                                        <Banner variant="info">{subTotal}</Banner>
                                            </Title>
                        </FormGroup>
                        <FormGroup label="Total" fieldId={"AUTOgen-totl" + String(n)}>
                                        
                                        <Title headingLevel="h2" size="3xl" >
                                        <Banner variant="success">{Total}</Banner>
                                            </Title>
                        </FormGroup>
                    </GridItem>
                </Grid>
            </FormFieldGroupExpandable>
        </React.Fragment>
    )
}
const GenerateForm = ({ n, ModifyDatafunc, error, ToSendData, SetOperation, Operation }: any) => {

    let Generated: any = []
    console.log(n)
    for (let i = 0; i < n; i++) {
        var data = ToSendData[i];
        Generated.push(<LoopRow PreData={data} error={error} Operation={Operation} n={i} ModifyData={ModifyDatafunc} key={i}></LoopRow>)
    }
    //console.log(Generated)
    return (
        <React.Fragment>
            {/* <Switch
                id="simple-switch"
                label="Recived"
                labelOff="Issued"
                isChecked={Operation}
                onChange={onOperationChange}
            />
            <br /> */}
            <Form>
                {(error) && (
                    <FormAlert>
                        <Alert
                            variant="danger"
                            title="Missing Required Feilds"
                            aria-live="polite"
                            isInline
                        />
                    </FormAlert>
                )}
                {Generated}
            </Form></React.Fragment>
    )
}

const ComponentDetails = ({ Operation, SetOperation, NumberEntries, ModifyData, error, ToSendData }: ComponentDetailsProps) => {
    console.log(NumberEntries)
    return (
        <GenerateForm error={error} Operation={Operation} SetOperation={SetOperation} n={NumberEntries} ToSendData={ToSendData} ModifyDatafunc={ModifyData} />
    )
}
export default ComponentDetails;