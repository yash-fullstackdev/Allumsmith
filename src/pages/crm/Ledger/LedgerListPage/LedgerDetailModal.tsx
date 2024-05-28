import React, { useEffect, useState } from 'react'
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import SelectReact from '../../../../components/form/SelectReact';
import Input from '../../../../components/form/Input';
import Textarea from '../../../../components/form/Textarea';
import { useFormik } from 'formik';
import { get, post } from '../../../../utils/api-helper.util';
import { toast } from 'react-toastify';

const LedgerDetailModal = () => {
    const [formData, setFormData] = useState<any>({ customer_id: '', customer_name: '', payment_mode: '', remarks: '', grandTotal: 0, paidAmount: 0, pendingAmount: 0, creditedAmount: 0, amountPayable: 0, chequeNumber: '', upi: '', description:'' })
    const [customer, setCustomer] = useState<any>([])
    const OptionPaymentMode = [
        { value: "Cheque", label: "Cheque" },
        { value: "Cash", label: "Cash" },
        { value: "RTGS", label: "RTGS" },
        { value: "UPI", label: "UPI" },

    ]
    const formik: any = useFormik({
		initialValues:{
            customer_id: '',
            todayDate: new Date().toISOString().split('T')[0],
        },
		enableReinitialize: true,
		
		onSubmit: () => {},
	});
    const getCustomerDetails = async () => {
        try {
          const { data } = await get('/customers');
          const filteredData = data.filter((customer: any) => customer.associatedInvoices.length > 0);
          setCustomer(filteredData);
        } catch (error) {
          console.error('Error Fetching Customer Order');
        }
      }
    console.log(customer)
    const fetchAmount = async() =>{
        try {
            const creditedAmount = customer.find((value:any) => value._id === formik.values.customer_id)?.credit_amount;
            const pendingAmount = customer.find((value:any) => value._id === formik.values.customer_id)?.pending_amount;
            
            formik.setFieldValue('creditedAmount', parseFloat(creditedAmount.toFixed(2)) || 0);
            formik.setFieldValue('pendingAmount', parseFloat(pendingAmount.toFixed(2)) || 0)
            
        } catch (error) {
            
        }
    }
    useEffect(() =>{
        fetchAmount();
    },[formik.values.customer_id])

        useEffect(() =>{
        getCustomerDetails();
    },[])
    const saveLedger = async ()=>{
        try {
            const payload = {
                ...formik.values
            }
            if(formik.values.payment_mode === 'Cheque'){
                payload.payment_id = formik.values.chequeNumber
                
            }
            else if(formik.values.payment_mode === 'UPI'){
                payload.payment_id = formik.values.upi
            }
            else{
                payload;
            }

            const { data } = await post('/ledger', payload)
            toast.success("ledger created")
        } catch (error) {
            toast.error('Error Saving Ledger');
        }
    }
    console.log(formik.values)
    return (

       

        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
            <Card className='px-4'>

                <div>
                    <div className='mt-2 grid grid-cols-12 gap-1'>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='name'>
                                Customer Name
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <SelectReact
                                id={`name`}
                                name={`name`}
                                options={customer.map((customer: any) => ({
                                  value: customer._id,
                                  label: customer.name,
                                }))}
                                onChange={(value: any) => formik.setFieldValue('customer_id', value.value)}
                            // onChange ={handleCustomerSelect}
                            />
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='todayDate'>
                                Date
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Input
                                id='todayDate'
                                type='date'
                                name='todayDate'
                                value = {formik.values.todayDate}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='creditedAmount'>
                                Credited Amount
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Input
                                id='creditedAmount'
                                type='text'
                                name='creditedAmount'
                                value={formik.values.creditedAmount}
                                className='text-green-500 font-bold'

                            />
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='pendingAmount'>
                                Pending Amount
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Input
                                id='pendingAmount'
                                type='text'
                                name='pendingAmount'
                                value={formik.values.pendingAmount}
                                className='text-red-500'

                            />
                        </div>

                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='payment_mode'>
                                Payment Mode
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <SelectReact
                                id={`payment_mode`}
                                name={`payment_mode`}
                                options={OptionPaymentMode.map((payment_mode: any) => ({
                                    value: payment_mode.value,
                                    label: `${payment_mode.label} `,
                                }))}
                                // value={{ value: formData.payment_mode, label: formData.payment_mode }}
                                onChange={(value:any) => formik.setFieldValue('payment_mode',value.value)}
                            />
                        </div>

                        {
                            formik && formik?.values?.payment_mode === 'Cheque' && (
                                <div className='col-span-12 lg:col-span-6'>
                                    <Label htmlFor='chequeNumber'>
                                        Cheque Number
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        type='text'
                                        id={`chequeNumber`}
                                        name={`chequeNumber`}
                                        value={formik.values.chequeNumber}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            )
                        }
                        {
                            formik && formik?.values?.payment_mode === 'UPI' && (
                                <div className='col-span-12 lg:col-span-6'>
                                    <Label htmlFor='upi'>
                                        UPI ID
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        type='text'
                                        id={`upi`}
                                        name={`upi`}
                                        value={formik.values.upi}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            )
                        }
                        <div className='col-span-12 lg:col-span-6'>
                          <Label htmlFor='amount_payable'>
                            Amount Payable(rs)
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            id={`amount_payable`}
                            name={`amount_payable`}
                            value={formik.values.amount_payable}
                            onChange={formik.handleChange}
                          />
                        </div>

                        <div className='col-span-12 lg:col-span-12'>
                          <Label htmlFor='description'>
                           Description
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <Textarea
                            id='description'
                            name='description'
                            value={formik.values.description}
                            onChange={formik.handleChange}
                          />
                        </div>

                    </div>

                </div>
                <div className='col-span-1 flex mt-2 items-end justify-end'>
                    <Button
                        variant='solid'
                        color='blue'
                        type='button'
                     onClick={saveLedger}
                    >
                        Add Ledger Detail
                    </Button>
                </div>

            </Card>
        </div>
    )
}

export default LedgerDetailModal
