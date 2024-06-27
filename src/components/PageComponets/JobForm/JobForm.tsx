import React, { useEffect, useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/Input";
import { get } from "../../../utils/api-helper.util";
import Select from "../../form/Select";
import Card, { CardBody } from "../../ui/Card";
import Button from "../../ui/Button";
import Collapse from "../../utils/Collapse";
import SelectReact from "../../form/SelectReact";
type props = {
  formik: any,
};

const JobForm = ({ formik }: props) => {
  const [branchData, setBranchData] = useState<any>([])
  const [collapsible, setCollapsible] = useState<boolean>(false);
  const [customerOrderData, setCustomerOrderData] = useState<any>([]);
  const [productsData, setProductsData] = useState<any>([]);
  const [coatingData, setCoatingData] = useState<any>([])
  const [colorDataList, setColorDataList] = useState<Array<any>>([]);


  const getBranchDetails = async () => {
    try {
      const { data } = await get('/branches');
      setBranchData(data);
    } catch (error) {
      console.error("Error Fetching Branch", error);
    }
  }

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
      const { data } = await get('/products');
      const productsWithData = data?.data?.filter((item: any) => item.name);
      setProductsData(productsWithData);
    } catch (error) {
      console.error("Error Fetching Products", error);
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
    getCustomerOrderDetails();
    getProductDetails();
    getBranchDetails();
    getCoatingDetails();

  }, []);



  const handleDeleteBatch = (index: number) => {
    const newBatchList = formik?.values?.batch?.filter((_: any, idx: number) => idx !== index);
    formik?.setFieldValue('batch', newBatchList);
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

  const handleAddOder = () => {
    const newBatchList = [...formik?.values?.batch, { co_id: '', products: [] }];
    formik?.setFieldValue('batch', newBatchList);
  };

  const handleDeleteProduct = (index: number) => {
    const newBatchList = formik?.values?.self_products?.filter((_: any, idx: number) => idx !== index);
    formik?.setFieldValue('self_products', newBatchList);
  };

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

  const handleAddEntry = () => {
    const newBatchList = [...formik?.values?.self_products, {}];
    formik?.setFieldValue('self_products', newBatchList);
  };

  return (
    <div>
      <Card>
        <CardBody>
          <div
            className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
          >
            Add Jobs
          </div>
          <div className='mt-2 grid grid-cols-12 gap-3'>
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
              <Label htmlFor='Colors'>
                Branch
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              <Select
                id='branch'
                name='branch'
                value={formik.values.branch}
                placeholder='Select Type'
                onChange={formik.handleChange}
              >
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
        </CardBody>
      </Card>
      <Card className="mt-4">
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

                    <div className='mt-2 grid grid-cols-12 gap-3'>
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
                        {formik.touched.batch && formik.touched.batch[index] && formik.errors.batch && formik.errors.batch[index] && formik.errors.batch[index].co_id && (
                          <div className='text-red-500'>{formik.errors.batch[index].co_id}</div>
                        )}
                      </div>
                      {batch?.products?.length > 0 ? batch?.products
                        ?.filter((item: any) => item?.coating?.name && item?.color?.name)
                        ?.map((product: any, productIndex: any) => {
                          return (
                            <div key={productIndex} className='mt-[10px] col-span-12 lg:col-span-12 grid grid-cols-12 gap-3'>
                              <div className='col-span-12 lg:col-span-2'>
                                <Label htmlFor={`product${productIndex}`}>
                                  Product {productIndex + 1}
                                </Label>
                                <Input
                                  type='text'
                                  id={`product${productIndex}`}
                                  name={`product${productIndex}`}
                                  value={`${product.product.name}`}
                                  disabled
                                />
                              </div>
                              <div className='col-span-12 lg:col-span-3'>
                                <Label htmlFor={`quantity${productIndex}`}>
                                  Pending Quantity(Pcs)
                                </Label>
                                <Input
                                  type='text'
                                  id={`quantity${productIndex}`}
                                  name={`quantity${productIndex}`}
                                  // value={product.pendingQuantity || product.quantity}
                                  value={product.itemSummary?.pendingQuantity ?? product.quantity}
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
                                {formik?.touched?.batch?.[index]?.products?.[productIndex]?.pickQuantity && formik?.errors?.batch?.[index]?.products?.[productIndex]?.pickQuantity && (
                                  <div className='text-red-500'>
                                    {formik?.errors?.batch?.[index]?.products?.[productIndex]?.pickQuantity}
                                  </div>
                                )}
                                {formik?.touched[`batch[${index}].products[${productIndex}].pickQuantity`] && formik?.errors[`batch[${index}].products[${productIndex}].pickQuantity`] && (
                                  <div className="error">{formik?.errors[`batch[${index}].products[${productIndex}].pickQuantity`]}</div>
                                )}
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

      <Card className="mt-4">
        <CardBody>
          <div
            className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
          >
            Self Product Data
          </div>
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
                  <div className='mt-2 grid grid-cols-12 gap-3'>
                    <div className='col-span-12 lg:col-span-6'>
                      <Label htmlFor={`name-${index}`}>
                        Products
                      </Label>
                      <SelectReact
                        id={`product-${index}`}
                        options={productsData.map((product: any) => ({
                          value: product._id,
                          label: `${product.name} (${product.productCode}) (L ${product.length})`,
                          ...product
                        }))}
                        name={`self_products.[${index}].product_id`}

                        onChange={(e) => {
                          formik?.setFieldValue(`self_products.[${index}]`, e);
                        }}
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
                      {formik.touched.self_products && formik.touched.self_products[index] && formik.errors.self_products && formik.errors.self_products[index] && formik.errors.self_products[index].pickQuantity && (
                        <div className='text-red-500'>{formik.errors.self_products[index].pickQuantity}</div>
                      )}
                    </div>

                    <div className='col-span-12 lg:col-span-3'>
                      <Label htmlFor={`coating${index}`}>
                        Coating
                      </Label>
                      <Select
                        placeholder='Select Coating'
                        id={`coating-${index}`}
                        name={`self_products[${index}].coating`}
                        value={entry?.coating?.id}
                        onChange={(e) => {
                          formik?.setFieldValue(`self_products[${index}].coating`, e.target.value);
                          updateColorOptions(e.target.value, index);
                        }}
                      >
                        {coatingData.map((coating: any) => {
                          return (
                            <option key={coating._id} value={coating._id}>
                              {coating.name}
                            </option>
                          )
                        }

                        )}
                      </Select>
                      {formik.touched.self_products && formik.touched.self_products[index] && formik.errors.self_products && formik.errors.self_products[index] && formik.errors.self_products[index].coating && (
                        <div className='text-red-500'>{formik.errors.self_products[index].coating}</div>
                      )}
                    </div>
                    {entry.coating ? (
                      <div className='col-span-12 lg:col-span-3'>
                        <Label htmlFor={`coating${index}`}>
                          Color
                        </Label>
                        <Select
                          placeholder='Select Coating'
                          id={`color-${index}`}
                          name={`self_products[${index}].color`}
                          value={entry?.color?.id}
                          onChange={formik.handleChange}
                        >
                          {colorDataList[index]?.map((color: any) => {
                            return (
                              <option key={color._id} value={color._id}>
                                {color.name}
                              </option>
                            )
                          })}
                        </Select>
                        {formik.touched.self_products && formik.touched.self_products[index] && formik.errors.self_products && formik.errors.self_products[index] && formik.errors.self_products[index].color && (
                        <div className='text-red-500'>{formik.errors.self_products[index].color}</div>
                      )}
                      </div>
                    ) : null}


                    <div className='col-span-12 lg:col-span-3'>
                      <Label htmlFor={`anodize-${index}`}>
                        Anodize Thickness
                      </Label>
                      <Select
                        id={`anodize-${index}`}
                        name={`self_products[${index}].anodizeThickness`}
                        value={entry.anodizeThickness}
                        onChange={formik.handleChange}
                        placeholder='Select MM'
                        disabled={coatingData.find((coating: any) => coating._id === entry?.coating)?.type !== 'anodize'}
                      >
                        <option value="12 Micron">12 Micron</option>
                        <option value="15 Micron">15 Micron</option>
                        <option value="20 Micron">20 Micron</option>
                      </Select>
                    </div>
                  </div>

                </div>
              )
            }) : null}
            <div className='flex mt-2 gap-2 '>
              <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
                Add Entry
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default JobForm