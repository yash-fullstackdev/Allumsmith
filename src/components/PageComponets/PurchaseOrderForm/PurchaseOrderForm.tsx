import React, { useEffect, useState } from "react";
import Label from "../../form/Label";
import SelectReact from "../../form/SelectReact";
import { get } from "../../../utils/api-helper.util";
import Input from "../../form/Input";
import Button from "../../ui/Button";
import ErrorMessage from "../../layouts/common/ErrorMessage";

type props = {
  formik: any,
};
const PurchaseOrderForm = ({ formik }: props) => {
  const [vendorData, setVendorData] = useState<any>([]);
  const [productListData, setProductListData] = useState<any>([]);
  const fetchVendorData = async () => {
    try {
      const { data: allVendorData } = await get('/vendors');
      setVendorData(allVendorData);
    } catch (error: any) {
      console.error('Error fetching vendors:', error.message);
    }
  };
  const fetchData = async () => {
    try {
      const { data: allProductList } = await get(`/products`);
      setProductListData(allProductList?.data);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    }
  };
  const fetchPurchaseOrderNumber = async () => {
    try {
      const { data } = await get('/counter/purchaseOrderNumber')
      formik.setFieldValue('po_number', `PO${data.value}`);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchData();
    fetchVendorData();
    fetchPurchaseOrderNumber()
  }, []);

  const showProductDetails = (productArray: any, productId: string): string => {
    if (productArray?.length > 0) {
      const { name, productCode, length, thickness } = productArray.find((product: any) => product._id.toString() === productId.toString())
      return `${name} (${productCode}) (L ${length}) (T ${thickness})`
    };
    return "";
  }

  const handleDeleteProduct = (index: any) => {
    const newEntries = [...formik.values.entries];
    newEntries.splice(index, 1);
    formik.setFieldValue('entries', newEntries);
  };
  console.log('formik :>> ', formik);
  return (
    <form>
      <div className='mt-2 flex gap-3'>
        <div className='col-span-4 lg:col-span-4 mt-5 flex-1'>
          <Label htmlFor='vendor' require={true}>
            Vendor
          </Label>
          <SelectReact
            options={vendorData.map((vendor: any) => ({ value: vendor._id, label: vendor.name }))}
            value={formik?.values?.vendor ? { value: formik?.values?.vendor, label: vendorData.find((vendor: any) => vendor._id === formik?.values?.vendor)?.name } : null}
            onChange={(selectedOption: any) => {
              formik.setFieldValue('vendor', selectedOption.value);
            }}
            onBlur={formik.handleBlur}
            name='vendor'
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`vendor`}
          />
        </div>

        <div className='col-span-4 lg:col-span-4 mt-5 flex-1'>
          <Label htmlFor='po-number' require={true}>
            PO-Number2
          </Label>
          <Input
            value={formik?.values?.po_number}
            name='po_number'
            id='po_number'
            disabled
          />
          <ErrorMessage
            touched={formik.touched}
            errors={formik.errors}
            fieldName={`po_number`}
          />
        </div>


      </div>
      {formik.values.entries.map((entry: any, index: number) => {
        return (
          <div key={index} className='mt-2 grid grid-cols-4 gap-3 relative'>
            <div className='absolute right-0 top-0'>
              {formik.values.entries.length > 1 && (
                <div className='flex items-end justify-end'>
                  <Button type='button' onClick={() => handleDeleteProduct(index)} variant='outlined' color='red' icon='HeroXMark' />
                </div>
              )}
            </div>
            <div className='col-span-12 lg:col-span-2'>
              <Label htmlFor={`product-${index}`} require={true}>
                Products
              </Label>
              <SelectReact
                options={productListData.map((product: any) => ({
                  value: product._id,
                  label: `${product.name} (${product.productCode}) (L ${product.length}) (T ${product?.thickness})`,
                }))}
                value={entry.product ? { value: entry.product, label: showProductDetails(productListData, entry.product) } : null}
                onChange={(selectedOption: any) => {
                  formik.setFieldValue(`entries[${index}].product`, selectedOption.value);
                }}
                name={`entries[${index}].product`}
                onBlur={formik.handleBlur}
              />
              <ErrorMessage
                touched={formik?.touched?.entries?.[index]}
                errors={formik?.errors?.entries?.[index]}
                fieldName={`product`}
              />

            </div>
            <div className='col-span-12 lg:col-span-2'>
              <Label htmlFor={`hsn-${index}`} require={true}>
                Quantity
              </Label>
              <Input
                type='number'
                id={`entries[${index}].requiredQuantity`}
                name={`entries[${index}].requiredQuantity`}
                value={entry.requiredQuantity}
                onChange={(e) => {
                  formik.setFieldValue(`entries[${index}].requiredQuantity`, e.target.value);
                }}
              />
              <ErrorMessage
                touched={formik?.touched?.entries?.[index]}
                errors={formik?.errors?.entries?.[index]}
                fieldName={`requiredQuantity`}
              />

            </div>
          </div>
        )
      })}
    </form>
  )
}

export default PurchaseOrderForm