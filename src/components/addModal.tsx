import React, { useState } from 'react';
import { Modal, ModalVariant, Button, Form, FormGroup, Grid, GridItem, TextInput, FormFieldGroupExpandable, FormFieldGroupHeader, Alert, FormAlert } from '@patternfly/react-core';
import {postSuppliers} from '../services/APIservice';
type ModalType = {
    type: string
}

const AddModal = ({type}: ModalType) => {
    const [isModalOpen, setisModalOpen] = useState(false);
    const [name, setname] = useState('');
    const [SID, setSID] = useState('');
    const [SEmail, setEmail] = useState('');
    const [SPhone, setSPhone] = useState('');
    const [Nature, setNature] = useState('');
    const [SGSTIN, setSGSTIN] = useState('');
    const [BankName, setBankName] = useState('');
    const [AccountType, setAccountTyp] = useState('');
    const [AccountName, setAccountName] = useState('');
    const [IFSC, setIFSC] = useState('');
    const [City, setCity] = useState('');
    const [State, setState] = useState('');
    const [Pincode, setPincode] = useState('');
    const [Country, setCountry] = useState('');
    const [Cname, setCname] = useState('');
    const [CEmail, setCEmail] = useState('');
    const [CNo, setCNo] = useState('');
    type validateType = "error" | "default" | "success" | "warning" | undefined
    const [validated, setValidated] = useState<validateType>("default")

    function validate(value){
        if(value === '') setValidated("default");
        else{
            /^\d+$/.test(value) ? setValidated("success"): setValidated("error")
        }
    }
    function onAdd(type){
        if (name === '' || SID === '' || SEmail === '' || SPhone === '' ||SGSTIN === ''|| City === ''
            || State === ''|| Pincode === ''|| Country === ''|| Cname === ''
            || CEmail === '' || CNo === '' || BankName === '' || AccountName === '' || AccountType === '' || IFSC === '' || Nature === '')
            {
                setValidated("error");
                return
            }
        else {

        setValidated("success")
        var DatatoSend = {
            SName: name,
            SID: SID,
            SEmail: SEmail,
            SPhone: Number(SPhone),
            SGSTIN: SGSTIN,
            SAddress: {
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
                BankName: BankName,
                AccountName: AccountName,
                AccountType: AccountType,
                IFSC: IFSC
            },
            Nature: Nature
        }
        postSuppliers(DatatoSend).then((res) => {
            if(res.code === 200){
                alert("Added!")
                setisModalOpen(false)
            }else {
                setisModalOpen(false)
                alert("Error!")
              }
        });
    }

    }
    return (
        <React.Fragment>
          <Button variant="primary" onClick={()=>setisModalOpen(true)}>
            Add {type}
          </Button>
          <Modal
            variant={ModalVariant.medium}
            title={'Add '+ type + ' Dailog'}
            isOpen={isModalOpen}
            onClose={()=>setisModalOpen(false)}
            actions={[
              <Button key="confirm" variant="primary" onClick={()=>onAdd(type)}>
                Add
              </Button>,
              <Button key="cancel" variant="link" onClick={()=>setisModalOpen(false)}>
                Cancel
              </Button>
            ]}
          >
           <Form>
           {validated === 'error' && (
          <FormAlert>
            <Alert
              variant="danger"
              title="Fill out all required fields before continuing."
              aria-live="polite"
              isInline
            />
          </FormAlert>
        )}
        <Grid hasGutter md={6}>
          <GridItem span={12}>
            <FormGroup label="Supplier Id" isRequired fieldId="grid-form-name-01" helperText="Please Enter the Supplier ID">
              <TextInput
                isRequired
                type="text"
                id="grid-form-name-01"
                name="grid-form-name-01"
                aria-describedby="grid-form-name-01-helper"
                value={SID}
                //validated={validated}
                onChange={(value) => { setSID(value); validate(value)}}
              />
            </FormGroup>
            <FormGroup label="Full name" isRequired fieldId="grid-form-name-02" helperText="Include your middle name if you have one.">
              <TextInput
                isRequired
                type="text"
                id="grid-form-name-02"
                name="grid-form-name-02"
                //validated={validated}
                aria-describedby="grid-form-name-01-helper"
                value={name}
                onChange={(value) => { setname(value); validate(value) }}
              />
            </FormGroup>
            <FormGroup label="GSTIN" isRequired fieldId="grid-form-name-03" helperText="Include your middle name if you have one.">
              <TextInput
                isRequired
                type="text"
                id="grid-form-name-03"
                name="grid-form-name-03"
                //validated={validated}
                aria-describedby="grid-form-name-01-helper"
                value={SGSTIN}
                onChange={(value) => { setSGSTIN(value); validate(value) }}
              />
            </FormGroup>
            <FormGroup label="Nature of Product/Services" isRequired fieldId="grid-form-name-04" helperText="Include your middle name if you have one.">
              <TextInput
                isRequired
                type="text"
                id="grid-form-name-04"
                name="grid-form-name-04"
                //validated={validated}
                aria-describedby="grid-form-name-01-helper"
                value={Nature}
                onChange={(value) => { setNature(value); validate(value)}}
              />
            </FormGroup>
          </GridItem>
          <FormGroup label="Email" isRequired fieldId="grid-form-email-01">
            <TextInput
              isRequired
              type="email"
              id="grid-form-email-01"
              name="grid-form-email-01"
              //validated={validated}
              value={SEmail}
              onChange={(value) => { setEmail(value); validate(value) }}
            />
          </FormGroup>
          <FormGroup label="Phone number" isRequired fieldId="grid-form-number-01">
            <TextInput
              isRequired
              type="tel"
              id="grid-form-number-01"
              placeholder="555-555-5555"
              //validated={validated}
              name="grid-form-number-01"
              value={SPhone}
              onChange={(value) => { setSPhone(value); validate(value) }}
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
              //validated={validated}
              onChange={value => {
                setBankName(value); validate(value)
              }}
            />
          </FormGroup>
          <FormGroup label="Account Name" isRequired fieldId="form-expandable-field-group2-label2">
            <TextInput
              isRequired
              id="form-expandable-field-group2-label2"
              name="form-expandable-field-group2-label2"
              //validated={validated}
              value={AccountName}
              onChange={value => {
               setAccountName(value); validate(value)
              }}
            />
          </FormGroup>
          <FormGroup label="Account Type" isRequired fieldId="form-expandable-field-group2-label3">
            <TextInput
              isRequired
              id="form-expandable-field-group2-label3"
              name="form-expandable-field-group2-label3"
              //validated={validated}
              value={AccountType}
              onChange={value => {
                setAccountTyp(value); validate(value)
              }}
            />
          </FormGroup>
          <FormGroup label="IFSC Code" isRequired fieldId="form-expandable-field-group2-label4">
            <TextInput
              isRequired
              id="form-expandable-field-group2-label4"
              name="form-expandable-field-group2-label4"
              //validated={validated}
              value={IFSC}
              onChange={value => {
                setIFSC(value); validate(value)
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
          <FormGroup label="City" isRequired fieldId="form-expandable-field-group3-label1">
            <TextInput
              isRequired
              id="form-expandable-field-group3-label1"
              name="form-expandable-field-group3-label1"
              //validated={validated}
              value={City}
              onChange={value => {
                setCity(value); validate(value)
              }}
            />
          </FormGroup>
          <FormGroup label="State" isRequired fieldId="form-expandable-field-group3-label2">
            <TextInput
              isRequired
              id="form-expandable-field-group3-label2"
              //validated={validated}
              name="form-expandable-field-group3-label2"
              value={State}
              onChange={value => {
               setState(value); validate(value)
              }}
            />
          </FormGroup>
          <FormGroup label="Pincode" isRequired fieldId="form-expandable-field-group3-label3">
            <TextInput
              isRequired
              type="number"
              id="form-expandable-field-group3-label3"
              name="form-expandable-field-group3-label3"
              //validated={validated}
              value={Pincode}
              onChange={value => {
                setPincode(value); validate(value)
              }}
            />
          </FormGroup>
          <FormGroup label="Country" isRequired fieldId="form-expandable-field-group3-label4">
            <TextInput
              isRequired
              id="form-expandable-field-group3-label4"
              name="form-expandable-field-group3-label4"
              //validated={validated}
              value={Country}
              onChange={value => {
                setCountry(value); validate(value)
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
              //validated={validated}
              value={Cname}
              onChange={value => {
                setCname(value); validate(value)
              }}
            />
          </FormGroup>
          <FormGroup label="Email" isRequired fieldId="form-expandable-field-group4-label2">
            <TextInput
              isRequired
              id="form-expandable-field-group4-label2"
              name="form-expandable-field-group4-label2"
              //validated={validated}
              type="email"
              value={CEmail}
              onChange={value => {
               setCEmail(value); validate(value)
              }}
            />
          </FormGroup>
          <FormGroup label="Number" isRequired fieldId="form-expandable-field-group4-label3">
            <TextInput
              isRequired
              type="number"
              id="form-expandable-field-group4-label3"
              //validated={validated}
              name="form-expandable-field-group4-label3"
              value={CNo}
              onChange={value => {
                setCNo(value); validate(value)
              }}
            />
          </FormGroup>
          </Grid>
        </FormFieldGroupExpandable>
        </GridItem>
        </Grid>
      </Form>
          </Modal>
        </React.Fragment>
      );
}

export default AddModal;