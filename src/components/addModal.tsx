import React, { useContext, useEffect, useState } from 'react';
import { Modal, ModalVariant, Button, Form, FormGroup, Grid, GridItem, TextInput, FormFieldGroupExpandable, FormFieldGroupHeader, Alert, FormAlert, getUniqueId, Spinner } from '@patternfly/react-core';
import { getCustSuppliers, postCallCustSuppliers, putCallCustSupply } from '../services/APIservice';
import { Context } from 'src/store/store';
type ModalType = {
    addORedit: string;
    type: string;
    isEdit?: boolean;
    data? : any;
    editID?:string;
    sid?:string
    isModalOpen: boolean;
    setisModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

const AddModal = ({ addORedit, type, isEdit=false, data={}, editID='', sid='', isModalOpen, setisModalOpen }: ModalType) => {
    type validateType = "error" | "default" | "success" | "warning" | undefined
    const {state, dispatch} = useContext(Context);
    let validations: validateType[] = [];
    for (let i = 0; i <= 18; i++) {
        validations[i] = "default"
    }
    function ClearALL(){
        setname('');
        setSID('');
        setEmail('');
        setSPhone('');
        setNature('');
        setSGSTIN('');
        setBankName('');
        setAccountNum('');
        setAddressLine('');
        setAccountTyp('');
        setAccountName('');
        setIFSC('');
        setCity('');
        setState('');
        setPincode('');
        setCountry('');
        setCname('');
        setCEmail('');
        setCNo('');
        setValidated(validations);
    }
    const [progress, setProgress] = useState(false);
    
    const [name, setname] = useState('');
    const [SID, setSID] = useState('');
    const [SEmail, setEmail] = useState('');
    const [SPhone, setSPhone] = useState('');
    const [SPhoneV, setSPhoneV] = useState<validateType>("default")
    const [Nature, setNature] = useState('');
    const [SGSTIN, setSGSTIN] = useState('');
    const [vSGSTIN, setvSGSTIN] = useState<validateType>("default")
    const [BankName, setBankName] = useState('');
    const [AccountNumber, setAccountNum] = useState('');
    const [AccountType, setAccountTyp] = useState('');
    const [AccountName, setAccountName] = useState('');
    const [IFSC, setIFSC] = useState('');
    const [AddressLine, setAddressLine] = useState('');
    const [City, setCity] = useState('');
    const [State, setState] = useState('');
    const [Pincode, setPincode] = useState('');
    const [Country, setCountry] = useState('');
    const [Cname, setCname] = useState('');
    const [CEmail, setCEmail] = useState('');
    const [CNo, setCNo] = useState('');
    const [CNoV, setCNoV] = useState<validateType>("default")

    useEffect(()=>{
        if(isEdit){
        setname(data.SName ? data.SName : '');
        setSID(data.SID ? data.SID : '');
        setEmail(data.SEmail ? data.SEmail : '');
        setSPhone(data.SPhone ? data.SPhone : '');
        setNature(data.Nature ? data.Nature : '');
        setSGSTIN(data.SGSTIN ? data.SGSTIN : '');
        setAccountNum(data.BankingDetails['AccountNumber'] ? data.BankingDetails['AccountNumber'] : '')
        setBankName(data.BankingDetails['BankName'] ? data.BankingDetails['BankName'] : '');
        setAccountTyp(data.BankingDetails['AccountType'] ? data.BankingDetails['AccountType'] : '');
        setAccountName(data.BankingDetails['AccountName'] ? data.BankingDetails['AccountName'] : '');
        setIFSC(data.BankingDetails['IFSC'] ? data.BankingDetails['IFSC'] : '');
        setCity(data.SAddress['City']? data.SAddress['City'] : '');
        setAddressLine(data.SAddress['AddressLine']? data.SAddress['AddressLine'] : '')
        setState(data.SAddress['State']? data.SAddress['State'] : '');
        setPincode(data.SAddress['PinCode']? data.SAddress['PinCode'] : '');
        setCountry(data.SAddress['Country']? data.SAddress['Country'] : '');
        setCname(data.Contact['Name']? data.Contact['Name'] : '');
        setCEmail(data.Contact['Email']? data.Contact['Email'] : '');
        setCNo(data.Contact['No']? data.Contact['No'] : '')
        }
        else{
            ClearALL();
        }

    },[data, isEdit])

    function GetCustSuppliers(globalDispatch: any, mode){
        var Action = "APISuppliers"
        if(mode === 1){
            Action = "APICustomers"
        }
        //useEffect(()=>{
            getCustSuppliers(mode).then((res) => {
                if(res.code === 200){
                    console.log('here')
                    globalDispatch({ type: Action, data: res.data });
                }else {
                    globalDispatch({ type: "SET_ERROR", data: res });
                  }
            });
        //},[globalDispatch, mode, Action]);
        
    }

    const [validated, setValidated] = useState<validateType[]>(validations)

    function setValidInvalid(mode, index) {
        var temp = validated;
        temp[index] = mode;
        setValidated(temp);
    }
    function ValidatePhone(value, mode){
        var setter = setCNoV;
        if(mode === 1){
            setter = setSPhoneV;
        }
        if (value === '') setter("error")
        else{
            /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(value) ? setter("success") : setter("error") 
        }
    }
    function validate(value, i) {
        if (value === '') setValidInvalid("error", i);
        else {
            /^\d+$/.test(value) ? setValidInvalid("success", i) : setValidInvalid("error", 6)
        }
    }
    function NormalValidate(value, i) {
        if (value !== '') {
            setValidInvalid("success", i)
        }
        else{
            setValidInvalid("error", i)
        }
    }
    function EmailValidate(value, i) {
        if (/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value)) {
            setValidInvalid("success", i)
        } else {
            setValidInvalid("error", i);
        }
    }
    function GSTValidate(value) {
        if(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}[0-9A-Z]{1}$/.test(value)){
            setvSGSTIN("success")
        } else {
            setvSGSTIN("error")
        }
    }
    function onAdd(type, isEdit?:boolean, editID?:string, sid?:string) {
        var mode = 0;
        if(name === '' ||  SID  === '' || SPhone  === '' || SGSTIN  === '' || City  === '' || State  === '' || Pincode  === '' || Country  === '' || Cname  === '' || CEmail  === '' || CNo  === '' || BankName  === '' || AccountName  === '' || AccountType  === '' || IFSC  === '' || Nature  === '' || AddressLine === '' || AccountNumber === ''){
            for(let i=0;i<18;i++){
                setValidInvalid("error", i)
            }
            setvSGSTIN("error")
            setSPhoneV("error")
            setCNoV("error")
            return;
        }
        if(type === 'Customers'){
            mode = 1
        } 
            var DatatoSend = {
                SName: name,
                SID: SID,
                SEmail: SEmail,
                SPhone: Number(SPhone),
                SGSTIN: SGSTIN,
                SAddress: {
                    AddressLine: AddressLine,
                    City: City,
                    State: State,
                    PinCode: Number(Pincode),
                    Country: Country
                },
                Contact: {
                    Name: Cname,
                    Email: CEmail,
                    No: Number(CNo)
                },
                BankingDetails: {
                    AccountNumber: AccountNumber,
                    BankName: BankName,
                    AccountName: AccountName,
                    AccountType: AccountType,
                    IFSC: IFSC
                },
                Nature: Nature
            }
            if(isEdit && editID!== '' && sid !== ''){
                putCallCustSupply(editID, sid, DatatoSend, mode).then((res) => {
                    setProgress(true);
                    if (res.code === 200) {
                        //alert("Added!")
                        const successAlert = {
                            title: "["+ res.code + "] Edit " + type + " Success!",
                            details: res.data.toString(),
                            key: getUniqueId(),
                            variant: "success"
                        }
                        dispatch({type: "ADD_Alert", data: successAlert});
                        GetCustSuppliers(dispatch, mode);
                        setProgress(false);

                        setisModalOpen(false)
                    } else {
                        setProgress(false);
                        setisModalOpen(false);
                        const errorAlert = {
                            title: "["+ res.code + "] Edit " + type + " Error!",
                            details: res.data.toString(),
                            key: getUniqueId(),
                            variant: "danger"
                        }
                        //GetCustSuppliers(dispatch, mode);
                        dispatch({type: "ADD_Alert", data: errorAlert});
                    }
                });
            }
            else{
            postCallCustSuppliers(DatatoSend, mode).then((res) => {
                setProgress(true);
                if (res.code === 200) {
                    //alert("Added!")
                    const successAlert = {
                        title: "["+ res.code + "] Add " + type + " Success!",
                        details: res.data.toString(),
                        key: getUniqueId(),
                        variant: "success"
                    }
                    dispatch({type: "ADD_Alert", data: successAlert});
                    GetCustSuppliers(dispatch, mode);
                    setProgress(false);
                    setisModalOpen(false)
                } else {
                    setProgress(false);
                    setisModalOpen(false);
                    const errorAlert = {
                        title: "["+ res.code + "] Add " + type + " Error!",
                        details: res.data.toString(),
                        key: getUniqueId(),
                        variant: "danger"
                    }
                    dispatch({type: "ADD_Alert", data: errorAlert});
                }
            });
        }

    }
    return (
        <React.Fragment>
            {/* <Button variant="primary" onClick={() => setisModalOpen(true)}>
                Add {type}
            </Button> */}
            <Modal
                variant={ModalVariant.medium}
                title={addORedit + ' ' + type + ' Dailog'}
                isOpen={isModalOpen}
                onClose={() => {ClearALL(); setisModalOpen(false)}}
                actions={[
                    <Button key="confirm" variant="primary" onClick={() => onAdd(type, isEdit, editID, sid)}>
                        {addORedit}
                    </Button>,
                    <Button key="cancel" variant="link" onClick={() => setisModalOpen(false)}>
                        Cancel
                    </Button>
                ]}
            >
                {progress && (
                     <Spinner isSVG diameter="80px" />
                )}
                {!progress && (<Form>
                {(validated.some(r => validated.indexOf("error") >= 1) )&& (
                                <FormAlert>
                                    <Alert
                                        variant="danger"
                                        title="Fill out all required fields before continuing."
                                        aria-live="polite"
                                        isInline
                                    />
                                </FormAlert>
                            )
                    }
                    {(CNoV === 'error' || SPhoneV === 'error') && (
                        <FormAlert>
                            <Alert
                                variant="warning"
                                title="Form Contains Invalid Phone Numbers!"
                                aria-live="polite"
                                isInline
                            />
                        </FormAlert>
                    )}
                    <Grid hasGutter md={6}>
                        <GridItem span={12}>
                            <FormGroup label={ type + " Id"} isRequired fieldId="grid-form-name-01" helperText="Please Enter the Supplier ID">
                                <TextInput
                                    isRequired
                                    type="text"
                                    id="grid-form-name-01"
                                    name="grid-form-name-01"
                                    aria-describedby="grid-form-name-01-helper"
                                    value={SID}
                                    validated={validated[2]}
                                    onChange={(value) => { setSID(value); NormalValidate(value, 2) }}
                                />
                            </FormGroup>
                            <FormGroup label="Full name" isRequired fieldId="grid-form-name-02" helperText="Include your middle name if you have one.">
                                <TextInput
                                    isRequired
                                    type="text"
                                    id="grid-form-name-02"
                                    name="grid-form-name-02"
                                    validated={validated[0]}
                                    aria-describedby="grid-form-name-01-helper"
                                    value={name}
                                    onChange={(value) => { setname(value); NormalValidate(value, 0) }}
                                />
                            </FormGroup>
                            <FormGroup label="GSTIN" isRequired fieldId="grid-form-name-03" helperText="Include your middle name if you have one.">
                                <TextInput
                                    isRequired
                                    type="text"
                                    id="grid-form-name-03"
                                    name="grid-form-name-03"
                                    validated={vSGSTIN}
                                    aria-describedby="grid-form-name-01-helper"
                                    value={SGSTIN}
                                    onChange={(value) => { setSGSTIN(value.toUpperCase()); GSTValidate(value) }}
                                />
                            </FormGroup>
                            <FormGroup label="Nature of Product/Services" isRequired fieldId="grid-form-name-04" helperText="Include your middle name if you have one.">
                                <TextInput
                                    isRequired
                                    type="text"
                                    id="grid-form-name-04"
                                    name="grid-form-name-04"
                                    validated={validated[15]}
                                    aria-describedby="grid-form-name-01-helper"
                                    value={Nature}
                                    onChange={(value) => { setNature(value); NormalValidate(value, 15) }}
                                />
                            </FormGroup>
                        </GridItem>
                        <FormGroup label="Email" isRequired fieldId="grid-form-email-01">
                            <TextInput
                                isRequired
                                type="email"
                                id="grid-form-email-01"
                                name="grid-form-email-01"
                                validated={validated[3]}
                                value={SEmail}
                                onChange={(value) => { setEmail(value); EmailValidate(value, 3) }}
                            />
                        </FormGroup>
                        <FormGroup label="Phone number" isRequired fieldId="grid-form-number-01">
                            <TextInput
                                isRequired
                                type="tel"
                                id="grid-form-number-01"
                                placeholder="555-555-5555"
                                validated={SPhoneV}
                                name="grid-form-number-01"
                                value={SPhone}
                                onChange={(value) => { setSPhone(value); ValidatePhone(value, 1); }}
                            />
                        </FormGroup>
                        <GridItem span={12}>
                            <FormFieldGroupExpandable
                                toggleAriaLabel="Banking Details"
                                header={
                                    <FormFieldGroupHeader
                                        titleText={{ text: 'Banking Details', id: 'field-group2-titleText-id' }}
                                        titleDescription="Please Enter the Banking Details Here."
                                    />
                                }
                            >
                                <Grid hasGutter md={6}>
                                    <FormGroup label="Bank Name" isRequired fieldId="form-expandable-field-group2-label1">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group2-label1"
                                            name="form-expandable-field-group2-label1"
                                            value={BankName}
                                            validated={validated[11]}
                                            onChange={value => {
                                                setBankName(value); NormalValidate(value, 11)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Account Name" isRequired fieldId="form-expandable-field-group2-label2">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group2-label2"
                                            name="form-expandable-field-group2-label2"
                                            validated={validated[12]}
                                            value={AccountName}
                                            onChange={value => {
                                                setAccountName(value); NormalValidate(value, 12)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Account Number" isRequired fieldId="form-expandable-field-group2-label0">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group2-label0"
                                            name="form-expandable-field-group2-label0"
                                            validated={validated[16]}
                                            value={AccountNumber}
                                            onChange={value => {
                                                setAccountNum(value); NormalValidate(value, 16)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Account Type" isRequired fieldId="form-expandable-field-group2-label3">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group2-label3"
                                            name="form-expandable-field-group2-label3"
                                            validated={validated[13]}
                                            value={AccountType}
                                            onChange={value => {
                                                setAccountTyp(value); NormalValidate(value, 13)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="IFSC Code" isRequired fieldId="form-expandable-field-group2-label4">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group2-label4"
                                            name="form-expandable-field-group2-label4"
                                            validated={validated[14]}
                                            value={IFSC}
                                            onChange={value => {
                                                setIFSC(value); NormalValidate(value, 14)
                                            }}
                                        />
                                    </FormGroup>
                                </Grid>
                            </FormFieldGroupExpandable>
                        </GridItem>
                        <GridItem span={12}>
                            <FormFieldGroupExpandable
                                toggleAriaLabel="Address"
                                header={
                                    <FormFieldGroupHeader
                                        titleText={{ text: 'Address Details', id: 'field-group3-titleText-id' }}
                                        titleDescription="Please Enter the Banking Details Here."
                                    />
                                }
                            >
                                <Grid hasGutter md={6}>
                                <FormGroup label="Address Line" isRequired fieldId="form-expandable-field-group3-label0">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group3-label0"
                                            name="form-expandable-field-group3-label0"
                                            validated={validated[17]}
                                            value={AddressLine}
                                            onChange={value => {
                                                setAddressLine(value); NormalValidate(value, 17)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="City" isRequired fieldId="form-expandable-field-group3-label1">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group3-label1"
                                            name="form-expandable-field-group3-label1"
                                            validated={validated[4]}
                                            value={City}
                                            onChange={value => {
                                                setCity(value); NormalValidate(value, 4)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="State" isRequired fieldId="form-expandable-field-group3-label2">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group3-label2"
                                            validated={validated[5]}
                                            name="form-expandable-field-group3-label2"
                                            value={State}
                                            onChange={value => {
                                                setState(value); NormalValidate(value, 5)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Pincode" isRequired fieldId="form-expandable-field-group3-label3">
                                        <TextInput
                                            isRequired
                                            type="number"
                                            id="form-expandable-field-group3-label3"
                                            name="form-expandable-field-group3-label3"
                                            validated={validated[6]}
                                            value={Pincode}
                                            onChange={value => {
                                                setPincode(value); validate(value, 6)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Country" isRequired fieldId="form-expandable-field-group3-label4">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group3-label4"
                                            name="form-expandable-field-group3-label4"
                                            validated={validated[7]}
                                            value={Country}
                                            onChange={value => {
                                                setCountry(value); NormalValidate(value, 7)
                                            }}
                                        />
                                    </FormGroup>
                                </Grid>
                            </FormFieldGroupExpandable>
                        </GridItem>
                        <GridItem span={12}>
                            <FormFieldGroupExpandable
                                toggleAriaLabel="Contact"
                                header={
                                    <FormFieldGroupHeader
                                        titleText={{ text: 'Contact Details', id: 'field-group4-titleText-id' }}
                                        titleDescription="Please Enter the Banking Details Here."
                                    />
                                }
                            >
                                <Grid hasGutter md={6}>
                                    <FormGroup label="Name" isRequired fieldId="form-expandable-field-group4-label1">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group4-label1"
                                            name="form-expandable-field-group4-label1"
                                            validated={validated[8]}
                                            value={Cname}
                                            onChange={value => {
                                                setCname(value); NormalValidate(value, 8)
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Email" isRequired fieldId="form-expandable-field-group4-label2">
                                        <TextInput
                                            isRequired
                                            id="form-expandable-field-group4-label2"
                                            name="form-expandable-field-group4-label2"
                                            validated={validated[9]}
                                            type="email"
                                            value={CEmail}
                                            onChange={value => {
                                                setCEmail(value); EmailValidate(value, 9);
                                            }}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Number" isRequired fieldId="form-expandable-field-group4-label3">
                                        <TextInput
                                            isRequired
                                            type="tel"
                                            id="form-expandable-field-group4-label3"
                                            validated={CNoV}
                                            name="form-expandable-field-group4-label3"
                                            value={CNo}
                                            onChange={value => {
                                                setCNo(value); ValidatePhone(value, 0);
                                            }}
                                        />
                                    </FormGroup>
                                </Grid>
                            </FormFieldGroupExpandable>
                        </GridItem>
                    </Grid>
                </Form>)}
            </Modal>
        </React.Fragment>
    );
}

export default AddModal;