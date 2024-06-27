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
import _, { size } from 'lodash';
import AddCustomerModal from './AddCustomerModal';
import AddCoatingModal from './AddCoatingModal';
import CreateSelectReact from '../../../../components/form/CreateSelectReact';

const AddCustomerOrderForm = () => {
  const [entries, setEntries] = useState<any>([{ product: '', quantity: '', coating: '', color: '', coating_rate: '', withoutMaterial: '', length: '', finish_inventory: '' }]);
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [customerOrderNumber, setCustomerOrderNumber] = useState<any>('');
  const [coatingData, setCoatingData] = useState<any>([])
  const [productsData, setProductsData] = useState<any>([]);
  const navigate = useNavigate();
  const [productTransfer, setProductTransfer] = useState(false)
  const [colorDataList, setColorDataList] = useState<Array<any>>([]);
  const [selectedCoatings, setSelectedCoatings] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [inventoryList, setInventoryList] = useState<any>([]);
  const [productsArray, setProductsArray] = useState<any>([]);
  const [entriesString, setEntriesString] = useState('');
  const [estimateRate, setEstimateRate] = useState<number>(0)
  const [estimateWeight, setEstimateWeight] = useState<number>(0)
  const [currentCustomerData, setCurrentCustomerData] = useState<any>({})
  const [discount, setDiscount] = useState<number>(0);
  const [alluminiumRate, setAlluminiumRate] = useState<number>(0)
  const [coatingCharges, setCoatingCharges] = useState<number>(0)
  const [gst, setGst] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [createCustomer, setCreateCustomer] = useState("");
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState<boolean>(false);
  const [createCoating, setCreateCoating] = useState({ name: "", index: null });
  const [isCreateCoatingOpen, setIsCreateCoatingOpen] = useState<boolean>(false);

  const getProductDetails = async () => {
    try {
      const { data } = await get('/products');
      const productsWithData = data?.data?.filter((item: any) => item.name);
      setProductsData(productsWithData);
    } catch (error) {
      console.error("Error Fetching Products", error);
    }
  }
  useEffect(() => {
    if (inventoryList.length > 0) {
      const groupedData = _.groupBy(inventoryList, (item: any) => item?.product?._id);
      const resultArray = Object.keys(groupedData).map((productId) => {
        const productData = groupedData[productId];
        if (!productData[0]?.product) return null;

        const branches = productData.map((item) => {
          if (!item.branch || !item.branch._id || !item.branch.name) return null;
          return {
            branchId: item.branch._id,
            branchName: item.branch.name,
            quantity: item.quantity,
          };
        }).filter(Boolean);
        const totalQuantity = branches.reduce((total: number, branch: any) => total + branch.quantity, 0);
        return {
          productId,
          productName: productData[0].product.name,
          totalQuantity,
          branches,
        };
      }).filter(Boolean);

      setProductsArray(resultArray);
    }
  }, [inventoryList]);
  const fetchData = async () => {

    try {
      const { data: inventoryList } = await get(`/inventory`);
      setInventoryList(inventoryList);
    } catch (error: any) {
      console.error('Error fetching inventory:', error.message);
    }
  };

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
  const getCoatingAndUpdateColorDetails = async (value: any, index: number) => {
    try {
      const { data } = await get('/coatings');
      setCoatingData(data);
      updateColorOptions(value, index, data);
    } catch (error) {
      console.error("Error Fetching Coating", error);
    }
  }
  useEffect(() => {
    fetchData();
    fetchVendorData()
    getProductDetails();
    getCoatingDetails();

  }, []);

  useEffect(() => {
    // Generate a unique string based on product, quantity, and coating properties
    const updatedEntriesString = entries
      .map((entry: any) => `${entry.product}-${entry.quantity}-${entry.coating}`)
      .join('-');

    // Update the state with the new string
    setEntriesString(updatedEntriesString);
  }, [entries]);

  const handleAddEntry = () => {
    const lastEntry = entries[entries.length - 1];
    const newEntry = {
      product: '',
      quantity: '',
      coating: "" || null,
      color: '',
      length: '',
      weight: '',
      coating_rate: '',
      withoutMaterial: '',
      finish_inventory: '',
    };
    setEntries([...entries, newEntry]);

    // Update color options for the new entry based on the selected coating
    if (lastEntry.coating) {
      updateColorOptions(lastEntry.coating, entries.length, coatingData);
    }
  };

  const calcCoatingChargeBeforeDiscount = (productsArray: any) => {
    return productsArray?.reduce((acc: number, curr: any) => {
      const product = productsData?.find((prod: any) => prod._id === curr.product)
      return acc + ((product?.length || curr.length) * curr.quantity * curr.coating_rate)
    }, 0);
  }

  const handleSaveEntries = async () => {
    const updatedEntries = entries.map((entry: any) => ({
      ...entry,
      quantity: Number(entry.quantity),
      coating_rate: Number(entry.coating_rate)
    }));

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
      alluminium_rate: alluminiumRate,
      estimate_total: estimateRate,
      estimate_weight: estimateWeight,
      coating_charges: coatingCharges,
      customer_discount: discount,
      gst: gst,
      coatingCharges_before_discount: calcCoatingChargeBeforeDiscount(entries),
      grand_total: grandTotal
    };

    try {
      if (!customerId || customerId === '') {
        toast.error('Please select customer')
      }
      const { data } = await post('/customer-order', finalValues);
      toast.success('Customer order created successfully!');
      navigate(PathRoutes.customer_order)
    } catch (error: any) {
      toast.error('Error Creating customer order', error);
    }
  };

  const handleDeleteProduct = (index: any) => {
    const newProduct = [...entries]
    newProduct.splice(index, 1)
    setEntries(newProduct)
  }


  const handleCoatingChange = async (e: any, index: number) => {
    const coatingId = e;
    const updatedEntries = [...entries];
    updatedEntries[index].coating = coatingId;
    setEntries(updatedEntries);
    updateColorOptions(coatingId, index, coatingData);

    try {
      const { data } = await get(`/coatings/${coatingId}`);
    } catch (error) {
      console.error("Error fetching coating details", error);
    }
  };


  const handleColorChange = (e: any, index: number) => {
    const colorId = e.target.value;
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], color: colorId }; // Update the color for the specific entry
    setEntries(updatedEntries);
  };



  const getCustomerOrderCounter = async () => {
    const { data } = await get('/counter/customerOrderCounter')
    setCustomerOrderNumber(`CO${data.value}`)
  }

  useEffect(() => {
    getCustomerOrderCounter();
  }, [])
  const updateColorOptions = (coatingId: any, entryIndex: number, data: any[]) => {
    const selectedCoating = (data || []).find((coating: any) => coating._id === coatingId);
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

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    const updatedEntries = [...entries];
    updatedEntries[index].weight = newValue;
    setEntries(updatedEntries)
  }

  const SetCurrentCustomerData = (id: string) => {
    setCurrentCustomerData(customerData.find((customer: any) => customer._id.toString() === id.toString()))
  }


  useEffect(() => {
    const calculateCoatingRate = (productId: string, coatingId: string) => {
      const product = productsData.find((item: any) => item._id === productId);
      const coating = coatingData.find((item: any) => item._id === coatingId);

      if (!product || !coating) {
        return 0; // Handle if product or coating is not found
      }

      const type = coating.type;

      const productCoatingRate = `${type}_rate`;
      const rate = product[productCoatingRate] || 0;
      return rate;
    };
    const updatedEntries = entries.map((entry: any) => {
      const { product, coating, quantity } = entry;
      return {
        ...entry,
        coating_rate: calculateCoatingRate(product, coating) || entry?.coating_rate
      };
    });

    setEntries(updatedEntries);
  }, [entriesString]);


  const handleProductChange = (selectedOption: any, index: any) => {
    const selectedProduct = productsArray.find((product: any) => product.productId === selectedOption.value);
    if (selectedProduct) {
      const { productId, productName, totalQuantity, wooden_rate, commercial_rate, premium_rate, anodize_rate } = selectedProduct;
      const updatedEntries = [...entries];
      updatedEntries[index].product = productId;
      setEntries(updatedEntries);
    } else {
      const updatedEntries = [...entries];
      updatedEntries[index].product = selectedOption.value;
      setEntries(updatedEntries);
    }
  };

  const calculateGrandTotal = (estimateRate: number, coating_charges: number, gst: number) => {
    const totalPrice = estimateRate + coating_charges
    const gstAmount = totalPrice * (gst / 100)
    const grand_total = (totalPrice + gstAmount).toFixed(2)
    setGrandTotal(parseFloat(grand_total));
  }

  useEffect(() => {
    let totalWeight: number = 0;
    for (const entry of entries) {
      const product = productsData?.find((prod: any) => prod._id.toString() === entry.product.toString())
      const weight = parseFloat(entry?.weight) || product?.weight
      totalWeight += (weight * entry?.quantity) || 0;
      totalWeight = parseFloat(totalWeight.toFixed(2))
    }
    setEstimateWeight(totalWeight)
  }, [entries, productsData])

  useEffect(() => {
    let totalRate: number = 0;
    totalRate = estimateWeight * (alluminiumRate || 0)
    setEstimateRate(totalRate)
  }, [estimateWeight, alluminiumRate])

  useEffect(() => {
    let totalCoatingCharges: number = 0;
    for (const entry of entries) {
      const product = productsData?.find((product: any) => product._id.toString() === entry.product.toString())
      totalCoatingCharges += (entry?.quantity * entry?.coating_rate * (entry?.length || product?.length || 0))
    }
    if (discount) {
      const discountedValue = (totalCoatingCharges * discount / 100)
      totalCoatingCharges -= discountedValue
    }
    setCoatingCharges(totalCoatingCharges)
  }, [entries, productsData, discount])

  useEffect(() => {
    calculateGrandTotal(estimateRate, coatingCharges, gst)
  }, [estimateRate, coatingCharges, gst])

  const selectedStyle = {
    control: (baseStyles: any, state: any) => ({
      ...baseStyles,
      borderColor: state.isFocused ? 'grey' : 'red',
      backgroundColor: "#f4f4f5",
      border: "none",
      height: "32px",
      minHeight: "32px",
    }),
    indicatorSeparator: (baseStyles: any) => ({
      ...baseStyles,
      marginTop: "5px",
      height: 22,
    }),
   
  };
  const selectedCostingStyle = {
    control: (baseStyles: any, state: any) => ({
      ...baseStyles,
      borderColor: state.isFocused ? 'grey' : 'red',
      backgroundColor: "#f4f4f5",
      border: "none",
      height: "32px",
      minHeight: "32px",
      borderRadius: 8,
    }),
    indicatorSeparator: (baseStyles: any) => ({
      ...baseStyles,
      display: "none"
    }),
    dropdownIndicator: (baseStyles: any) => ({
      ...baseStyles,
      display: "none"
    }),
  };

  return (
    <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
      {/* <Container className='flex shrink-0 grow basis-auto flex-col pb-0'> */}
      {/* <div className='flex h-full flex-wrap content-start'>
          <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
              <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'> */}
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
            <div className='mt-2 grid grid-cols-12 gap-3'>
              <div className='col-span-4 lg:col-span-4 mt-5'>
                <Label htmlFor='customerName'>
                  Customer
                  <span className='ml-1 text-red-500'>*</span>
                </Label>
                <CreateSelectReact
                  id={`name`}
                  name={`name`}
                  options={customerData.map((customer: any) => ({
                    value: customer._id,
                    label: customer.name,
                  }))}
                  value={{ value: customerId, label: customerName }}
                  onChange={(selectedOption: any) => {
                    setCustomerId(selectedOption.value);
                    setCustomerName(selectedOption.label);
                    SetCurrentCustomerData(selectedOption.value)
                  }}
                  onCreateOption={(e) => {
                    setCreateCustomer(e);
                    setIsCreateCustomerOpen(true);
                  }}
                  styles={selectedStyle}
                />
              </div>
              <div className='col-span-4 lg:col-span-4 mt-5'>
                <Label htmlFor='customerOrderNumber'>
                  Order Number
                  <span className='ml-1 text-red-500'>*</span>
                </Label>
                <Input
                  id='customerOrderNumber'
                  name='customerOrderNumber'
                  value={customerOrderNumber}
                  disabled
                  className='cursor-not-allowed'
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
                    <div key={index} className='mt-2 grid grid-cols-12 gap-3'>
                      {!productTransfer ? (<>
                        <div className='col-span-12 lg:col-span-3'>
                          <Label htmlFor={`name-${index}`}>
                            Products
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>

                          <CreateSelectReact
                            id={`product-${index}`}
                            name={`product-${index}`}
                            options={productsData.map((product: any) => ({
                              value: product._id,
                              label: `${product.name} (${product.productCode}) (${product.length}) (${product.thickness}) `
                            }))}
                            onChange={(selectedOption) => handleProductChange(selectedOption, index)}
                            styles={selectedStyle}
                          />

                        </div>
                        {entry.product && (
                          <>
                            <div className='col-span-12 lg:col-span-2'>
                              <Label htmlFor={`length-${index}`}>
                                Length(ft)
                                <span className='ml-1 text-red-500'>*</span>
                              </Label>
                              <Input
                                type='number'
                                id={`length-${index}`}
                                name={`length-${index}`}
                                value={entry.length || productsData.find((item: any) => item._id === entry.product)?.length || ''}
                                onChange={(e) => handleLengthChange(e, index)}
                                min={0}
                              />

                            </div>
                            <div className='col-span-12 lg:col-span-2'>
                              <Label htmlFor={`Weight-${index}`}>
                                Weight(kg)
                                <span className='ml-1 text-red-500'>*</span>
                              </Label>
                              <Input
                                type='number'
                                id={`weight-${index}`}
                                name={`weight-${index}`}
                                value={entry.weight || productsData.find((item: any) => item._id === entry.product)?.weight || ''}
                                onChange={(e) => handleWeightChange(e, index)}
                                min={0}
                              />
                            </div>
                          </>
                        )}
                      </>
                      )
                        : (<>
                          <div className='col-span-12 lg:col-span-2'>
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
                      <div className='col-span-12 lg:col-span-2'>
                        <Label htmlFor={`hsn-${index}`}>
                          Quantity(Pcs)
                          <span className='ml-1 text-red-500'>*</span>
                        </Label>
                        <Input
                          type='number'
                          id={`hsn-${index}`}
                          name={`hsn-${index}`}
                          value={entry.quantity}
                          min={0}
                          onChange={(e) => {
                            const updatedEntries = [...entries];
                            updatedEntries[index].quantity = e.target.value;
                            setEntries(updatedEntries);
                          }}
                        />
                        {entry.product && entry.quantity && (
                          <div style={{ fontSize: '11px', marginTop: '0.5rem', color: productsArray.find((product: any) => product.productId === entry.product) ? 'green' : 'red' }}>
                            {(() => {
                              const product = productsArray.find((product: any) => product.productId === entry.product);
                              if (product) {
                                return `${product.productName} has ${product.totalQuantity} quantity`;
                              } else {
                                return 'This product is not available in inventory still you can create CO now';
                              }
                            })()}
                          </div>
                        )}
                      </div>
                      <div className='col-span-12 lg:col-span-2'>
                        <Label htmlFor={`hsn-${index}`}>
                          Coating
                          <span className='ml-1 text-red-500'>*</span>
                        </Label>
                        <CreateSelectReact
                          placeholder='Select Coating'
                          id={`coating-${index}`}
                          name={`coating-${index}`}
                          options={coatingData.map((customer: any) => ({
                            value: customer._id,
                            label: customer.name,
                          }))}
                          value={(entry.coating || selectedCoatings[index]) ? { value: entry.coating, label: coatingData?.find((item: any) => item?._id === entry.coating)?.name } : null}
                          onChange={(selectedOption: any) => {
                            const value = selectedOption.value
                            handleCoatingChange(value, index)
                          }}
                          onCreateOption={(e) => {
                            setCreateCoating({ name: e, index });
                            setIsCreateCoatingOpen(true);
                          }}
                          styles={selectedCostingStyle}
                        />
                      </div>
                      {entry.coating &&
                        (<div className='col-span-12 lg:col-span-2'>
                          <Label htmlFor={`hsn-${index}`}>
                            Color
                            <span className='ml-1 text-red-500 '>*</span>
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

                      <div className='col-span-12 lg:col-span-2'>
                        <Label htmlFor={`hsn-${index}`}>
                          Coating Rate(rs)
                          <span className='ml-1 text-red-500'>*</span>
                        </Label>
                        <Input
                          type='number'
                          id={`hsn-${index}`}
                          name={`hsn-${index}`}
                          value={entry.coating_rate}
                          min={0}
                          onChange={(e) => {
                            const updatedEntries = [...entries];
                            updatedEntries[index].coating_rate = e.target.value;
                            setEntries(updatedEntries);
                          }}
                        />
                      </div>

                      <div className='col-span-12 lg:col-span-2'>
                        <Label htmlFor={`hsn-${index}`}>
                          Product Weight(kg)
                        </Label>
                        <Input
                          type='number'
                          id={`hsn-${index}`}
                          name={`hsn-${index}`}
                          value={parseFloat((entry.quantity * (entry.weight || (productsData.find((item: any) => item._id === entry.product)?.weight)) || 0).toFixed(2))}
                          min={0}
                          disabled
                        />
                      </div>


                      <div className='col-span-12 lg:col-span-2'>
                        <Label htmlFor={`hsn-${index}`}>
                          Total Coating Rate(rs)
                        </Label>
                        <Input
                          type='number'
                          id={`hsn-${index}`}
                          name={`hsn-${index}`}
                          value={entry.quantity * (entry.length || productsData.find((item: any) => item._id === entry.product)?.length || 0) * entry.coating_rate}
                          min={0}
                          disabled
                        />
                      </div>

                      <div className='col-span-12 lg:col-span-2'>
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
                      {coatingData.find((coating: any) => coating._id === entry.coating)?.type === 'anodize' && (<div className='col-span-12 lg:col-span-2'>
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
                  <Button variant='solid' color='blue' type='button' icon='HeroPlus' onClick={handleAddEntry}>
                    Add Entry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className='col-span-12 flex flex-col gap-1 xl:col-span-6 mt-5'>
        <Card>
          <CardBody>
            <div className='flex'>
              <div className='bold w-full'>
                <Button
                  variant='outlined'
                  className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                >
                  Other Details
                </Button>
              </div>
            </div>
            <div>
              <div className='mt-2 grid grid-cols-12 gap-3'>
                <div className='col-span-12 lg:col-span-12'>
                  <div className='mt-2 grid grid-cols-6 gap-3' >
                    <div className='col-span-4 lg:col-span-2 mt-5'>
                      <Label htmlFor='discount'>
                        Coating Discount(%)
                        <span className='ml-1 text-red-500'>*</span>
                      </Label>
                      <Input
                        type='number'
                        name="discount"
                        value={discount}
                        min={0}
                        onChange={(e) => {
                          setDiscount(parseInt(e.target.value))
                        }}
                      />
                    </div>

                    <div className='col-span-4 lg:col-span-2 mt-5'>
                      <Label htmlFor='gst'>
                        GST(%)
                        <span className='ml-1 text-red-500'>*</span>
                      </Label>
                      <Input
                        type='number'
                        name="gst"
                        value={gst}
                        min={0}
                        onChange={(e) => {
                          setGst(parseInt(e.target.value))
                        }}
                      />
                    </div>

                    <div className='col-span-4 lg:col-span-2 mt-5'>
                      <Label htmlFor='alluminiumRate'>
                        Alluminium Rate(rs/kg)
                        <span className='ml-1 text-red-500'>*</span>
                      </Label>
                      <Input
                        type='number'
                        name="alluminiumRate"
                        value={alluminiumRate}
                        min={0}
                        onChange={(e) => {
                          setAlluminiumRate(parseInt(e.target.value))
                        }}
                      />
                    </div>
                    <div className='col-span-4 lg:col-span-2 mt-5'>
                      <Label htmlFor='estimatedWeight'>
                        Estimated Weight(kg)
                        <span className='ml-1 text-red-500'>*</span>
                      </Label>
                      <Input
                        type='number'
                        name="estimatedWeight"
                        value={estimateWeight}
                        min={0}
                        onChange={(e) => {
                          setEstimateWeight(parseInt(e.target.value))
                        }}
                      />
                    </div>
                    <div className='col-span-4 lg:col-span-2 mt-5'>
                      <Label htmlFor='estimatedRate'>
                        Total Product Rate(rs)
                        <span className='ml-1 text-red-500'>*</span>
                      </Label>
                      <Input
                        type='number'
                        name="estimatedRate"
                        value={estimateRate}
                        min={0}
                        onChange={(e) => {
                          setEstimateRate(parseInt(e.target.value))
                        }}
                      />
                    </div>

                    <div className='col-span-4 lg:col-span-2 mt-5'>
                      <Label htmlFor='coatingCharges'>
                        Coating Charges(rs)
                        <span className='ml-1 text-red-500'>*</span>
                      </Label>
                      <Input
                        type='number'
                        name="coatingCharges"
                        value={coatingCharges}
                        min={0}
                        onChange={(e) => {
                          setCoatingCharges(parseInt(e.target.value))
                        }}
                      />
                    </div>

                    <div className='col-span-4 lg:col-span-2 mt-5'>
                      <Label htmlFor='grandTotal'>
                        Grand Total(rs)
                        <span className='ml-1 text-red-500'>*</span>
                      </Label>
                      <Input
                        type='number'
                        name="grandTotal"
                        value={grandTotal}
                        min={0}
                        onChange={(e) => {
                          setGrandTotal(parseFloat(e.target.value))
                        }}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className='mt-5'>
              <Button variant='solid' color='blue' type='button' onClick={handleSaveEntries} >
                Save Entries
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {isCreateCustomerOpen ?
        <AddCustomerModal
          isOpen={true}
          setIsOpen={setIsCreateCustomerOpen}
          customerName={createCustomer}
          fetchVendorData={fetchVendorData}
          setCustomerName={setCustomerName}
          setCustomerId={setCustomerId}
        /> : null
      }
      {isCreateCoatingOpen ?
        <AddCoatingModal
          isOpen={true}
          setIsOpen={setIsCreateCoatingOpen}
          defaultValue={createCoating}
          fetchData={getCoatingAndUpdateColorDetails}
          entries={entries}
          setEntries={setEntries}
        /> : null
      }
    </PageWrapper>
  );
};

export default AddCustomerOrderForm;