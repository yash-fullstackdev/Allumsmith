import { post } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import { toast } from 'react-toastify';
import { AddRawMaterialSchema } from '../../../../utils/formValidations';
import { useFormik } from 'formik';

const AddPowderModal = ({ SetAddPowderModal, getPowderList }: any) => {

    const formik: any = useFormik({
        initialValues: {
            name: '',
            code: '',
        },
        validationSchema: AddRawMaterialSchema,
        onSubmit: async (values) => {
            try {
                await post('/utilities', values);
                toast.success('Powder added Successfully!')
                SetAddPowderModal(false);
            } catch (error: any) {
                console.error("Error Saving Powder", error)
                toast.error('Error Saving Powder', error)
            }
            finally {
                getPowderList();
            }
        },
    });

    return (
        <Card>
            <CardBody>
                <div className='mt-2 grid grid-cols-12 gap-1'>
                    <div className='col-span-12 lg:col-span-6'>
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
                    <div className='col-span-12 lg:col-span-6'>
                        <Label htmlFor='code'>
                            Code
                            <span className='ml-1 text-red-500'>*</span>
                        </Label>
                        <Input
                            id="name"
                            name="code"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.code && formik.errors.code ? (
                            <div className='text-red-500'>{formik.errors.code}</div>
                        ) : null}
                    </div>
                    <div className='col-span-12 lg:col-span-12'>
                        <div className='flex mt-2 gap-2 '>
                            <Button variant='solid' color='blue' type='button' onClick={formik.handleSubmit}>
                                Save Entries
                            </Button>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default AddPowderModal;