import { ErrorMessage, Input, Label } from "../../form";
import Button from "../../ui/Button";

type props = {
  formik: any,
};
const ColorForm = ({ formik }: props) => {
  const handleDeleteColor = (index: number) => {
    const newEntries = [...formik.values.entries];
    newEntries.splice(index, 1);
    formik.setFieldValue('entries', newEntries);
  }
  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.values.entries.map((entry: any, index: any) => (
        <div key={index} className='mt-2 grid grid-cols-12 gap-3'>
          <div className='col-span-12 lg:col-span-4'>
            <Label htmlFor={`name-${index}`} require={true}>
              Name
            </Label>
            <Input
              id={`name-${index}`}
              name={`entries[${index}].name`}
              value={entry.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMessage
              touched={formik.touched.entries?.[index]}
              errors={formik.errors.entries?.[index]}
              fieldName={`name`}
            />
          </div>
          <div className='col-span-12 lg:col-span-4'>
            <Label htmlFor={`code-${index}`} require={true}>
              Code
            </Label>
            <Input
              type="text"
              id={`code-${index}`}
              name={`entries[${index}].code`}
              value={entry.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMessage
              touched={formik.touched.entries?.[index]}
              errors={formik.errors.entries?.[index]}
              fieldName={`code`}
            />

          </div>
          <div className='col-span-12 lg:col-span-4 flex items-end justify-end'>
            {formik.values.entries.length > 1 && (
              <Button
                type='button'
                onClick={() => handleDeleteColor(index)}
                variant='outlined'
                color='red'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  data-slot='icon'
                  className='h-6 w-6'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18 18 6M6 6l12 12'
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      ))}
    </form>
  )
};

export default ColorForm