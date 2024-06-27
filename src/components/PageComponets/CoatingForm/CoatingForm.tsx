import React, { useEffect, useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/Input";
import SelectReact from "../../form/SelectReact";
import Select from "../../form/Select";
import { get } from "../../../utils/api-helper.util";

type props = {
  formik: any,
};

const CoatingForm = ({ formik }: props) => {
  const [colorData, setColorData] = useState<any[]>([]);

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
        <div className='col-span-12  lg:col-span-3'>
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

        <div className='col-span-12 lg:col-span-3'>
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
            value={formik?.values?.colors?.map((color: any) =>({
              value: color._id || color,
              label: color.name || colorData?.find((option: any) => option?._id === color)?.name,
            }))}
          />
          {formik.touched.colors && formik.errors.colors ? (
            <div className='text-red-500'>{formik.errors.colors}</div>
          ) : null}
        </div>
        <div className='col-span-12 lg:col-span-3'>
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

    </form>
  )
}

export default CoatingForm;

const coatingTypes = [
  { value: 'anodize', label: 'Anodize' },
  { value: 'wooden', label: 'Wooden' },
  { value: 'premium', label: 'Premium' },
  { value: 'commercial', label: 'Commercial' }
];
