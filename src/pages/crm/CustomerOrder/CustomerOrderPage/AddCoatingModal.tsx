import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Modal, { ModalBody, ModalHeader } from "../../../../components/ui/Modal";
import { useFormik } from "formik";
import Button from "../../../../components/ui/Button";
import { CoatingSchema } from "../../../../utils/formValidations";
import { toast } from "react-toastify";
import { post } from "../../../../utils/api-helper.util";
import CoatingForm from "../../../../components/PageComponets/CoatingForm/CoatingForm";


type props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  defaultValue: { name: string; index: number | null; };
  fetchData: (value: any, index: number) => void;
  entries: any[];
  setEntries: (value: any) => void;
};

const AddCoatingModal = ({ isOpen, setIsOpen, defaultValue, fetchData, entries, setEntries }: props) => {
  const initialValues = {
    name: defaultValue?.name || '',
    code: '',
    colors: [],
    type: ''
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema: CoatingSchema,
    onSubmit: async (value) => {
      try {
        const response: any = await post('/coatings', value);
        fetchData(response?.data?._id, defaultValue?.index as number);
        toast.success('Data saved Successfully!');
        const updatedData = entries?.map((item: any, index: number) => {
          if (index === defaultValue?.index) {
            return {
              ...item,
              coating: response?.data?._id
            }
          }
          return item;
        });
        setEntries(updatedData)
        setIsOpen(false);
      } catch (error) {
        console.error("Error Saving Data:", error);
        toast.error('Failed to save data. Please try again.');
      }
    }
  });


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isScrollable fullScreen>
      <ModalHeader
        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
      // onClick={() => formik.resetForm()}
      >
        Add Coating
      </ModalHeader>
      <ModalBody className="h-full">
        <CoatingForm formik={formik} />
        <div className='flex mt-2 gap-2'>
          <Button variant='solid' color='blue' isDisable={formik.values.name === ''} onClick={() => formik.handleSubmit()}>
            Save Entries
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
};

export default AddCoatingModal