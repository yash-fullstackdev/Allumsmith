import React, { type Dispatch, type SetStateAction } from "react";
import Modal, { ModalBody, ModalFooter, ModalFooterChild, ModalHeader } from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import { deleted } from "../../../../utils/api-helper.util";
import { toast } from "react-toastify";
type props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectStatusId: string;
  setSelectStatusId: (value: string) => void;
  getTransportDetails: () => void;
};
const ConfirmDelete = ({ isOpen, setIsOpen, selectStatusId, setSelectStatusId, getTransportDetails}: props) => {
  const handleProductDelete = async () => {
    try {
      const response = await deleted(`/transport/${selectStatusId}`);
      setSelectStatusId('')
      getTransportDetails();
      toast.success("Transport entry deleted");
      setIsOpen(false);
    } catch (error: any) {
      toast.error( error.response?.data?.message || error.message);
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalHeader>Are you sure?</ModalHeader>
      <ModalFooter>
        <ModalFooterChild>
          Do you really want to delete these records? This cannot be undone.
        </ModalFooterChild>
        <ModalFooterChild>
          <Button
            onClick={() => {
              setIsOpen(false);
              setSelectStatusId("");
            }}
            color="blue"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant='solid'
            onClick={() => {
              handleProductDelete();
            }}>
            Delete
          </Button>
        </ModalFooterChild>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDelete