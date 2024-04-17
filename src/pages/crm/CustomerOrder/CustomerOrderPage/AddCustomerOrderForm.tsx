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
import SelectReact from '../../../../components/form/SelectReact';
import Checkbox from '../../../../components/form/Checkbox';
import CreatableSelect from 'react-select/creatable'

const AddCustomerOrderForm = () => {
  const [entries, setEntries] = useState<any>([{ product: '', quantity: '', coating: '', color: '', withoutMaterial: '' }]);
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [customerOrderNumber, setCustomerOrderNumber] = useState<any>('');
  console.log("🚀 ~ AddCustomerOrderForm ~ customerData:", customerData)
  const [coatingData, setCoatingData] = useState<any>([])
  const [productsData, setProductsData] = useState<any>([]);
  const navigate = useNavigate();
  const [productTransfer, setProductTransfer] = useState(false)
  const [colorDataList, setColorDataList] = useState<Array<any>>([]);
  const [selectedCoatings, setSelectedCoatings] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);


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

  const handleWMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntries({ ...entries, withoutMaterial: e.target.checked });
  };

  const handleAddEntry = () => {
    const lastEntry = entries[entries.length - 1];
    const newEntry = {
      product: '',
      quantity: '',
      coating: lastEntry.coating || null,
      color: lastEntry.color || null,
      length: '',
      withoutMaterial: ''
    };
    setEntries([...entries, newEntry]);

    // Update color options for the new entry based on the selected coating
    if (lastEntry.coating) {
      updateColorOptions(lastEntry.coating, entries.length);
    }
  };


  // const handleSaveEntries = async () => {
  //   const updatedEntries = entries.map((entry: any) => ({
  //     ...entry,
  //     quantity: Number(entry.quantity)
  //   }));

  //   const filteredEntries = updatedEntries.map((obj: any) => {
  //     const filteredObj = Object.fromEntries(
  //       Object.entries(obj).filter(([_, value]: [string, any]) => value !== "")
  //     );
  //     return filteredObj;
  //   });

  //   const finalValues = {
  //     customer: customerId,
  //     entries: filteredEntries,
  //   };
  //   console.log("🚀 ~ handleSaveEntries ~ finalValues:", finalValues)
  //   try {
  //     const { data } = await post('/customer-order', finalValues);
  //     console.log("🚀 ~ handleSaveEntries ~ data:", data)
  //     toast.success('Customer order created successfully!');
  //   } catch (error: any) {
  //     toast.error('Error Creating customer order', error);
  //   } finally {
  //     navigate(PathRoutes.customer_order)
  //   }
  // };
  const handleSaveEntries = async () => {
    const updatedEntries = entries.map((entry: any) => ({
      ...entry,
      quantity: Number(entry.quantity)
    }));
    console.log('Entries', entries)
    const filteredEntries = updatedEntries.map((obj: any) => {
      const filteredObj = Object.fromEntries(
        Object.entries(obj).filter(([_, value]: [string, any]) => value !== "")
      );
      return filteredObj;
    });

    // Construct payload
    const finalValues: any = {
      customer: customerId,
      entries: filteredEntries,
      customerOrderNumber,
    };

    try {
      console.log('Final Values', finalValues);
      const { data } = await post('/customer-order', finalValues);
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


  const handleCoatingChange = async (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const coatingId = e.target.value;
    const updatedEntries = [...entries];
    updatedEntries[index].coating = coatingId;
    setEntries(updatedEntries);
    updateColorOptions(coatingId, index);

    try {
      const { data } = await get(`/coatings/${coatingId}`);
    } catch (error) {
      console.error("Error fetching coating details", error);
    }
  };


  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const colorId = e.target.value;
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], color: colorId }; // Update the color for the specific entry
    setEntries(updatedEntries);
  };



  const getCustomerOrderCounter = async() => {
    const {data} = await get('/counter/customerOrderCounter')
    setCustomerOrderNumber(`CO${data.value}`)
  }

  useEffect(() =>{
    getCustomerOrderCounter();
  },[])
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


  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    const updatedEntries = [...entries];
    updatedEntries[index].length = newValue;
    setEntries(updatedEntries);
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
                          <SelectReact
                            id={`name`}
                            name={`name`}
                            options={customerData.map((customer: any) => ({
                              value: customer._id,
                              label: customer.name,
                            }))}
                            value={{ value: customerId, label: customerName }}
                            onChange={(selectedOption: any) => {
                              setCustomerId(selectedOption.value); // Update vendor ID
                              setCustomerName(selectedOption.label); // Update vendor name
                            }}
                          />
                        </div>
                        <div className='col-span-4 lg:col-span-4 mt-5'>
                          <Label htmlFor='customerOrderNumber'>
                            Customer Number
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>
                          <Input
                            id='customerOrderNumber'
                            name='customerOrderNumber'
                            value={customerOrderNumber}
                          // onChange={(e:any) => setInvoiceNumber(e.target.value)}


                          />
                        </div>
                        <div className='col-span-12 lg:col-span-12'>
                          {entries && entries.map((entry: any, index: any) => (
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
                                    <CreatableSelect
                                      id={`product-${index}`}
                                      name={`product-${index}`}
                                      options={productsData.map((product: any) => ({
                                        value: product._id,
                                        label: `${product.name} (${product.productCode}) (${product.length})`
                                      }))}
                                      onChange={(selectedOption: any) => {
                                        // Find the selected product's name
                                        const selectedProductName = productsData.find((product: any) => product._id === selectedOption.value)?.name;

                                        // Update entries state with the selected product value
                                        const updatedEntries = [...entries];
                                        updatedEntries[index].product = selectedOption.value;

                                        // Log updated entries for debugging
                                        console.log("🚀 ~ AddCustomerOrderForm ~ updatedEntries:", updatedEntries);

                                        // Update the state with the new entries
                                        setEntries(updatedEntries);
                                      }}
                                    />

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
                                        value={entry.length || productsData.find((item: any) => item._id === entry.product)?.length || ''}
                                        onChange={(e) => handleLengthChange(e, index)}
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
                                    // value={entry.coating }
                                    value={entry.coating || selectedCoatings[index]}
                                    onChange={(e) => handleCoatingChange(e, index)}

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
                                      value={entry.color || selectedColor[index]}
                                      onChange={(e) => handleColorChange(e, index)}
                                    >
                                      {colorDataList[index]?.map((color: any) => (
                                        <option key={color._id} value={color._id}>
                                          {color.name}
                                        </option>
                                      ))}
                                    </Select>
                                  </div>)}

                                <div className='col-span-12 lg:col-span-3'>
                                  <Label htmlFor='withoutMaterial'>
                                    Without Material
                                    <span className='ml-1 text-red-500'>*</span>
                                  </Label>
                                  <Checkbox
                                    label='Without Material'
                                    id='withoutMaterial'
                                    name='withoutMaterial'
                                    checked={entries[index].withoutMaterial} // Assuming entries is an array of objects
                                    onChange={(e) => {
                                      const target = e.target as HTMLInputElement; // Cast e.target to HTMLInputElement
                                      const updatedEntries = [...entries];
                                      updatedEntries[index].withoutMaterial = target.checked; // Update with the checked value
                                      setEntries(updatedEntries);
                                    }}
                                  />
                                </div>
                                {coatingData.find((coating: any) => coating._id === entry.coating)?.type === 'anodize' && (<div className='col-span-12 lg:col-span-3'>
                                  <Label htmlFor={`anodize-${index}`}>
                                    Anodize Thickness
                                  </Label>
                                  <Select
                                    id={`anodize-${index}`}
                                    name={`anodize-${index}`}
                                    value={entry.anodizeThickness}
                                    onChange={(e) => {
                                      const target = e.target as HTMLSelectElement;
                                      const updatedEntries = [...entries];
                                      updatedEntries[index].mm = target.value;
                                      setEntries(updatedEntries);
                                    }}
                                    placeholder='Select MM'
                                    disabled={coatingData.find((coating: any) => coating._id === entry.coating)?.type !== 'anodize'}
                                  >
                                    <option value="12 Micron">12 Micron</option>
                                    <option value="15 Micron">15 Micron</option>
                                    <option value="20 Micron">20 Micron</option>
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