import { type Dispatch, type SetStateAction } from 'react';
import Modal, { ModalFooter, ModalFooterChild, ModalHeader } from '../../ui/Modal';
import Button from '../../ui/Button';

type props = {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleConform: () => void;
};
const DeleteConformationModal = ({ isOpen, setIsOpen, handleConform }: props) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalHeader>Are you sure?</ModalHeader>
      <ModalFooter>
        <ModalFooterChild>
          Do you really want to delete these records? This cannot be undone.
        </ModalFooterChild>
        <ModalFooterChild>
          <Button onClick={() => setIsOpen(false)} color='blue' variant='outlined'>
            Cancel
          </Button>
          <Button
            variant='solid'
            onClick={handleConform}>
            Delete
          </Button>
        </ModalFooterChild>
      </ModalFooter>
    </Modal>
  )
};

export default DeleteConformationModal;