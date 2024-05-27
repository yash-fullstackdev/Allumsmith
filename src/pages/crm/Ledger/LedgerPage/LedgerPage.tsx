import React, { useEffect, useState } from 'react'
import Container from '../../../../components/layouts/Container/Container';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import { get, post } from '../../../../utils/api-helper.util';
import SelectReact from '../../../../components/form/SelectReact';
import { number } from 'yup';
import AllInvoice from './AllInvoice';
import { useFormik } from 'formik';
import AllLedger from './AllLedger';
import Collapse from '../../../../components/utils/Collapse';

const optionSelect = [
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Dedit" }
]

const OptionPaymentMode = [
  { value: "Cheque", label: "Cheque" },
  { value: "Cash", label: "Cash" },
  { value: "RTGS", label: "RTGS" },
  { value: "UPI", label: "UPI" },

]

const LedgerPage = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>([]);
  const [formData, setFormData] = useState<any>({ customer_id: '', customer_name: '', payment_mode: '', remarks: '', grandTotal: 0, paidAmount: 0, pendingAmount: 0, creditedAmount: 0, amountPayable: 0, chequeNumber: '', upi: '' })
  const [specificCustomerData, setSpecificCustomerData] = useState<any>([]);
  const [associatedInvoices, setAssociatedInvoices] = useState<any>([]);
  const [associatedLedger, setAssociatedLedger] = useState<any>([]);
  const [collapseAll, setCollapseAll] = useState<boolean>(false);
  const [accordionStates, setAccordionStates] = useState({
    customerInfo: false,
    invoiceDetails: false,
    ledgerDetails: false,

  });
  const { id } = useParams();
  const getCustomerDetails = async () => {
    try {
      const { data } = await get(`/customers`);
      setCustomer(data);
    } catch (error) {
      console.error('Error Fetching Customer Order');
    }
  }

  console.log('customer')
  const formik: any = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
    },
    enableReinitialize: true,

    onSubmit: () => { },
  });


  const handleSubmit = async () => {
    try {
      // Gather all form data
      const formDataToSend = {
        customer: formData.customer_id,
        payment_mode: formData.payment_mode,
        grandTotal: parseFloat(formData.grandTotal),
        remarks: formData.remarks,
        amount_payable: parseFloat(formData.amountPayable),
      };

      console.log('Form data to send:', formDataToSend);
      const { data } = await post('/ledger', formDataToSend);

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      navigate(PathRoutes.ledger_list)
    }
  };
  function formatDate(dateString:any) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

// Example usage:
const formattedDate = formatDate(formik.values.startDate);
console.log(formattedDate); // Outputs: 24-05-2024

  const fetchLedgerDetails = async (customerId: any) => {
    try {
      const startDate = formatDate(formik.values.startDate);
      const endDate = formatDate(formik.values.endDate);
      const { data } = await get(`/ledger/findledger/${customerId}/${startDate}/${endDate}`);
      setSpecificCustomerData(data);
      formik.setFieldValue('customerName', data[0]?.customer_id.name);
      formik.setFieldValue('address_line1',data[0]?.customer_id.address_line1);
      formik.setFieldValue('address_line2',data[0]?.customer_id.address_line2);
      formik.setFieldValue('email', data[0].customer_id.email);
      formik.setFieldValue('phone', data[0].customer_id.phone)

      // setAssociatedInvoices(data.associatedInvoices);

      // Calculate grandTotal
      // const totalAmounts = data.associatedInvoices.map((invoice: any) => invoice.totalAmount);
      // const grandTotal = totalAmounts.reduce((acc: number, curr: number) => acc + curr, 0);

      // Set grandTotal in formData
      // setFormData({ ...formData, grandTotal:parseFloat(grandTotal.toFixed(2)), customer_id: customerId, paidAmount:parseFloat((data.paid_amount).toFixed(2)) || 0, pendingAmount: data.pending_amount || 0, creditedAmount:parseFloat((data.credit_amount).toFixed(2)) || 0});
      // setFormData({ ...formData, grandTotal, customer_id: customerId, paidAmount: data.paid_amount || 0, pendingAmount: data.pending_amount || 0, creditedAmount: data.credit_amount || 0 });

    } catch (error) {
      console.error('Error Fetching Invoices for Customer:', error);
    }
  }
  console.log('data', specificCustomerData)

  const collapseAllAccordians = () => {
    setAccordionStates({
      customerInfo: !collapseAll,
      invoiceDetails: !collapseAll,
      ledgerDetails: !collapseAll,

    });
    setCollapseAll(!collapseAll);
  };

  console.log('Invoice Data', associatedInvoices);
  console.log('data', specificCustomerData)
  console.log('Customer', customer);
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
        <SubheaderRight>
          <div className='col-span-1'>
            <Button
              variant='solid'
              color='emerald'
              className='mr-5'
              onClick={() => collapseAllAccordians()}>
              {!collapseAll ? 'Collapse All Information' : 'Expand All Information'}
            </Button>
          </div>

        </SubheaderRight>
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
                          onClick={() =>
                            setAccordionStates({
                              ...accordionStates,
                              customerInfo: !accordionStates.customerInfo,
                            })
                          }
                          rightIcon={
                            !accordionStates.customerInfo
                              ? 'HeroChevronUp'
                              : 'HeroChevronDown'
                          }
                        >
                          Customer Details
                        </Button>
                      </div>
                    </div>
                    <Collapse isOpen={!accordionStates.customerInfo} className='overflow-visible'>
                      <div className='mt-2 grid grid-cols-12 gap-1 '>
                        <div className='col-span-12 lg:col-span-3'>
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
                            onChange={(value: any) => {
                              formik.setFieldValue('customer_id', value.value)
                              getCustomerDetails();
                            }


                            }
                          // onChange ={handleCustomerSelect}
                          />
                        </div>
                        <div className='col-span-12 lg:col-span-3 '>
                          <Label htmlFor='startDate'>
                            Start Date
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <Input
                            type='date'
                            id={`startDate`}
                            name={`startDate`}
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className='col-span-12 lg:col-span-3'>
                          <Label htmlFor='endDate'>
                            End Date
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <Input
                            type='date'
                            id={`endDate`}
                            name={`endDate`}
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className='col-span-12 lg:col-span-3 mt-4 ml-2'>
                          <Button className='mt-2' variant='solid' color='blue' type='submit' onClick={() => fetchLedgerDetails(formik.values.customer_id)} >
                            Fetch Details
                          </Button>
                        </div>

                      </div>
                    </Collapse>


                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>

      </Container>
      <Container>
        <div className='flex h-full flex-wrap content-start'>
          <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
              <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                <Card>

                  <CardBody>
                  <div className='mt-2 grid grid-cols-12 gap-1 '>
                    <div className='col-span-12 lg:col-span-6'>
                      <Label htmlFor='name' className='flex gap-1'>
                        Customer Name :<span><h5>{formik.values.customerName}</h5></span>

                      </Label>
                    </div>

                    <div className='col-span-12 lg:col-span-6'>
                      <Label htmlFor='name' className='flex gap-1'>
                        Address :<span><h5>{formik.values.address_line1?.toUpperCase()}</h5></span>
                      </Label>
                    </div>
                    <div className='col-span-12 lg:col-span-6'>
                      <Label htmlFor='name' className='flex gap-1'>
                        Phone :<span><h5>{formik.values.phone}</h5></span>
                      </Label>
                    </div>
                    <div className='col-span-12 lg:col-span-6'>
                      <Label htmlFor='name' className='flex gap-1'>
                        Address Line 2 :<span><h5>{formik?.values.address_line2?.toUpperCase() || 'NA'}</h5></span>
                      </Label>
                    </div>
                    <div className='col-span-12 lg:col-span-12'>
                      <Label htmlFor='name' className='flex gap-1'>
                        Email:<span><h5>{formik.values.email}</h5></span>
                      </Label>
                    </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Container>
      {/* <AllInvoice associatedInvoices={associatedInvoices} accordionStates={accordionStates} setAccordionStates={setAccordionStates} /> */}
      <AllLedger associatedLedger={specificCustomerData}  />
    </PageWrapper>


  )

}

export default LedgerPage
