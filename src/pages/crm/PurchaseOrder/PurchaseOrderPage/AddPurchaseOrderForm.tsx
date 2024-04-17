/* eslint-disable react/react-in-jsx-scope */
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
import { toast } from 'react-toastify';
import SelectReact from '../../../../components/form/SelectReact';


const AddproductForm = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [entries, setEntries] = useState<any>([{ product: '', requiredQuantity: '', }]);
  const [id, setId] = useState(0);
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorData, setVendorData] = useState([])
  console.log("🚀 ~ AddproductForm ~ vendorData:", vendorData)
  const [productListData, setProductListData] = useState<any>([])
  const [products, setProducts] = useState()
  const navigate = useNavigate()
  const addProductToDatabase = async (values: any) => {
    try {
      const { data } = await post("/products", values);
    } catch (error) {
      console.error("Error Adding Product", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      hsn: '',
      thickness: 0,
      length: 0,
      weight: 0,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setFormSubmitted(true);
      addProductToDatabase(values);
    },
  });

  const handleAddEntry = () => {
    setEntries([...entries, { product: '', requiredQuantity: '', }]);
  };



  const handleSaveEntries = async () => {
    const duplicateProductIds = entries
      .map((entry: any) => entry.product)
      .filter((productId: any, index: any, array: any) => array.indexOf(productId) !== index);
    if (duplicateProductIds.length > 0) {
      toast.error('You have selected the same product more than once');
      return;
    }
    const finalValues = {
      id,
      vendor: vendorId,
      products: entries
    };

    try {
      const { data } = await post("/purchase-order", finalValues);
      toast.success('Purchase Order Created Successfully!');
      navigate(PathRoutes.purchase_order);
    } catch (error: any) {
      toast.error('Error Creating Purchase Order', error);
    } finally {
      navigate(PathRoutes.purchase_order)
    }

  };


  const handleDeleteProduct = (index: any) => {
    const newProduct = [...entries]
    newProduct.splice(index, 1)
    setEntries(newProduct)
  }

  const fetchData = async () => {

    try {
      const { data: allProductList } = await get(`/products`);
      setProductListData(allProductList);
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
    } finally {
    }
  };

  const fetchVendorData = async () => {
    try {
      const { data: allVendorData } = await get('/vendors')
      setVendorData(allVendorData)
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
    }
  }


  useEffect(() => {
    fetchVendorData();
    fetchData();
  }, [])
  console.log("called")

  return (
    <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
      <Card>
        <CardBody>
          <div className='flex'>
            <div className='bold w-full'>
              <Button
                variant='outlined'
                className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
              >
                Add Purchase Order
              </Button>
            </div>
          </div>
          <div>
            <div className='col-span-4 lg:col-span-4 mt-5'>
              <Label htmlFor='vendorName'>
                Vendor
                <span className='ml-1 text-red-500'>*</span>
              </Label>
              
              <SelectReact
                options={vendorData.map((vendor: any) => ({ value: vendor._id, label: vendor.name }))}
                value={{ value: vendorId, label: vendorName }} // Set value to an object containing vendorId and vendorName
                onChange={(selectedOption: any) => {
                  setVendorId(selectedOption.value); // Update vendor ID
                  setVendorName(selectedOption.label); // Update vendor name
                }}
                name='vendorName'
              />

            </div>
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
                      // isDisable={!privileges.canWrite()}
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
                <div key={index} className='mt-2 grid grid-cols-4 gap-1'>

                  <div className='col-span-12 lg:col-span-2'>
                    <Label htmlFor={`name-${index}`}>
                      Products
                      <span className='ml-1 text-red-500'>*</span>
                    </Label>
                    {/* <Select
                      placeholder='Select Product'
                      id={`product-${index}`}
                      name={`product-${index}`}
                      value={entry.product}
                      onChange={(e: any) => {
                        const updatedEntries = [...entries];
                        updatedEntries[index].product = e.target.value;
                        setEntries(updatedEntries);
                      }}
                    >
                      {productListData.map((data: any) => (
                        <option key={data._id} value={data._id}>  
                          {data.name} ({data.productCode})
                        </option>
                      ))}
                    </Select> */}
                    <SelectReact
                      id={`product-${index}`}
                      name={`product-${index}`}
                      options={productListData.map((product: any) => ({ value: product._id, label: `${product.name} (${product.productCode} ) (${product.length} )` }))}
                      // value={{ value: entry.product, label: productListData.find((product: any) => product._id === entry.product)?.`${name} ${productCode} ${productCode} ` }}
                      value={{
                        value: entry.product,
                        label: productListData.find((product: any) => product._id === entry.product)
                          ? `${productListData.find((product: any) => product._id === entry.product)?.name} (${productListData.find((product: any) => product._id === entry.product)?.productCode}) (${productListData.find((product: any) => product._id === entry.product)?.length})`
                          : ''
                      }}
                      onChange={(selectedOption: any) => {
                        const selectedProductName = productListData.find((product: any) => product._id === selectedOption.value)?.name;
                        const updatedEntries = [...entries];
                        updatedEntries[index].product = selectedOption.value;
                        setEntries(updatedEntries);
                        const dropdown: any = document.getElementById(`product-${index}`);
                        if (dropdown) {
                          dropdown.querySelector('.select__single-value').textContent = selectedProductName;
                        }
                      }}
                    />
                  </div>
                  <div className='col-span-12 lg:col-span-2'>
                    <Label htmlFor={`hsn-${index}`}>
                      Quantity
                      <span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <Input
                      type='number'
                      id={`hsn-${index}`}
                      name={`hsn-${index}`}
                      value={entry.requiredQuantity}
                      onChange={(e) => {
                        const updatedEntries = [...entries];
                        updatedEntries[index].requiredQuantity = e.target.value;
                        setEntries(updatedEntries);
                      }}
                    />
                    {/* ... Error handling for hsn field */}
                  </div>

                </div>
              </>
            ))}
          </div>
          <div className='flex mt-2 gap-2 '>
            <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
              Add Entry
            </Button>
            <Button variant='solid' color='blue' type='button' onClick={handleSaveEntries} >
              Save Entries
            </Button>
          </div>
        </CardBody>
      </Card>
    </div >
  );
};

export default AddproductForm;
