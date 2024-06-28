import React, { useState } from "react";
import Button from "../../ui/Button";
import Label from "../../form/Label";
import Input from "../../form/Input";
import Textarea from "../../form/Textarea";
import Icon from "../../icon/Icon";
import UploadFile from "../../form/UploadFile";
import Tooltip from "../../ui/Tooltip";

type props = {
  formik: any,
};
const CustomerForm = ({ formik }: props) => {
  const [selectedFileNames, setSelectedFileNames] = useState<any>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);


  const validateFiles = (files: FileList) => {
    const allowedTypes = [
      'application/pdf', // PDF files
      'image/jpeg', // JPEG images
      'image/jpg', // JPG images
      'image/png', // PNG images
      'application/msword', // DOC files (Microsoft Word)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX files (Microsoft Word)
      'application/vnd.apple.pages', // Apple Pages documents
    ];
    // setFileErrors([]);

    const errors: string[] = [];
    const selectedNames: string[] = [];
    let fileData: any = [];

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      if (!selectedFileNames?.includes(file.name)) {
        fileData.push(file);
        selectedNames.push(file.name);
        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name} is not a valid file type.`);
        }
      }
    }

    const selectedFilesData = [...formik?.values?.file, ...fileData];
    const selectedFilesName = [...selectedFileNames, ...selectedNames];
    if (errors?.length > 0) {
      setFileErrors(errors);
    } else {
      setSelectedFileNames(selectedFilesName);
      formik.setValues((prevState: any) => ({
        ...prevState,
        file: Array.from(selectedFilesData),
      }));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      validateFiles(files);
    }
  };

  const handleRemoveFile = (index?: number | null) => {
    if (index !== null) {
      const fileArray = formik?.values?.file?.filter((_: any, idx: number) => idx !== index)
      const removeFileNames = selectedFileNames?.filter((_: any, idx: number) => idx !== index)
      setSelectedFileNames(removeFileNames)
      formik.setValues((prevState: any) => ({
        ...prevState,
        file: fileArray,
      }));
    }
  }

  const removeFiles = () => {
		setSelectedFileNames([]);
		formik.setValues((prevState: any) => ({
			...prevState,
			file: [],
		}));
	};
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='mt-2 grid grid-cols-12 gap-3'>
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

        <div className='col-span-12 lg:col-span-3'>
          <Label htmlFor='phone'>
            Phone
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

        <div className='col-span-12 lg:col-span-3'>
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

        <div className='col-span-12 lg:col-span-3'>
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

        <div className='col-span-12 lg:col-span-3'>
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

        <div className='col-span-12 lg:col-span-3'>
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

        <div className='col-span-12 lg:col-span-3'>
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

        <div className='col-span-12 lg:col-span-3'>
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
            Address 1
            <span className='ml-1 text-red-500'>*</span>

          </Label>
          <Textarea
            id="address_line1"
            name="address_line1"
            value={formik.values.address_line1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address_line1 && formik.errors.address_line1 ? (
            <div className='text-red-500'>{formik.errors.address_line1}</div>
          ) : null}
        </div>

        <div className='col-span-12 lg:col-span-6'>
          <Label htmlFor='address_line2'>
            Address 2
          </Label>
          <Textarea
            id="address_line2"
            name="address_line2"
            value={formik.values.address_line2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address_line2 && formik.errors.address_line2 ? (
            <div className='text-red-500'>{formik.errors.address_line2}</div>
          ) : null}
        </div>

        <div className='col-span-12 mt-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='upload Documents'>
              Upload Documents
            </Label>
            {selectedFileNames?.length > 0 ? (
              <Tooltip text={"Remove All Files"} placement='left'>
                <Icon
                  className='mx-2 cursor-pointer w-8 h-8'
                  icon={'CrossIcon'}
                  onClick={removeFiles}
                />
              </Tooltip>
            ) : null}
          </div>
          <UploadFile
            handleFileChange={handleFileChange}
            multiple
            value={selectedFileNames}
            handleRemoveFile={handleRemoveFile}
          />

          {fileErrors?.length > 0 && (
            <ul className='text-red-500'>
              {fileErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </form>
  )
};

export default CustomerForm