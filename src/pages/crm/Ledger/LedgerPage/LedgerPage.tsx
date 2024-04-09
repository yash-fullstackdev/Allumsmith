import React, { useEffect, useState } from 'react'
import Container from '../../../../components/layouts/Container/Container';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import { get } from '../../../../utils/api-helper.util';
import SelectReact from '../../../../components/form/SelectReact';

const optionSelect = [
  { value: "credit", label: "Credit Card" },
  { value: "debit", label: "Dedit Card" }
]

const OptionPaymentMode = [
  { value: "cheque", label: "Cheque" },
  { value: "cash", label: "Cash" }
]

const LedgerPage = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>([]);
  const [formData, setFormData] = useState({ customer_id: '', customer_name: '', transaction_type: '', payment_mode: '', amount: '', remarks: '' })

  const getCustomerDetails = async () => {
    try {
      const { data } = await get('/customers');
      setCustomer(data);
    } catch (error) {
      console.error('Error Fetching Customer Order');
    }
  }

  const handleSelectChange = (selectedOption: any) => {
    console.log('Selected Option:', selectedOption);
  };
  const handleTransactionChange = (selectedOptiontrans: any) => {
    console.log('Selected Option:', selectedOptiontrans);
  };
  const handlePaymentChange = (selectedOptiontrans: any) => {
    console.log('Selected Option:', selectedOptiontrans);
  };

  const handleSubmit = async () => {
    try {
      // Gather all form data
      const formDataToSend = {
        customer_id: formData.customer_id,
        transaction_type: formData.transaction_type,
        payment_mode: formData.payment_mode,
        amount: parseFloat(formData.amount),
        remarks: formData.remarks,
        associated_co: "660fc209aebcddadc63b2a34",
        invoice: "660fc209aebcddadc63b2a34"
      };

      // Send formDataToSend to backend or perform other actions
      console.log('Form data to send:', formDataToSend);

      // Optionally, reset form data after successful submission
      setFormData({
        customer_id: '',
        transaction_type: '',
        payment_mode: '',
        amount: '',
        remarks: '',
        customer_name: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  useEffect(() => {
    getCustomerDetails()
  }, [])

  return (
    <PageWrapper name='ADD LEDGER' isProtectedRoute={true}>
      <Subheader>
        <SubheaderLeft>
          <Button
            icon='HeroArrowLeft'
            className='!px-0'
            onClick={() => navigate(`${PathRoutes.ledger_list}`)}
          >
            {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
          </Button>
          <SubheaderSeparator />
        </SubheaderLeft>
      </Subheader>
      <Container>
        <div className='flex h-full flex-wrap content-start'>
          <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
              <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                <Card>

                  <CardBody>
                    <div className='flex'>
                      <div className='bold w-full'>
                        <Button
                          variant='outlined'
                          className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                        >
                          Add Ledger
                        </Button>
                      </div>
                    </div>
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
                            value={{ value: formData.customer_id, label: formData.customer_name }}
                            onChange={(selectedOption) => {
                              if (selectedOption && 'value' in selectedOption) {
                                setFormData({ ...formData, customer_id: selectedOption.value, customer_name: selectedOption.label });
                              }
                            }}
                          />

                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                          <Label htmlFor='transaction_type'>
                            Transaction Type
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <SelectReact
                            id={`transaction_type`}
                            name={`transaction_type`}
                            options={optionSelect.map((trans: any) => ({
                              value: trans.value,
                              label: `${trans.label} `,
                            }))}
                            value={{ value: formData.transaction_type, label: formData.transaction_type }}
                            onChange={(selectedOption) => {
                              if (selectedOption && 'value' in selectedOption) {
                                setFormData({ ...formData, transaction_type: selectedOption.value });
                              }
                            }}
                          />

                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                          <Label htmlFor='amount'>
                            Amount
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <Input
                            type='text'
                            id={`amount`}
                            name={`amount`}
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                            value={{ value: formData.payment_mode, label: formData.payment_mode }}
                            onChange={(selectedOption) => {
                              if (selectedOption && 'value' in selectedOption) {
                                setFormData({ ...formData, payment_mode: selectedOption.value });
                              }
                            }}
                          />
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                          <Label htmlFor='remarks'>
                            Remarks
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <Input
                            type='text'
                            id={`remarks`}
                            name={`remarks`}
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button variant='solid' color='blue' type='submit' onClick={handleSubmit} >
                        Save Entries
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>

      </Container>
    </PageWrapper>
  )
}

export default LedgerPage
