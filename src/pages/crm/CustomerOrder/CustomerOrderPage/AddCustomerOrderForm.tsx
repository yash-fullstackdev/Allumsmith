import React, { useEffect, useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import Container from '../../../../components/layouts/Container/Container';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import { toast } from 'react-toastify';

const AddCustomerOrderForm = () => {
  const [entries, setEntries] = useState<any>([{ product: '', quantity: '', coating: '', color: '' }]);
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState([])
  const [coatingData, setCoatingData] = useState<any>([])
  const [productsData, setProductsData] = useState<any>([]);
  const navigate = useNavigate();
  const [productTransfer, setProductTransfer] = useState(false)
  const [colorDataList, setColorDataList] = useState<Array<any>>([]);


  const getProductDetails = async () => {
    try {
      const { data } = await get('/products');
      console.log('Data of Products', data);
      const productsWithData = data.filter((item: any) => item.name);
      setProductsData(productsWithData);
    } catch (error) {
      console.error("Error Fetching Products", error);
    }
  }



  const fetchVendorData = async () => {
    try {
      const { data: allVendorData } = await get('/customers')
      setCustomerData(allVendorData)
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
    }
  }

  const getCoatingDetails = async () => {
    try {
      const { data } = await get('/coatings');
      setCoatingData(data);
    } catch (error) {
      console.error("Error Fetching Coating", error);
    }
  }
  useEffect(() => {
    fetchVendorData()
    getProductDetails();
    getCoatingDetails();


  }, []);

  const handleAddEntry = () => {
    setEntries([...entries, { product: '', quantity: '', coating: '', color: '', length: '' }]);
  };

  const handleSaveEntries = async () => {
    const updatedEntries = entries.map((entry: any) => ({
      ...entry,
      quantity: Number(entry.quantity)
    }));

    const filteredEntries = updatedEntries.map((obj: any) => {
      const filteredObj = Object.fromEntries(
        Object.entries(obj).filter(([_, value]: [string, any]) => value !== "")
      );
      return filteredObj;
    });

    const finalValues = {
      customer: customerId,
      entries: filteredEntries,
    };
    try {
      const { data } = await post('/customer-order', finalValues);
      console.log("🚀 ~ handleSaveEntries ~ data:", data)
      toast.success('Customer order created successfully!');
    } catch (error: any) {
      toast.error('Error Creating customer order', error);
    } finally {
      navigate(PathRoutes.customer_order)
    }
  };

  const handleDeleteProduct = (index: any) => {
    const newProduct = [...entries]
    newProduct.splice(index, 1)
    setEntries(newProduct)
  }


  const updateColorOptions = (coatingId: any, entryIndex: number) => {
    const selectedCoating = coatingData.find((coating: any) => coating._id === coatingId);
    if (selectedCoating) {
      const newColorDataList = [...colorDataList];
      newColorDataList[entryIndex] = selectedCoating.colors;
      setColorDataList(newColorDataList);
    } else {
      const newColorDataList = [...colorDataList];
      newColorDataList[entryIndex] = [];
      setColorDataList(newColorDataList);
    }
  };

  return (
    <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
      <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
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
                          Add Customer Order
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className='mt-2 grid grid-cols-12 gap-1'>
                        <div className='col-span-4 lg:col-span-4 mt-5'>
                          <Label htmlFor='customerName'>
                            Customer
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <Select
                            id='customerName'
                            name='customerName'
                            value={customerId}
                            placeholder='Select Customer'
                            onChange={(e: any) => {
                              console.log(e.target.value)
                              setCustomerId(e.target.value)
                            }}
                          >
                            {customerData &&
                              customerData.length > 0 &&
                              customerData?.map((data: any) => (
                                <option key={data._id} value={data._id}>
                                  {data.name}
                                </option>
                              ))}
                          </Select>
                        </div>
                        <div className='col-span-12 lg:col-span-12'>
                          {entries.map((entry: any, index: any) => (
                            <>
                              <div className='flex items-end justify-end mt-2'>
                                {entries.length > 1 && (
                                  <div className='flex items-end justify-end'>
                                    <Button
                                      type='button'
                                      onClick={() => handleDeleteProduct(index)}
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
                                  </div>
                                )}
                              </div>
                              <div key={index} className='mt-2 grid grid-cols-12 gap-1'>
                                {!productTransfer ? (<>
                                  <div className='col-span-12 lg:col-span-3'>
                                    <Label htmlFor={`name-${index}`}>
                                      Products
                                      <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Select
                                      placeholder='Select Product'
                                      id={`product`}
                                      name={`product`}
                                      value={entry.product}
                                      onChange={(e) => {
                                        const updatedEntries = [...entries];
                                        updatedEntries[index].product = e.target.value;
                                        setEntries(updatedEntries);
                                      }}
                                    >
                                      {productsData.map((item: any) => (
                                        <option key={item._id} value={item._id}>
                                          {`${item.name} (${item.productCode})`}
                                        </option>
                                      ))}
                                    </Select>
                                  </div>
                                  {entry.product && (
                                    <div className='col-span-12 lg:col-span-3'>
                                      <Label htmlFor={`length-${index}`}>
                                        Length
                                        <span className='ml-1 text-red-500'>*</span>
                                      </Label>
                                      <Input
                                        type='number'
                                        id={`length-${index}`}
                                        name={`length-${index}`}
                                        value={productsData.find((item: any) => item._id === entry.product)?.length || ''}
                                      />
                                    </div>
                                  )}
                                </>
                                )
                                  : (<>
                                    <div className='col-span-12 lg:col-span-3'>
                                      <Label htmlFor={`product`}>
                                        Product
                                        <span className='ml-1 text-red-500'>*</span>
                                      </Label>
                                      <Input
                                        type='text'
                                        id={`product`}
                                        name={`product`}
                                        value={entry.product}
                                        onChange={(e) => {
                                          const updatedEntries = [...entries];
                                          updatedEntries[index].product = e.target.value;
                                          setEntries(updatedEntries);
                                        }}
                                      />
                                    </div>

                                  </>)}
                                <div className='col-span-12 lg:col-span-3'>
                                  <Label htmlFor={`hsn-${index}`}>
                                    Quantity
                                    <span className='ml-1 text-red-500'>*</span>
                                  </Label>
                                  <Input
                                    type='number'
                                    id={`hsn-${index}`}
                                    name={`hsn-${index}`}
                                    value={entry.quantity}
                                    onChange={(e) => {
                                      const updatedEntries = [...entries];
                                      updatedEntries[index].quantity = e.target.value;
                                      setEntries(updatedEntries);
                                    }}
                                  />
                                </div>
                                <div className='col-span-12 lg:col-span-3'>
                                  <Label htmlFor={`hsn-${index}`}>
                                    Coating
                                    <span className='ml-1 text-red-500'>*</span>
                                  </Label>
                                  <Select
                                    placeholder='Select Coating'
                                    id={`coating-${index}`}
                                    name={`coating-${index}`}
                                    value={entry.coating}
                                    onChange={(e: any) => {
                                      const coatingId = e.target.value;
                                      const updatedEntries = [...entries];
                                      updatedEntries[index].coating = coatingId;
                                      setEntries(updatedEntries);
                                      updateColorOptions(coatingId, index);
                                    }}
                                  >
                                    {coatingData.map((coating: any) => (
                                      <option key={coating._id} value={coating._id}>
                                        {coating.name}
                                      </option>
                                    ))}
                                  </Select>
                                </div>
                                {entry.coating &&
                                  (<div className='col-span-12 lg:col-span-3'>
                                    <Label htmlFor={`hsn-${index}`}>
                                      Color
                                      <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Select
                                      placeholder='Select Color'
                                      id={`color-${index}`}
                                      name={`color-${index}`}
                                      value={entry.color}
                                      onChange={(e: any) => {
                                        const updatedEntries = [...entries];
                                        updatedEntries[index].color = e.target.value;
                                        setEntries(updatedEntries);
                                      }}
                                    >
                                      {colorDataList[index]?.map((color: any) => (
                                        <option key={color._id} value={color._id}>
                                          {color.name}
                                        </option>
                                      ))}
                                    </Select>
                                  </div>)}

                              </div>

                            </>
                          ))}
                          <div className='flex mt-2 gap-2 '>
                            <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
                              Add Entry
                            </Button>
                            <Button variant='solid' color='blue' type='button' onClick={handleSaveEntries} >
                              Save Entries
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div >
            </div>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default AddCustomerOrderForm;