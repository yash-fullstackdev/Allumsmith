import React, { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import { get, post } from '../../../../utils/api-helper.util';
import Container from '../../../../components/layouts/Container/Container';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Button from '../../../../components/ui/Button';
import { toast } from 'react-toastify';
import { PathRoutes } from '../../../../utils/routes/enum';
import { useNavigate } from 'react-router-dom';
type props = {
  formik: any,
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>;

};
const ReviewJobProcess = ({ formik, isOpen, setIsOpen }: props) => {
  const navigate = useNavigate();
  const [branchData, setBranchData] = useState<any>([])

  const selfProducts = useMemo(() => {
    return formik?.values?.self_products?.filter((item: any) => item?.value) || [];
  }, [formik]);



  const getBranchDetails = async () => {
    try {
      const { data } = await get('/branches');
      setBranchData(data?.find((branch: any) => branch?._id)?.name);
    } catch (error) {
      console.error("Error Fetching Branch", error);
    }
  }
  useEffect(() => {
    getBranchDetails()
  }, []);

  const handleSaveEntries = async () => {
    const value = formik?.values;
    const batch = value?.batch?.map((item: any) => {
      return {
        coEntry: item?.co_id,
        products: item?.products?.map((product: any) => {
          return {
            product: product?.product?._id,
            quantity: Number(product?.pickQuantity),
            coating: product?.coating?._id,
            color: product?.color?._id,
            mm: product?.mm || null
          }
        })
      }
    })
    const selfProducts = value?.self_products?.map((item: any) => {
      return {
        product: item?.value,
        quantity: Number(item?.pickQuantity),
        coating: item?.coating,
        color: item?.color,
        mm: item?.mm || null
      }
    })

    const body: any = {
      name: value?.name,
      branch: value?.branch,
      batch
    }
    if (selfProducts?.length) {
      body.selfProducts = selfProducts
    }

    value?.batch.forEach((entry: any) => {
      entry.products.forEach((item: any) => {
        if ((!item.quantityInBranch ||
            Number(item.quantityInBranch) < Number(item.pickQuantity))) {
          toast.error("Quantity can not be greater than pending quantity");
          throw new Error("Quantity can not be greater than pending quantity");
        }
        if ((!Number(item.pickQuantity))) {
          toast.error("Please Enter Quantity ");
          throw new Error("Please Enter Quantity");
        }
      })
    })
    const jobData = await post('/jobs', body);
    toast.success('Job Created Successfully')
    navigate(PathRoutes.jobs)
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isScrollable fullScreen>
      <ModalHeader
        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
      >
        Review Job Process
      </ModalHeader>

      <ModalBody>
        <PageWrapper name='Review Quantity Status' isProtectedRoute={true}>
          <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
            <h2 className='text-lg font-semibold mb-2'>Branch Name: {branchData} </h2>

            {formik?.values?.batch?.map((batch: any, index: number) => {
              if (!batch?.products?.filter((item: any) => item?.coating?.name && item?.color?.name)?.length) return;
              return (
                <div key={index} className='mt-4'>
                  <h2 className='text-lg font-semibold mb-2'>Customer {index + 1}</h2>
                  {batch?.products
                    ?.filter((item: any) => item?.coating?.name && item?.color?.name)
                    ?.map((product: any, productIndex: number) => {
                      return (
                        <div className='col-span-12 lg:col-span-12 flex gap-3' key={productIndex}>
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
                              Pending Quantity
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
                          <div className='col-span-12 lg:col-span-3'>
                            <Label htmlFor={`quantity${productIndex}`}>
                              Quantity in Branch
                            </Label>
                            <Input
                              type='text'
                              id={`quantity${productIndex}`}
                              name={`quantity${productIndex}`}
                              // value={product.pendingQuantity || product.quantity}
                              value={product?.quantityInBranch || 0}
                              disabled
                            />
                          </div>
                          <div className='col-span-12 lg:col-span-2'>
                            <Label htmlFor={`pickQuantity${productIndex}`}>
                              Quantity
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
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })}
            {selfProducts?.length ? (
              <div>
                <h2 className='text-lg font-semibold mt-4'>Self Products</h2>
                {selfProducts?.map((selfProduct: any, selfProductIndex: number) => {
                  return (
                    <div className='col-span-12 lg:col-span-12 flex gap-3' >
                      <div className='col-span-12 lg:col-span-2'>
                        <Label htmlFor={`selfProductName-${selfProductIndex}`}>
                          Product
                        </Label>
                        <Input
                          type='text'
                          id={`selfProductName-${selfProductIndex}`}
                          name={`selfProductName-${selfProductIndex}`}
                          value={selfProduct.name}
                          disabled
                        />
                      </div>
                      <div className='col-span-12 lg:col-span-3'>
                        <Label htmlFor={`quantity${selfProductIndex}`}>
                          Quantity in Branch
                        </Label>
                        <Input
                          type='text'
                          id={`quantity${selfProductIndex}`}
                          name={`quantity${selfProductIndex}`}
                          // value={product.pendingQuantity || product.quantity}
                          value={selfProduct?.quantityInBranch || 0}
                          disabled
                        />
                      </div>

                      <div className='col-span-12 lg:col-span-2'>
                        <Label htmlFor={`pickQuantity${selfProductIndex}`}>
                          Quantity
                        </Label>
                        <Input
                          type='number'
                          id={`pickQuantity${selfProductIndex}`}
                          name={`self_products[${selfProductIndex}].pickQuantity`}
                          value={selfProduct.pickQuantity}
                          onChange={(e) => {
                            formik?.setFieldValue(`self_products[${selfProductIndex}].pickQuantity`, e.target.value);
                            formik.setFieldTouched(`self_products[${selfProductIndex}].pickQuantity`, true, false);
                          }}
                          min={0}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
              : null}

            <div className='flex mt-2'>
              <Button
                variant='solid'
                color='blue'
                onClick={handleSaveEntries}
              >
                Save Data
              </Button>
            </div>
          </Container>
        </PageWrapper>
      </ModalBody>
    </Modal>
  )
}

export default ReviewJobProcess