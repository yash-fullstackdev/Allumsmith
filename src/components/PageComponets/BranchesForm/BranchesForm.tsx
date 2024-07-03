import Label from "../../form/Label";
import Input from "../../form/Input";
import ErrorMessage from "../../layouts/common/ErrorMessage";


type props = {
  formik: any,
};

const BranchesForm = ({ formik }: props) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='mt-1 grid grid-cols-12 gap-3 '>
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
          <Label htmlFor='address_line1' require={true}>
            Address Line 1
          </Label>
          <Input
            id="address_line1"
            name="address_line1"
            value={formik.values.address_line1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`address_line1`}
          />
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='address_line2'>
            Address Line 2
          </Label>
          <Input
            id="address_line2"
            name="address_line2"
            value={formik.values.address_line2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`address_line2`}
          />
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='city' require={true}>
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
          <Label htmlFor='state' require={true}>
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
          <Label htmlFor='zipcode' require={true}>
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
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='phone' require={true}>
            Phone
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
          <Label htmlFor='contact_name' require={true}>
            Contact Name
          </Label>
          <Input
            id="contact_name"
            name="contact_name"
            value={formik.values.contact_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`contact_name`}
          />
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <Label htmlFor='contact_phone' require={true}>
            Contact Phone
          </Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            value={formik.values.contact_phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`contact_phone`}
          />
        </div>

      </div>
    </form>
  )
}

export default BranchesForm;

const coatingTypes = [
  { value: 'anodize', label: 'Anodize' },
  { value: 'wooden', label: 'Wooden' },
  { value: 'premium', label: 'Premium' },
  { value: 'commercial', label: 'Commercial' }
];
