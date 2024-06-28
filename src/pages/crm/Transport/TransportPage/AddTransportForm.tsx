import React, { useEffect, useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
import { useFormik } from 'formik';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import SelectReact from '../../../../components/form/SelectReact';
import { transportSchema } from '../../../../utils/formValidations';
import Collapse from '../../../../components/utils/Collapse';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import ErrorMessage from '../../../../components/layouts/common/ErrorMessage';


const AddPurchaseOrderForm = () => {
  const navigation = useNavigate();
  const [branchData, setBranchData] = useState<any>([]);
  const [customerOrderData, setCustomerOrderData] = useState<any>([]);
  const [collapsible, setCollapsible] = useState<boolean>(false);
  const [productsData, setProductsData] = useState<any>([]);

  const removeNullOrUndefined = (obj: any) => {
    for (let key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
    return obj;
  }


  const processProducts = (products: any) => {
    return products?.map((product: any) => {
      const obj = {
        product_id: product?.product?._id,
        name: product?.product?.name,
        coating: product?.coating?._id,
        color: product?.color?._id,
        pick_quantity: Number(product?.pickQuantity) || 0,
        mm: product?.mm
      };
      removeNullOrUndefined(obj);
      return obj;
    });
  }

  const handleSubmit = async (value: any) => {
    try {
      const batch = value?.batch?.map((item: any) => ({
        co_id: item?.co_id,
        products: processProducts(item?.products)
      }))?.filter((item: any) => item?.co_id);

      const self_products = value?.self_products?.map((item: any) => {
        if (item?.product?._id) {
          const obj = {
            product_id: item?.product?._id,
            name: item?.product?.name,
            coating: item?.coating?._id,
            color: item?.color?._id,
            pick_quantity: Number(item?.pickQuantity) || 0,
            mm: item?.mm,
            raw_product: !item?.coating && !item?.color
          };
          removeNullOrUndefined(obj);
          return obj;
        }
      }).filter(Boolean);


      const payload = {
        dispatch_date: value?.dispatch_date,
        from_branch: value?.from_branch,
        to_branch: value?.to_branch,
        vehicle_no: value?.vehicle_no,
        batch,
        self_products
      };

      if (!payload?.batch?.length && !payload?.self_products?.length) {
        toast.error('Please enter Customer Order Products or Self Products');
        return;
      }

      const response = await post('/transport', payload);
      navigation(`${PathRoutes.transport}`)
    } catch (error: any) {
      console.log('error :>> ', error, error.response?.data?.message, error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const formik: any = useFormik({
    initialValues: {
      dispatch_date: null,
      from_branch: '',
      to_branch: "",
      vehicle_no: "",
      batch: [{
        co_id: '',
        products: [{}]
      }],
      self_products: [{}],
    },
    validationSchema: transportSchema,
    onSubmit: async (value) => {
      handleSubmit(value);
    }
  });
  const handleAddOder = () => {
    const newBatchList = [...formik?.values?.batch, { co_id: '', products: [] }];
    formik?.setFieldValue('batch', newBatchList);
  };
  const handleAddEntry = () => {
    const newBatchList = [...formik?.values?.self_products, {}];
    formik?.setFieldValue('self_products', newBatchList);
  };
  console.log("formik", formik)

  const handleDeleteBatch = (index: number) => {
    const newBatchList = formik?.values?.batch?.filter((_: any, idx: number) => idx !== index);
    formik?.setFieldValue('batch', newBatchList);
  };
  const handleDeleteProduct = (index: number) => {
    const newBatchList = formik?.values?.self_products?.filter((_: any, idx: number) => idx !== index);
    formik?.setFieldValue('self_products', newBatchList);
  };


  const handleDeleteBatchList = (index: number, productIndex: number) => {
    const newBatchList = formik.values?.batch[index].products?.filter((_: any, idx: number) => idx !== productIndex);
    const updatedOrders = formik?.values?.batch.map((orderItem: any, idx: any) => {
      if (idx === index) {
        return {
          ...orderItem,
          products: newBatchList || [],
        };
      }
      return orderItem;
    });
    formik?.setValues({
      ...formik?.values,
      batch: updatedOrders,
    });
  }

  const fetchBranchData = async () => {
    try {
      const { data: branchesList } = await get(`/branches`);
      branchesList.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setBranchData(branchesList);
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
    }
  };
  const getCustomerOrderDetails = async () => {
    try {
      const { data } = await get('/customer-order');
      setCustomerOrderData(data);
    } catch (error) {
      console.error('Error Fetching Customer Order');
    }
  }
  const getProductDetails = async () => {
    try {
      const { data } = await get('/finish_inventory');
      const { data: inventoryList } = await get(`/inventory`);
      const finishInventory = data
        ?.filter((item: any) => item?.associatedWith === "self-product")
        ?.map((item: any) => ({
          label: `${item?.product?.name} (${item?.coating?.name}) (${item?.color?.name})`,
          value: item?.product?._id,
          finish_inventory: true,
          coating: item?.coating,
          color: item?.color,
          branch: item?.branch,
          quantity: item?.quantity,
          ...item,
        }))
      const inventory = inventoryList?.map((item: any) => ({
        ...item,
        finish_inventory: false,
        value: item?.product?._id,
        label: `${item?.product?.name} (${item?.branch?.name}) (L ${item?.product?.length}) (T ${item?.product?.thickness}) (raw product)`
      }))

      setProductsData([...finishInventory, ...inventory]);
    } catch (error) {
      console.error("Error Fetching Products", error);
    }
  }

  useEffect(() => {
    fetchBranchData();
    getCustomerOrderDetails();
    getProductDetails();
  }, [])

  const minDate = new Date("2015-01-01").toISOString().split('T')[0];
  const maxDate = new Date("2035-01-01").toISOString().split('T')[0];
  return (
    <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
      <Subheader>
        <SubheaderLeft>
          <Button
            icon='HeroArrowLeft'
            className='!px-0'
            onClick={() => navigation(`${PathRoutes.transport}`)}
          >
            {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
          </Button>
          <SubheaderSeparator />
        </SubheaderLeft>
        <SubheaderRight >
          <Button variant='solid' color='blue' onClick={() => formik.handleSubmit()}>
            Save Transport
          </Button>
        </SubheaderRight>
      </Subheader>
      <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
        <Card>
          <CardBody>
            <div
              className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
            >
              Transport Details
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div >
                <div className='mt-2 grid grid-cols-12 gap-1'>
                  <div className='col-span-12 lg:col-span-4'>
                    <Label htmlFor='date'>
                      Date
                      <span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <Input
                      id='dispatch_date'
                      type='date'
                      name='dispatch_date'
                      value={formik.values.dispatch_date}
                      onChange={formik.handleChange}
                      onBlur={formik?.handleBlur}
                      min={minDate}
                      max={maxDate}
                    />
                    <ErrorMessage
                      touched={formik.touched}
                      errors={formik.errors}
                      fieldName={`dispatch_date`}
                    />
                  </div>

                  <div className='col-span-12 lg:col-span-4'>
                    <Label htmlFor='fromBranch'>
                      From Branch
                      <span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <SelectReact
                      options={branchData?.map((branch: any) => ({ value: branch._id, label: branch.name }))}
                      onChange={(selectedOption: any) => {
                        formik.setFieldValue('from_branch', selectedOption.value);
                      }}
                      onBlur={formik.handleBlur}
                      name='from_branch'
                    />
                    <ErrorMessage
                      touched={formik.touched}
                      errors={formik.errors}
                      fieldName={`from_branch`}
                    />
                  </div>

                  <div className='col-span-12 lg:col-span-4'>
                    <Label htmlFor='fromBranch'>
                      To Branch
                      <span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <SelectReact
                      options={branchData?.map((branch: any) => ({ value: branch._id, label: branch.name }))}
                      onChange={(selectedOption: any) => {
                        formik.setFieldValue('to_branch', selectedOption.value);
                      }}
                      onBlur={formik.handleBlur}
                      name='to_branch'
                    />
                    <ErrorMessage
                      touched={formik.touched}
                      errors={formik.errors}
                      fieldName={`to_branch`}
                    />
                  </div>
                  <div className='col-span-12 lg:col-span-4'>
                    <Label htmlFor='vehicle_no'>
                      Vehicle No
                      <span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <Input
                      name='vehicle_no'
                      id='vehicle_no'
                      placeholder='Enter Vehicle No'
                      value={formik.values.vehicle_no}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <ErrorMessage
                      touched={formik.touched}
                      errors={formik.errors}
                      fieldName={`vehicle_no`}
                    />
                  </div>

                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className='mt-5'>
          <CardBody>
            <div className='flex'>
              <div className='bold w-full'>
                <Button
                  variant='outlined'
                  className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                  rightIcon={
                    !collapsible
                      ? 'HeroChevronUp'
                      : 'HeroChevronDown'
                  }
                  onClick={() => setCollapsible(!collapsible)}
                >
                  Customer Order Products
                </Button>
              </div>
            </div>
            <Collapse isOpen={!collapsible}>
              <div>
                {formik?.values?.batch?.length ? formik?.values?.batch?.map((batch: any, index: number) => {
                  return (
                    <div>
                      <div className='flex items-end justify-end mt-2'>
                        {formik?.values?.batch.length > 1 && (
                          <div className='flex items-end justify-end'>
                            <Button
                              type='button'
                              onClick={() => handleDeleteBatch(index)}
                              variant='outlined'
                              color='red'
                              rightIcon={'CrossIcon'}
                              style={{ fontSize: 20 }}
                            />
                          </div>
                        )}
                      </div>

                      <div className='mt-2 grid grid-cols-12 gap-1'>
                        <div key={index} className='col-span-12 lg:col-span-4'>
                          <Label htmlFor={`customerOrder${index}`}>
                            Customer Order {index + 1}
                            <span className='ml-1 text-red-500'>*</span>
                          </Label>

                          <Select
                            id={`customerOrder${index}`}
                            name={`batch.[${index}].co_id`}
                            value={formik?.values?.batch?.[index]?.co_id}
                            placeholder='Select Customer Order'
                            onChange={(e) => {
                              formik?.setFieldValue(`batch[${index}].co_id`, e.target.value);
                              const selectedOrderName = e.target.options[e.target.selectedIndex].text;
                              const findOrder = customerOrderData?.find((co: any) => co._id === e.target.value)?.entries
                              const updatedOrders = formik?.values?.batch.map((orderItem: any, idx: any) => {
                                if (idx === index) {
                                  return {
                                    ...orderItem,
                                    co_id: e.target.value,
                                    products: findOrder
                                      ?.filter((item: any) => item?.coating?.name && item?.color?.name)
                                      ?.map((item: any) => ({ ...item, pickQuantity: null })) || [],
                                  };
                                }
                                return orderItem;
                              });
                              formik?.setValues({
                                ...formik?.values,
                                batch: updatedOrders,
                              });
                            }}
                            onBlur={formik.handleBlur}
                          >
                            {customerOrderData?.map((co: any) => {
                              return (
                                <option key={co._id} value={co._id}>
                                  {co.customer.name} ({co.customerOrderNumber})
                                </option>
                              );
                            })}
                          </Select>
                          <ErrorMessage
                            touched={formik?.touched?.batch?.[index]}
                            errors={formik?.errors?.batch?.[index]}
                            fieldName={`to_branch`}
                          />
                        </div>
                        {batch?.products?.length > 0 ? batch?.products
                          ?.filter((item: any) => item?.coating?.name && item?.color?.name)
                          ?.map((product: any, productIndex: any) => {

                            return (
                              <div key={productIndex} className='mt-[10px] col-span-12 lg:col-span-12 grid grid-cols-12 gap-1'>
                                <div className='col-span-12 lg:col-span-2'>
                                  <Label htmlFor={`product${productIndex}`}>
                                    Product {productIndex + 1}
                                  </Label>
                                  <Input
                                    type='text'
                                    id={`product${productIndex}`}
                                    name={`product${productIndex}`}
                                    value={`${product.product.name} (${product?.product?.length})`}
                                    disabled
                                  />
                                </div>
                                <div className='col-span-12 lg:col-span-2'>
                                  <Label htmlFor={`quantity${productIndex}`}>
                                    Available QTY(Pcs)
                                  </Label>
                                  <Input
                                    type='text'
                                    id={`quantity${productIndex}`}
                                    name={`quantity${productIndex}`}
                                    value={product.itemSummary?.coatingQuantity}
                                    disabled
                                  />
                                </div>
                                <div className='col-span-12 lg:col-span-2'>
                                  <Label htmlFor={`pickQuantity${productIndex}`}>
                                    Pick QTY(Pcs)
                                  </Label>
                                  <Input
                                    type='number'
                                    id={`pickQuantity${productIndex}`}
                                    name={`batch[${index}].products[${productIndex}].pickQuantity`}
                                    value={product.pickQuantity}
                                    onChange={(e) => {
                                      formik?.setFieldValue(`batch[${index}].products[${productIndex}].pickQuantity`, e.target.value);
                                      formik.setFieldTouched(`batch[${index}].products[${productIndex}].pickQuantity`, true, false);
                                    }}
                                    min={0}
                                  />

                                  <ErrorMessage
                                    touched={formik?.touched?.batch?.[index]?.products?.[productIndex]}
                                    errors={formik?.errors?.batch?.[index]?.products?.[productIndex]}
                                    fieldName={`pickQuantity`}
                                  />
                                </div>
                                <div className='col-span-12 lg:col-span-2'>

                                  <Label htmlFor={`coating${productIndex}`}>
                                    Coating
                                  </Label>
                                  <Input
                                    type='text'
                                    id={`coating${productIndex}`}
                                    name={`coating${productIndex}`}
                                    value={product?.coating?.name}
                                    disabled
                                  />
                                </div>
                                <div className='col-span-12 lg:col-span-2'>
                                  <Label htmlFor={`color${productIndex}`}>
                                    Color
                                  </Label>
                                  <Input
                                    type='text'
                                    id={`color${productIndex}`}
                                    name={`color${productIndex}`}
                                    value={product?.color?.name}
                                    disabled
                                  />
                                </div>
                                {product?.mm && (<div className='col-span-12 lg:col-span-1'>
                                  <Label htmlFor={`mm${productIndex}`}>
                                    MM
                                  </Label>
                                  <Input
                                    type='text'
                                    id={`mm${productIndex}`}
                                    name={`mm${productIndex}`}
                                    value={product?.mm}
                                    disabled
                                  />
                                </div>)}
                                {batch?.products
                                  ?.filter((item: any) => item?.coating?.name && item?.color?.name)?.length > 1 ? (
                                  <div className='col-span-12 lg:col-span-1 mt-[20px]'>
                                    <Button
                                      type='button'
                                      onClick={() => handleDeleteBatchList(index, productIndex)}
                                      variant='outlined'
                                      color='red'
                                      rightIcon={'CrossIcon'}
                                      className='py-1.5 px-5'
                                      style={{ fontSize: 20 }}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            )
                          })
                          : null}
                      </div>
                    </div>
                  )
                }) : null}
              </div>
              <div className='flex mt-2 gap-2 '>
                <Button variant='solid' color='blue' type='button' onClick={handleAddOder}>
                  Add Customer Order
                </Button>
              </div>
            </Collapse>

          </CardBody>
        </Card>
        <Card className='mt-5'>
          <CardBody>
            <div
              className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
            >
              Self Products
            </div>
            <div>
              <div>
                {formik?.values?.self_products?.length ? formik?.values?.self_products?.map((entry: any, index: any) => {
                  return (
                    <div>
                      <div className='flex items-end justify-end mt-2'>
                        {formik?.values?.self_products.length > 1 && (
                          <div className='flex items-end justify-end'>
                            <Button
                              type='button'
                              onClick={() => handleDeleteProduct(index)}
                              variant='outlined'
                              color='red'
                              rightIcon={'CrossIcon'}
                              style={{ fontSize: 20 }}
                            />
                          </div>
                        )}
                      </div>
                      <div className='mt-2 grid grid-cols-12 gap-1'>
                        <div className='col-span-12 lg:col-span-6'>
                          <Label htmlFor={`name-${index}`}>
                            Products
                          </Label>
                          <SelectReact
                            id={`product-${index}`}
                            options={productsData?.filter((product: any) => product?.branch?._id !== formik?.values?.to_branch)}
                            name={`self_products.[${index}].product_id`}

                            onChange={(e) => {
                              formik?.setFieldValue(`self_products[${index}]`, e);
                            }}
                          />
                        </div>
                        <div className='col-span-12 lg:col-span-3'>
                          <Label htmlFor={`quantity${index}`}>
                            Available QTY(Pcs)
                          </Label>
                          <Input
                            type='text'
                            id={`quantity${index}`}
                            name={`quantity${index}`}
                            value={entry?.quantity}
                            disabled
                          />
                        </div>
                        <div className='col-span-12 lg:col-span-3'>
                          <Label htmlFor={`pickQuantity${index}`}>
                            Pick QTY(Pcs)
                          </Label>
                          <Input
                            type='number'
                            id={`pickQuantity${index}`}
                            name={`self_products[${index}].pickQuantity`}
                            value={entry.pickQuantity}
                            onChange={(e) => {
                              formik?.setFieldValue(`self_products[${index}].pickQuantity`, e.target.value);
                              formik.setFieldTouched(`self_products[${index}].pickQuantity`, true, false);
                            }}
                            min={0}
                          />
                          <ErrorMessage
                            touched={formik?.touched?.self_products?.[index]}
                            errors={formik?.errors?.self_products?.[index]}
                            fieldName={`pickQuantity`}
                          />
                        </div>
                        {entry?.coating?.name ? (
                          <div className='col-span-12 lg:col-span-3'>
                            <Label htmlFor={`coating${index}`}>
                              Coating
                            </Label>
                            <Input
                              type='text'
                              id={`coating${index}`}
                              name={`coating${index}`}
                              value={entry?.coating?.name}
                              disabled
                            />
                          </div>
                        ) : null}

                        {entry?.color?.name ? (
                          <div className='col-span-12 lg:col-span-3'>
                            <Label htmlFor={`color${index}`}>
                              Color
                            </Label>
                            <Input
                              type='text'
                              id={`color${index}`}
                              name={`color${index}`}
                              value={entry?.color?.name}
                              disabled
                            />
                          </div>
                        ) : null}

                        {entry?.mm ? (
                          <div className='col-span-12 lg:col-span-1'>
                            <Label htmlFor={`mm${index}`}>
                              MM
                            </Label>
                            <Input
                              type='text'
                              id={`mm${index}`}
                              name={`mm${index}`}
                              value={entry?.mm}
                              disabled
                            />
                          </div>
                        ) : null}
                      </div>

                    </div>
                  )
                }) : null}
              </div>
              <div className='flex mt-2 gap-2 '>
                <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
                  Add Entry
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default AddPurchaseOrderForm;


