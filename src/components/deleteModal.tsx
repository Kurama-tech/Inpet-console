import { Modal, ModalVariant, Button, getUniqueId, Spinner, Alert } from '@patternfly/react-core';
import React, { useContext, useEffect, useState } from 'react';
import { deleteCustSuppliers, getCustSuppliers } from 'src/services/APIservice';
import { Context } from 'src/store/store';

type DeleteModalType = {
    Sid?: string;
    type:string;
    id?: string;
    isModalOpen: boolean;
    setisModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteModal = ({Sid='', type, id='', isModalOpen, setisModalOpen}: DeleteModalType) => {
    const {state, dispatch} = useContext(Context);
    const [progress, setProgress] = useState(false);
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

    function deleteSupplierCustomer(){
        var mode = 0
        if(type === 'Customers'){
          mode = 1
        }
        if(id !== '' && Sid !== ''){
        deleteCustSuppliers(mode, id).then((res) => {
            setProgress(true);
          if (res.code === 200) {
              //alert("Added!")
              const successAlert = {
                  title: "["+ res.code + "] Delete" + type + " Success!",
                  details: res.data.toString(),
                  key: getUniqueId(),
                  variant: "success"
              }
              dispatch({type: "ADD_Alert", data: successAlert});
              GetCustSuppliers(dispatch, mode)
              setProgress(false);
              setisModalOpen(false)
          } else {
              setProgress(false);
              setisModalOpen(false);
              const errorAlert = {
                  title: "["+ res.code + "] delete " + type + " Error!",
                  details: res.data.toString(),
                  key: getUniqueId(),
                  variant: "danger"
              }
              dispatch({type: "ADD_Alert", data: errorAlert});
          }
      });}
    
      }
    return (
        <Modal
          variant={ModalVariant.small}
          title={"Delete " + Sid}
          isOpen={isModalOpen}
          onClose={() => setisModalOpen(false)}
          actions={[
            <Button key="confirm" variant="danger" onClick={deleteSupplierCustomer}>
              Delete
            </Button>,
            <Button key="cancel" variant="link" onClick={() => setisModalOpen(false)}>
              Cancel
            </Button>
          ]}
        >
            {progress && (
                     <Spinner isSVG diameter="80px" />
                )}
                {!progress && ( <Alert variant="danger" isInline title={"Are you Sure you want to delete " + Sid } />)}
        </Modal>
    )
}

export default DeleteModal;