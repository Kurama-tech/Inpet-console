import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Context } from 'src/store/store';
import { getCategories} from '../services/APIservice';
import { ActionGroup, Button, Checkbox, Grid, GridItem, DatePicker, Form, FormGroup, ValidatedOptions, FormHelperText, FormSelect, FormSelectOption, NumberInput, Text, TextArea, TextInput, Wizard, Radio, TextVariants, FormFieldGroupExpandable, FormFieldGroupHeader, Divider, Switch, Alert, FormAlert } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

type ComponentDetailsProps = {
    NumberEntries: Number;
    ModifyData: (index: any, value: any) => void;
    error: boolean;

}

type LoopRowProps = {
    n: any;
    error: boolean;
    ModifyData: (index: any, value: any) => void;
}

const LoopRow = ({n, ModifyData} : LoopRowProps) => {
    const {state, dispatch} = useContext(Context);
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
    const [SubCat, setSubCat]= useState("Select");
    const [Termination, setTermination] = useState("Select");
    const [Package, setPackage] = useState("Select");
    const [Pno, setPno] = useState("");
    const [Make, setMake] = useState("");
    const [Description, setDescription] = useState("");
    const [Value, setValue] = useState("");
    const [Comment, setComment] = useState("");
    const [Quantity, setQuantity] = useState("");
    type validateType = "error" | "default" | "success" | "warning" | undefined
    let validations: validateType[] = [];
    for (let i = 0; i < 10; i++) {
        validations[i] = "default"
    }
    const [categoriesList, setCatagoriesList] = useState<any>([]);
    const [terminationlist, setTerminationList] = useState<any>([]);
    const [packagelist, setpackageList] = useState<any>([]);
    const [SubCats, setSubCats] = useState<any>([]);
    const [validated, setValidated] = useState<validateType[]>(validations)

    
    const HandleChange =(key, value) =>{
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
        else{
            setValidInvalid("error", i)
        }
    }
    const onCatSelectChange = (value, event) => {
        setCategory(value);
        NormalValidate(value, 0)
        HandleChange("Category", value)
        categoriesList.forEach(element => {
            if(element.value === value){
                let temp : any = []
                temp.push({value: 'Select', label: 'Select', disabled: true})
                element.sub.forEach((value)=> {
                    let k = {value: value, label: value, disabled : false}
                    temp.push(k)
                });
                setSubCats(temp)
             }
        });
        
    }
    const onSubCatSelect = (value, event) => {
        setSubCat(value);
        NormalValidate(value, 1)
        HandleChange("SubCat", value)
    }
    const onTerminationChange = (value, event) => {
        setTermination(value);
        NormalValidate(value, 2)
        HandleChange("Termination", value)
    }
    const onPackageChange = (value, event) => {
        setPackage(value);
        NormalValidate(value, 3)
        HandleChange("Package", value)
    }

    useEffect(()=>{
        setCatagoriesList(state.trimcategories);
        setTerminationList(state.termination);
        //setTermination(state.termination[1]?.value);
        setpackageList(state.package);
    },[categoriesList, setCatagoriesList, terminationlist, packagelist, setTerminationList, setpackageList, state])
    return (
        <React.Fragment>
            <FormFieldGroupExpandable
                                toggleAriaLabel={"Entry "+ Number(n+1)}
                                header={
                                    <FormFieldGroupHeader
                                        titleText={{ text: "Entry "+ Number(n+1), id: 'field-group2-titleText-id' }}
                                        titleDescription="Expand This And Fill up the Details for the Specific Entry"
                                    />
                                }
                            >
           
            <Grid hasGutter md={4}>
                <GridItem>
                <FormGroup label="Category" fieldId={"Autogen-cat-" + String(n)}>
                <FormSelect  value={Category} onChange={onCatSelectChange} validated={validated[0]} isRequired aria-label="Select Category">
                    {
                        categoriesList.map((option, index) => (
                            <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
                        ))
                    }
                </FormSelect>
                </FormGroup>
                <FormGroup label="Sub Category" fieldId={"Autogen-sub-" + String(n)}>
                <FormSelect  value={SubCat} onChange={onSubCatSelect} validated={validated[1]} isRequired aria-label="Select Sub Category">
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
                <FormSelect  value={Termination} onChange={onTerminationChange} validated={validated[2]} isRequired aria-label="Select Termination">
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
                <FormSelect  value={Package} onChange={onPackageChange} isRequired validated={validated[3]} aria-label="Select Package">
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
                    id={"simple-form-name-pr-"+ String(n) }
                    name={"simple-form-name-pr-"+ String(n) }
                    value={Pno}
                    validated={validated[4]}
                    onChange={(value)=> {setPno(value); HandleChange("PartNo", value); NormalValidate(value, 4)}}
                />
                </FormGroup>
                <FormGroup label="Description" fieldId={"Autogen-des" + String(n)}>
                <TextInput
                    isRequired
                    type="text"
                    id={"simple-form-name-d-"+ String(n) }
                    name={"simple-form-name-d-"+ String(n) }
                    value={Description}
                    validated={validated[5]}
                    onChange={(value)=> {setDescription(value); HandleChange("Description", value); NormalValidate(value, 5)}}
                />
                </FormGroup>
                <FormGroup label="Make" fieldId={"Autogen-mke" + String(n)}>
                <TextInput
                    isRequired
                    type="text"
                    id={"simple-form-name-m-"+ String(n) }
                    name={"simple-form-name-m-"+ String(n) }
                    value={Make}
                    validated={validated[6]}
                    onChange={(value)=> {setMake(value); HandleChange("Make", value); NormalValidate(value, 6)}}
                />
                </FormGroup>
                <FormGroup label="Value" fieldId={"Autogen-value" + String(n)}>
                <TextInput
                    isRequired
                    type="text"
                    id={"simple-form-name-"+ String(n) }
                    name={"simple-form-name-"+ String(n) }
                    validated={validated[7]}
                    value={Value}
                    onChange={(value)=> {setValue(value); HandleChange("Value", value); NormalValidate(value, 7)}}
                />
                </FormGroup>
                </GridItem>
                <GridItem>
                
                <FormGroup label="Comments" fieldId={"Autogen-cmt-" + String(n)}>
                <TextInput
                    isRequired
                    type="text"
                    id={"simple-form-name-ct-"+ String(n) }
                    name={"simple-form-name-ct-"+ String(n) }
                    value={Comment}
                    validated={validated[8]}
                    onChange={(value)=> {setComment(value); HandleChange("Comments", value); NormalValidate(value, 8)}}
                />
                </FormGroup>
                <FormGroup label="Quantity" fieldId={"Autogen-qty-" + String(n)}>
                <TextInput
                    isRequired
                    type="number"
                    id={"simple-form-name-qty-"+ String(n) }
                    name={"simple-form-name-qty-"+ String(n) }
                    value={Quantity}
                    validated={validated[9]}
                    onChange={(value)=> {setQuantity(value); HandleChange("Quantity", value); NormalValidate(value, 9)}}
                />
                </FormGroup>
                
                </GridItem>
            </Grid>
            </FormFieldGroupExpandable>
        </React.Fragment>
    )
}
const GenerateForm = ({n, ModifyDatafunc, error} : any) => {
    
    let Generated : any = []
    const [Operation, SetOperation] = useState(true);
    const onOperationChange = (value) => {
        SetOperation(value)
    }
    
    console.log(n)
    for(let i=0;i<n;i++){
        Generated.push(<LoopRow error={error} n={i} ModifyData={ModifyDatafunc} key={i}></LoopRow>)
    }
    //console.log(Generated)
    return (
        <React.Fragment>
            <Switch
                    id="simple-switch"
                    label="Selected Operation Addition/Plus(+)"
                    labelOff="Selected Operation Removal/Minus(-)"
                    isChecked={Operation}
                    onChange={onOperationChange}
                />
                <br />
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

const ComponentDetails = ({NumberEntries, ModifyData, error}: ComponentDetailsProps) => {
    console.log(NumberEntries)
    return (
        <GenerateForm  error={error} n={NumberEntries} ModifyDatafunc={ModifyData} />
    )
}
export default ComponentDetails;