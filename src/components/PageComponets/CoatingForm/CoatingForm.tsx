import React, { useEffect, useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/Input";
import SelectReact from "../../form/SelectReact";
import Select from "../../form/Select";
import { get } from "../../../utils/api-helper.util";
import ErrorMessage from "../../layouts/common/ErrorMessage";

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
          <Label htmlFor='name' require={true}>
            Name
          </Label>
          <Input
            name='name'
            id='name'
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
        <div className='col-span-12  lg:col-span-3'>
          <Label htmlFor='name' require={true}>
            code
          </Label>
          <Input
            name='code'
            id='code'
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`code`}
          />
        </div>

        <div className='col-span-12 lg:col-span-3'>
          <Label htmlFor='Colors' require={true}>
            Colors
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
            value={formik?.values?.colors?.map((color: any) => ({
              value: color._id || color,
              label: color.name || colorData?.find((option: any) => option?._id === color)?.name,
            }))}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`colors`}
          />
        </div>
        <div className='col-span-12 lg:col-span-3'>
          <Label htmlFor='Colors'require={true}>
            Coating Type
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
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`type`}
          />
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
