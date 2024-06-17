import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Modal, { ModalBody, ModalFooter, ModalFooterChild, ModalHeader } from "../../../../components/ui/Modal";
import Card from "../../../../components/ui/Card";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { get } from "../../../../utils/api-helper.util";
import Input from "../../../../components/form/Input";
import Button from "../../../../components/ui/Button";
import { updateTransportStatusSchema } from "../../../../utils/formValidations";

type props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

// export enum TransportStatus {
//   PENDING = "pending",
//   InTransit = "in_transit",
//   COMPLETED = "completed"
// }


const UpdateStatusModal = ({ isOpen, setIsOpen }: props) => {
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
      console.log('Powder Data', powderData);

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
      entries: [{ powder: '', powderInKgs: '' }]
    },
    validationSchema: updateTransportStatusSchema,
    onSubmit: async (value: any) => {
      console.log('value :>> ', value);
    }
  });

  console.log('formik :>> ', formik);

  const handleDeleteProduct = (index: number) => {
    const newBatchList = formik?.values?.entries?.filter((_: any, idx: number) => idx !== index);
    formik?.setFieldValue('entries', newBatchList);
  };
  const handleAddEntry = () => {
    const newBatchList = [...formik?.values?.entries, { powder: '', powderInKgs: '' }];
    formik?.setFieldValue('entries', newBatchList);
  };
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
            {formik?.values?.status === "completed" ? (
              <>
                <div className='col-span-6 lg:col-span-3'>
                  <Label htmlFor='worker'>Worker</Label>
                  <Select
                    id='worker'
                    placeholder='Select Worker'
                    name='worker'
                    value={formik?.values?.worker}
                    onChange={formik.handleChange}
                  >
                    {workerData.map((worker: any, index: number) => (
                      <option key={index} value={worker._id}>{worker.name}</option>
                    ))}
                  </Select>
                  {formik?.values?.entries?.length ? formik?.values?.entries?.map((entry: any, index: number) => (
                    <div key={index} className='flex gap-2'>
                      <div className='col-span-6 lg:col-span-3'>
                        <Label htmlFor={`powder-${index}`}>Powder</Label>
                        <Select
                          id={`powder-${index}`}
                          placeholder='Select Powder'
                          name={`entries[${index}].powder`}
                          value={formik?.values?.entries?.[index]?.powder}
                          onChange={(e) => {
                            formik?.setFieldValue(`entries[${index}].powder`, e.target.value);
                          }}
                        >
                          {powderData.map((powder: any, index: number) => (
                            <option key={index} value={powder._id}>{powder.name}</option>
                          ))}
                        </Select>

                      </div>
                      <div className='col-span-6 lg:col-span-3'>
                        <Label htmlFor={`powderInKgs-${index}`}>Powder (in kgs)</Label>
                        <Input
                          type='number'
                          id={`powderInKgs-${index}`}
                          name={`entries[${index}].powderInKgs`}
                          value={entry.powderInKgs}
                          onChange={(e) => {
                            formik?.setFieldValue(`entries[${index}].powderInKgs`, e.target.value);
                          }}
                          placeholder='Enter powder in kgs'
                        />
                      </div>
                      {formik?.values?.entries.length > 1 && (
                        <div className='flex items-center'>
                          <Button type='button' onClick={() => handleDeleteProduct(index)} icon='HeroXMark' />
                        </div>
                      )}
                    </div>

                  ))
                    : null}
                  <div className='flex justify-between mt-3'>
                    <Button variant='outline' type='button' onClick={handleAddEntry}>
                      Add Entry
                    </Button>
                  </div>
                </div>
              </>
            )
              : null
            }
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