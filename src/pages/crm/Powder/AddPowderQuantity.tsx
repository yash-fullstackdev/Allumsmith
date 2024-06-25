import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../../utils/api-helper.util";
import { toast } from "react-toastify";
import Card, { CardBody } from "../../../components/ui/Card";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/form/Select";
import { useFormik } from "formik";
import { AddRawMaterialQuantitySchema } from "../../../utils/formValidations";

const AddPowderModal = ({ setPowderQuantityModal, getPowderList }: any) => {
    const [branchData, setBranchData] = useState<any>([]);
    const [powderData, setPowderData] = useState<any>([]);

    const getBranchDetails = async () => {
        try {
            const { data } = await get('/branches');
            setBranchData(data);
        } catch (error) {
            console.error("Error Fetching Branch", error);
        }
    }

    const getPowderDetails = async () => {
        try {
            const { data } = await get('/utilities');
            setPowderData(data);
        } catch (error) {
            console.error('Error Fetching Powder', error)
        }
    }

    useEffect(() => {
        getBranchDetails();
        getPowderDetails();
    }, []);

    const formik: any = useFormik({
        initialValues: {
            utility: '',
            powderName: '',
            powderCode: '',
            branch: '',
            quantity: '',
        },
        validationSchema: AddRawMaterialQuantitySchema,
        onSubmit: async (values) => {
            try {
                await post('/utility_inventory/stockaction', values);
                toast.success('Powder added Successfully!')
                setPowderQuantityModal(false);
                getPowderList();
            } catch (error: any) {
                console.error("Error Saving Powder", error)
                toast.error(error.response.data.message, error)
            }
        },
    });

    return (
        <Card>
            <CardBody>
                <div>
                    <div className='mt-2 grid grid-cols-12 gap-1'>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='name'>
                                Powder
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                id={`name`}
                                name={`name`}
                                value={formik?.values?.utility}
                                onChange={(e) => {
                                    const powder = powderData.find((item: any) => item._id === e.target.value);
                                    formik.setFieldValue('utility', e.target.value);
                                    formik.setFieldValue('powderName', powder?.name);
                                    formik.setFieldValue('powderCode', powder?.code);
                                }}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Powder</option>
                                {powderData.map((powder: any) => (
                                    <option key={powder._id} value={powder._id}>
                                        {powder.name}
                                    </option>
                                ))}
                            </Select>
                            {formik.touched.utility && formik.errors.utility ? (
                                <div className='text-red-500'>{formik.errors.utility}</div>
                            ) : null}
                        </div>
                        {formik?.values?.utility && (
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='code'>
                                    Code
                                    <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <Input
                                    type='number'
                                    id={`code`}
                                    name={`code`}
                                    value={formik?.values?.powderCode}
                                    readOnly
                                />

                            </div>
                        )}
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='quantity'>
                                Quantity
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Input
                                type='number'
                                id={`quantity`}
                                name={`quantity`}
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.quantity && formik.errors.quantity ? (
                                <div className='text-red-500'>{formik.errors.quantity}</div>
                            ) : null}
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='branch'>
                                Branch
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                id={`branch`}
                                name={`branch`}
                                value={formik.values.branch}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Branch</option>
                                {branchData.map((branch: any) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </Select>
                            {formik.touched.branch && formik.errors.branch ? (
                                <div className='text-red-500'>{formik.errors.branch}</div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className='col-span-12 lg:col-span-12'>
                    <div className='flex mt-2 gap-2 '>
                        <Button variant='solid' color='blue' type='button' onClick={formik.handleSubmit}>
                            Save Entries
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default AddPowderModal;
