import React from "react";
import Label from "../../form/Label";
import Textarea from "../../form/Textarea";
import Input from "../../form/Input";
import ErrorMessage from "../../layouts/common/ErrorMessage";

type props = {
  formik: any,
};
const VendorForm = ({ formik }: props) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='mt-2 grid grid-cols-12 gap-3'>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='name' require={true}>
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`name`}
          />
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='phone' require={true}>
            phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`phone`}
          />
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
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`email`}
          />
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
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`gstNumber`}
          />
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
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`company`}
          />
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
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`city`}
          />
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
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`state`}
          />
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
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`zipcode`}
          />
        </div>
        <div className='col-span-12 lg:col-span-6'>
          <Label htmlFor='addressLine1' require={true}>
            Address 1
          </Label>
          <Textarea
            id="addressLine1"
            name="addressLine1"
            value={formik.values.addressLine1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`addressLine1`}
          />
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
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`addressLine2`}
          />
        </div>
      </div>

    </form>
  );
};

export default VendorForm;