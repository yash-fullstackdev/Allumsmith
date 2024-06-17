import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Modal, { ModalBody, ModalFooter, ModalFooterChild, ModalHeader } from "../../../../components/ui/Modal";
import Card from "../../../../components/ui/Card";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { get, put } from "../../../../utils/api-helper.util";
import Input from "../../../../components/form/Input";
import Button from "../../../../components/ui/Button";
import { updateTransportStatusSchema } from "../../../../utils/formValidations";
import { PathRoutes } from "../../../../utils/routes/enum";
import { useNavigate } from "react-router-dom";

type props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectStatusId: string;
  getTransportDetails: () => void;
};

const UpdateStatusModal = ({ isOpen, setIsOpen, selectStatusId, getTransportDetails }: props) => {
  const navigation = useNavigate();
  const [workerData, setWorkerData] = useState<any>([]);
  const [powderData, setPowderData] = useState<any>([]);

  const getWorkers = async () => {
    try {
      const { data } = await get('/workers');
      setWorkerData(data);
    } catch (error) {
      console.error('Error fetching workers', error);
      toast.error('Failed to fetch workers');
    }
  };
  const getPowderData = async () => {
    try {
      const { data } = await get('/utilities');
      setPowderData(data);
    } catch (error) {
      console.error('Error Fetching Powder', error);
      toast.error('Failed to fetch Powders');
    }
  };

  useEffect(() => {
    getWorkers();
    getPowderData();
  }, []);


  const formik: any = useFormik({
    initialValues: {
      status: "",
    },
    validationSchema: updateTransportStatusSchema,
    onSubmit: async (value: any) => {
      try {
        const response = await put(`/transport/${selectStatusId}/updateTransportStatus`, value);
        getTransportDetails()
        toast.success("transport status updated");
      } catch (error: any) {
        toast.error( error.response?.data?.message || error.message);
      }
      setIsOpen(false);
    }
  });


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isScrollable fullScreen="lg">
      <ModalHeader
        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
      >
        Status
      </ModalHeader>
      <ModalBody>
        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
          <Card>
            <div className='col-span-6 lg:col-span-3'>
              <Label htmlFor='status'>
                Status
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Select
                id='status'
                placeholder='Select Status'
                name='status'
                value={formik.values.dispatch_date}
                onChange={formik.handleChange}
              >
                {statusOption?.map((status) => {
                  return (
                    <option value={status?.value} key={status?.label}>{status?.label}</option>
                  )
                })}
              </Select>
              {formik.errors.status && formik.touched.status && (
                <div className='text-red-500'>{formik.errors.status}</div>
              )}
            </div>
            <div className='mt-3'>
              <Button variant='solid' color='blue' type='button' onClick={() => formik.handleSubmit()}>
                Submit
              </Button>
            </div>
          </Card>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UpdateStatusModal;

const statusOption = [
  {
    label: "Pending",
    value: "pending"
  },
  {
    label: "In Transit",
    value: "in_transit"
  },
  {
    label: "Completed",
    value: "completed"
  },
]