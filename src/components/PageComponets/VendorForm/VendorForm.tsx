import React from "react";
import Label from "../../form/Label";
import Textarea from "../../form/Textarea";
import Input from "../../form/Input";

type props = {
  formik: any,
};
const VendorForm = ({ formik }: props) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='mt-2 grid grid-cols-12 gap-3'>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='name'>
            Name
            <span className='ml-1 text-red-500'>*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className='text-red-500'>{formik.errors.name}</div>
          ) : null}
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='phone'>
            phone
            <span className='ml-1 text-red-500'>*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className='text-red-500'>{formik.errors.phone}</div>
          ) : null}
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='email'>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className='text-red-500'>{formik.errors.email}</div>
          ) : null}
        </div>

        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='gstNumber'>
            GST Number
          </Label>
          <Input
            id="gstNumber"
            name="gstNumber"
            value={formik.values.gstNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.gstNumber && formik.errors.gstNumber ? (
            <div className='text-red-500'>{formik.errors.gstNumber}</div>
          ) : null}
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='company'>
            Company
          </Label>
          <Input
            id="company"
            name="company"
            value={formik.values.company}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.company && formik.errors.company ? (
            <div className='text-red-500'>{formik.errors.company}</div>
          ) : null}
        </div>

        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='city'>
            City
          </Label>
          <Input
            id="city"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.city && formik.errors.city ? (
            <div className='text-red-500'>{formik.errors.city}</div>
          ) : null}
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='state'>
            State
          </Label>
          <Input
            id="state"
            name="state"
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.state && formik.errors.state ? (
            <div className='text-red-500'>{formik.errors.state}</div>
          ) : null}
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='zipcode'>
            Zipcode
          </Label>
          <Input
            id="zipcode"
            name="zipcode"
            value={formik.values.zipcode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.zipcode && formik.errors.zipcode ? (
            <div className='text-red-500'>{formik.errors.zipcode}</div>
          ) : null}
        </div>
        <div className='col-span-12 lg:col-span-6'>
          <Label htmlFor='addressLine1'>
            Address 1
            <span className='ml-1 text-red-500'>*</span>

          </Label>
          <Textarea
            id="addressLine1"
            name="addressLine1"
            value={formik.values.addressLine1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.addressLine1 && formik.errors.addressLine1 ? (
            <div className='text-red-500'>{formik.errors.addressLine1}</div>
          ) : null}
        </div>
        <div className='col-span-12 lg:col-span-6'>
          <Label htmlFor='addressLine2'>
            Address 2
          </Label>
          <Textarea
            id="addressLine2"
            name="addressLine2"
            value={formik.values.addressLine2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.addressLine2 && formik.errors.addressLine2 ? (
            <div className='text-red-500'>{formik.errors.addressLine2}</div>
          ) : null}
        </div>
      </div>

    </form>
  );
};

export default VendorForm;