import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Modal, { ModalBody, ModalHeader } from "../../../../components/ui/Modal";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import { useFormik } from "formik";
import Button from "../../../../components/ui/Button";
import { CoatingSchema } from "../../../../utils/formValidations";
import { toast } from "react-toastify";
import { get, post } from "../../../../utils/api-helper.util";
import SelectReact from "../../../../components/form/SelectReact";
import Select from "../../../../components/form/Select";


type props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  defaultValue: { name: string; index: number | null; };
  fetchData: (value: any, index: number) => void;
  entries: any[];
  setEntries: (value: any) => void;
};

const AddCoatingModal = ({ isOpen, setIsOpen, defaultValue, fetchData, entries, setEntries }: props) => {
  const [colorData, setColorData] = useState([]);

  console.log('entries :>> ', entries);

  const getAllColors = async () => {
    try {
      const response = await get('/colors');
      setColorData(response.data);
    } catch (error) {
      console.log("Error fetching color data:", error);
    }
  };
  useEffect(() => {
    getAllColors();
  }, []);

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
      console.log('value :>> ', value);
      try {
        const response: any = await post('/coatings', value);
        fetchData(response?.data?._id, defaultValue?.index as number);
        console.log('response :>> ', response);
        toast.success('Data saved Successfully!');
        const updatedData = entries?.map((item: any, index: number) =>{
          if(index === defaultValue?.index) {
            return {
              ...item,
              coating: response?.data?._id
            }
          }
          return item;
        })
        setEntries(updatedData)
        setIsOpen(false);
      } catch (error) {
        console.error("Error Saving Data:", error);
        toast.error('Failed to save data. Please try again.');
      }
    }
  });


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isScrollable fullScreen='2xl'>
      <ModalHeader
        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
      // onClick={() => formik.resetForm()}
      >
        Add Coating
      </ModalHeader>
      <ModalBody className="h-full">
        <form onSubmit={formik.handleSubmit}>
          <div className='mt-2 grid grid-cols-12 gap-1'>
            <div className='col-span-12  lg:col-span-6'>
              <Label htmlFor='name'>
                Name
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Input
                name='name'
                id='name'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.name && formik.touched.name && (
                <div className='text-red-500'>{formik.errors.name}</div>
              )}
            </div>
            <div className='col-span-12  lg:col-span-6'>
              <Label htmlFor='name'>
                code
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Input
                name='code'
                id='code'
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.code && formik.touched.code && (
                <div className='text-red-500'>{formik.errors.code}</div>
              )}
            </div>

            <div className='col-span-12 lg:col-span-6'>
              <Label htmlFor='Colors'>
                Colors
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <SelectReact
                name='colors'
                options={colorData && colorData.map((color: any) => ({
                  value: color._id,
                  label: color.name,
                }))}
                isMulti
                onBlur={formik.handleBlur}
                menuPlacement='auto'
                onChange={(selectedOptions: any) => {
                  formik.setFieldValue('colors', selectedOptions.map((option: any) => option.value));
                }}
              />
              {formik.touched.colors && formik.errors.colors ? (
                <div className='text-red-500'>{formik.errors.colors}</div>
              ) : null}
            </div>
            <div className='col-span-12 lg:col-span-6'>
              <Label htmlFor='Colors'>
                Coating Type
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Select
                id='type'
                name='type'
                value={formik.values.type}
                placeholder='Select Type'
                onChange={formik.handleChange}
              >
                {coatingTypes.map((coating: any, index) => (
                  <option key={index} value={coating.value}>
                    {coating.label}
                  </option>
                ))}
              </Select>
              {formik.touched.type && formik.errors.type ? (
                <div className='text-red-500'>{formik.errors.type}</div>
              ) : null}
            </div>
          </div>

          <div className='flex mt-2 gap-2'>
            <Button variant='solid' color='blue' isDisable={formik.values.name === ''} onClick={() => formik.handleSubmit()}>
              Save Entries
            </Button>
          </div>

        </form>
      </ModalBody>
    </Modal>
  )
};


const coatingTypes = [
  { value: 'anodize', label: 'Anodize' },
  { value: 'wooden', label: 'Wooden' },
  { value: 'premium', label: 'Premium' },
  { value: 'commercial', label: 'Commercial' }
];

export default AddCoatingModal