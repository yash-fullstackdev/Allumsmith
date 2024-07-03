import React, { type Dispatch, type SetStateAction } from "react";
import Modal, { ModalBody, ModalHeader } from "../../../../components/ui/Modal";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import { useFormik } from "formik";
import Textarea from "../../../../components/form/Textarea";
import Button from "../../../../components/ui/Button";
import { addCustomerModalSchema } from "../../../../utils/formValidations";
import { toast } from "react-toastify";
import { post } from "../../../../utils/api-helper.util";


type props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  customerName: string;
  fetchVendorData: () => void;
  setCustomerName: (value: string) => void;
  setCustomerId: (value: string) => void;
};

const AddCustomerModal = ({ isOpen, setIsOpen, customerName, fetchVendorData, setCustomerName, setCustomerId }: props) => {
  const initialValues = {
    name: customerName,
    email: '',
    phone: '',
    gst_number: '',
    company: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zipcode: '',
    premium_discount: '',
    anodize_discount: '',
    commercial_discount: ''
  }
  const formik: any = useFormik({
    initialValues,
    validationSchema: addCustomerModalSchema,
    onSubmit: async (value) => {
      try {
        const customer = await post('/customers', value);
        fetchVendorData()
        setCustomerId(customer?.data?._id)
        setCustomerName(customer?.data?.name)
        toast.success('customer added Successfully!')
        setIsOpen(false);
      } catch (error: any) {
        console.error("Error Saving customer", error)
        toast.error(error.response.data.message, error)
      }
    }
  });

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isScrollable fullScreen>
      <ModalHeader
        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
      // onClick={() => formik.resetForm()}
      >
        Add Customer
      </ModalHeader>
      <ModalBody className="h-full">
        <form onSubmit={formik.handleSubmit}>
          <div className='mt-2 grid grid-cols-12 gap-1'>
            <div className='col-span-12  lg:col-span-3'>
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
            <div className='col-span-12  lg:col-span-3'>
              <Label htmlFor='Phone'>
                Phone
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Input
                name='phone'
                id='phone'
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.phone && formik.touched.phone && (
                <div className='text-red-500'>{formik.errors.phone}</div>
              )}
            </div>

            <div className='col-span-12  lg:col-span-3'>
              <Label htmlFor='Email'>
                Email
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Input
                name='email'
                id='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email && (
                <div className='text-red-500'>{formik.errors.email}</div>
              )}
            </div>

            <div className='col-span-12  lg:col-span-3'>
              <Label htmlFor='gst_number'>
                GST Number
              </Label>
              <Input
                name='gst_number'
                id='gst_number'
                value={formik.values.gst_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.gst_number && formik.touched.gst_number && (
                <div className='text-red-500'>{formik.errors.gst_number}</div>
              )}
            </div>
            <div className='col-span-12  lg:col-span-3'>
              <Label htmlFor='Company'>
                Company
              </Label>
              <Input
                name='company'
                id='company'
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.company && formik.touched.company && (
                <div className='text-red-500'>{formik.errors.company}</div>
              )}
            </div>
            <div className='col-span-12  lg:col-span-3'>
              <Label htmlFor='City'>
                City
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Input
                name='city'
                id='city'
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.city && formik.touched.city && (
                <div className='text-red-500'>{formik.errors.city}</div>
              )}
            </div>
            <div className='col-span-12  lg:col-span-3'>
              <Label htmlFor='state'>
                State
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Input
                name='state'
                id='state'
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.state && formik.touched.state && (
                <div className='text-red-500'>{formik.errors.state}</div>
              )}
            </div>
            <div className='col-span-12  lg:col-span-3'>
              <Label htmlFor='Zipcode'>
                Zipcode
              </Label>
              <Input
                name='zipcode'
                id='zipcode'
                value={formik.values.zipcode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.zipcode && formik.touched.zipcode && (
                <div className='text-red-500'>{formik.errors.zipcode}</div>
              )}
            </div>
            <div className='col-span-12  lg:col-span-4'>
              <Label htmlFor='premium_discount'>
                Premium Discount (%)
              </Label>
              <Input
                name='premium_discount'
                id='premium_discount'
                value={formik.values.premium_discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                min={0}
                max={100}
              />
              {formik.errors.premium_discount && formik.touched.premium_discount && (
                <div className='text-red-500'>{formik.errors.premium_discount}</div>
              )}
            </div>
            <div className='col-span-12  lg:col-span-4'>
              <Label htmlFor='anodize_discount'>
                Anodize Discount (%)
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                name='anodize_discount'
                id='anodize_discount'
                value={formik.values.anodize_discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.anodize_discount && formik.touched.anodize_discount && (
                <div className='text-red-500'>{formik.errors.anodize_discount}</div>
              )}
            </div>
            <div className='col-span-12  lg:col-span-4'>
              <Label htmlFor='commercial_discount'>
                Commercial Discount (%)
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                name='commercial_discount'
                id='commercial_discount'
                value={formik.values.commercial_discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.commercial_discount && formik.touched.commercial_discount && (
                <div className='text-red-500'>{formik.errors.commercial_discount}</div>
              )}
            </div>

            <div className='col-span-12 lg:col-span-6'>
              <Label htmlFor='address_line1'>
                Address Line 1
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Textarea
                name='address_line1'
                id='address_line1'
                value={formik.values.address_line1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}

              />
              {formik.errors.address_line1 && formik.touched.address_line1 && (
                <div className='text-red-500'>{formik.errors.address_line1}</div>
              )}
            </div>
            <div className='col-span-12 lg:col-span-6'>
              <Label htmlFor='address_line2'>
                Address Line 2
              </Label>
              <Textarea
                name='address_line2'
                id='address_line2'
                value={formik.values.address_line2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.address_line2 && formik.touched.address_line2 && (
                <div className='text-red-500'>{formik.errors.address_line2}</div>
              )}
            </div>
          </div>

          <div className='flex mt-2 gap-2'>
            <Button variant='solid' color='blue' isLoading={formik?.isSubmitting} isDisable={formik.values.name === '' || formik?.isSubmitting} onClick={() => formik.handleSubmit()}>
              Save Customer
            </Button>
          </div>

        </form>
      </ModalBody>
    </Modal>
  )


};

export default AddCustomerModal