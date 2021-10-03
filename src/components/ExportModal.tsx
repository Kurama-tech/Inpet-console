import { Modal, ModalVariant, Button, getUniqueId, Spinner, Alert } from '@patternfly/react-core';
import React, { useContext, useEffect, useState } from 'react';
import CsvDownload from 'react-json-to-csv'

type ExportModalType = {
    data: any;
    type:string;
    isModalOpen: boolean;
    setisModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExportModal = ({data, type, isModalOpen, setisModalOpen}: ExportModalType) => {
    var date = Date.now();
    const Const_filename = 'Export_'+ type + '_' + date.toString() + '.csv'
    const [filename, setFname] = useState(Const_filename);
    
    return (
        <Modal
          variant={ModalVariant.small}
          title={"Export: " + type}
          isOpen={isModalOpen}
          onClose={() => setisModalOpen(false)}
          actions={[
            <CsvDownload key="Download" filename={filename} data={data}></CsvDownload>,
            <Button key="cancel" variant="link" onClick={() => setisModalOpen(false)}>
              Cancel
            </Button>
          ]}
        >
            <Alert variant="danger" isInline title={"You Are Exporting  " + data.length + ' items' } />
        </Modal>
    )
}

export default ExportModal;