import React, { useEffect, useState } from 'react';
import Card, { CardBody } from '../../../../components/ui/Card';
import Input from '../../../../components/form/Input';
import Label from '../../../../components/form/Label';
import Container from '../../../../components/layouts/Container/Container';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Button from '../../../../components/ui/Button';
import { toast } from 'react-toastify';
import { get, post } from '../../../../utils/api-helper.util';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import Checkbox from '../../../../components/form/Checkbox';

const ReviewQuantityStatus = ({ processReviewData, setProcessReviewData, productQuantityDetails, setQuantityStatusModal }: any) => {
    console.log("processReviewData", processReviewData)
    const [quantityInSpecificBranch, setQuantityInSpecificBranch] = useState<number>(0);
    const [productQuantities, setProductQuantities] = useState<any>({});
    const [fromFinishInventory,setFromFinishInventory] = useState<any>({});
    const [fiQty,setFiQty] = useState<any>({});
    // const [availableQty,setAvailableQty] = useState<any>({})

    const navigate = useNavigate();
    useEffect(() => {
        if (processReviewData && processReviewData.batch) {
            const totalQuantityInSpecificBranch = processReviewData.batch.reduce((total: any, batch: any) => {
                return total + batch.products.reduce((batchTotal: any, product: any) => {
                    return batchTotal + (productQuantityDetails.find((item: any) => item?._id === product.product.id)?.quantity || 0);
                }, 0);
            }, 0);
            setQuantityInSpecificBranch(totalQuantityInSpecificBranch);
        }
    }, [processReviewData]);

    const handleQuantityChange = (batchIndex: number, productIndex: number, newValue: number) => {
        const productId = processReviewData.batch[batchIndex].products[productIndex].product.id;

        const quantityInBranch = productQuantityDetails.find((item: any) => item?._id === productId)?.quantity || 0;

        // if (newValue > quantityInBranch) {
        //     toast.error('Entered Quantity Exceeds the quantity in branch')
        //     return;
        // }

        const updatedReviewData = processReviewData.batch.map((batch: any, index: number) => {
            if (index === batchIndex) {
                return {
                    ...batch,
                    products: batch.products.map((product: any, idx: number) => {
                        if (idx === productIndex) {
                            return {
                                ...product,
                                quantity: newValue
                            };
                        }
                        return product;
                    })
                };
            }
            return batch;
        });

        // Update the state with the modified review data
        setProcessReviewData({
            ...processReviewData,
            batch: updatedReviewData
        });

        // Update the product quantities state
        setProductQuantities((prevQuantities: any) => ({
            ...prevQuantities,
            [`${batchIndex}-${productIndex}`]: newValue
        }));

        // Recalculate the total quantity in the specific branch
        const totalQuantityInSpecificBranch = updatedReviewData.reduce((total: any, batch: any) => {
            return total + batch.products.reduce((batchTotal: any, product: any) => {
                return batchTotal + (productQuantityDetails.find((item: any) => item?._id === product.product.id)?.quantity || 0);
            }, 0);
        }, 0);
        setQuantityInSpecificBranch(totalQuantityInSpecificBranch);
    };

    // const handleSaveEntries = async () => {
    //     try {
    //         // Calculate the total quantity of each product across all batches
    //         const totalProductQuantities: { [productId: string]: number } = {};
    //         processReviewData.batch.forEach((batch: any, batchIndex: number) => {
    //             batch.products.forEach((product: any, productIndex: number) => {
    //                 const productId = product.product.id;
    //                 const quantityInBatch = productQuantities[`${batchIndex}-${productIndex}`] || product.quantity;
    //                 totalProductQuantities[productId] = (totalProductQuantities[productId] || 0) + quantityInBatch;
    //             });
    //         });

    //         // Check if the total quantity of any product exceeds the quantity in branch
    //         const isQuantityExceededBatch = Object.entries(totalProductQuantities).some(([productId, totalQuantity]) => {
    //             const quantityInBranch = productQuantityDetails.find((item: any) => item?._id === productId)?.quantity || 0;
    //             return totalQuantity > quantityInBranch;
    //         });

    //         if (isQuantityExceededBatch) {
    //             toast.error('Total quantity of products exceeds the quantity in branch');
    //             return;
    //         }

    //         // Check if the total quantity of any self product exceeds the quantity in branch
    //         const isQuantityExceededSelfProducts = processReviewData.selfProducts.some((selfProduct: any) => {
    //             const quantityInBranch = productQuantityDetails.find((item: any) => item?._id === selfProduct.product.id)?.quantity || 0;
    //             return selfProduct.quantity > quantityInBranch;
    //         });

    //         if (isQuantityExceededSelfProducts) {
    //             toast.error('Total quantity of self products exceeds the quantity in branch');
    //             return;
    //         }

    //         // Prepare the data to be saved
    //         const dataToSave = {
    //             name: processReviewData.name,
    //             branch: processReviewData.branchId.id,
    //             batch: processReviewData.batch.map((batch: any) => ({
    //                 coEntry: batch.coEntry,
    //                 products: batch.products.map((product: any) => ({
    //                     product: product.product.id,
    //                     quantity: productQuantities[`${batch.name}-${product.product.id}`] !== undefined ? productQuantities[`${batch.name}-${product.product.id}`] : product.quantity,
    //                     coating: product.coating.id,
    //                     color: product.color.id
    //                 }))
    //             })),
    //             selfProducts: processReviewData.selfProducts.map((product: any) => ({
    //                 product: product.product.id,
    //                 quantity: Number(product.quantity),
    //                 coating: product.coating.id,
    //                 color: product.color.id
    //             }))
    //         };

    //         console.log('Data to save:', dataToSave);

    //         const jobData = await post('/jobs', dataToSave);

    //     } catch (error) {
    //         console.error('Error saving data:', error);
    //     }
    // };
    
    const handleCheckboxChange = (e:React.ChangeEvent<HTMLInputElement>,batchIndex:number,productIndex:number) => {
        const newVal = e.target.checked;

        if(!newVal) {
            setFiQty((prevState:any) => {
                const newState = {...prevState};
                delete newState[`${batchIndex}-${productIndex}`];
                return newState
            })
        }

        setFromFinishInventory((prevState:any) => {
            const newState = {...prevState};
            newState[`${batchIndex}-${productIndex}`] = newVal;
            return newState;
        })
    }

    const handleFiQtyChange = (e:React.ChangeEvent<HTMLInputElement>,batchIndex:number,productIndex:number) => {
        const newVal = Number(e.target.value);
        setFiQty((prevState:any) => {
            const newState = {...prevState};
            newState[`${batchIndex}-${productIndex}`] = newVal;
            return newState;
        })
    }

    const handleSaveEntries = async () => {
        try {
            // Calculate the total quantity of each product across all batches
            const totalProductQuantities: { [productId: string]: number } = {};
            processReviewData.batch.forEach((batch: any, batchIndex: number) => {
                batch.products.forEach((product: any, productIndex: number) => {
                    const productId = product.product.id;
                    const quantityInBatch = productQuantities[`${batchIndex}-${productIndex}`] || product.quantity;
                    totalProductQuantities[productId] = (totalProductQuantities[productId] || 0) + quantityInBatch;
                });
            });

            // Check if the total quantity of any product exceeds the quantity in branch
            const isQuantityExceededBatch = Object.entries(totalProductQuantities).some(([productId, totalQuantity]) => {
                const quantityInBranch = productQuantityDetails.find((item: any) => item?._id === productId)?.quantity || 0;
                return totalQuantity > quantityInBranch;
            });

            if (isQuantityExceededBatch) {
                toast.error('Total quantity of products exceeds the quantity in branch');
                setQuantityStatusModal(false);
            }

            // Prepare the data to be saved
           else{
             const dataToSave: any = {
                name: processReviewData.name,
                branch: processReviewData.branchId.id,
                batch: processReviewData.batch.map((batch: any,batchIndex:number) => ({
                    coEntry: batch.coEntry,
                    products: batch.products
                    ?.filter((item: any) => item?.coating?.name && item?.color?.name)
                    ?.map((product: any,productIndex:number) => {
                        const baseProduct:any = {
                            product: product.product.id,
                            quantity: productQuantities[`${batch.name}-${product.product.id}`] !== undefined
                                ? productQuantities[`${batch.name}-${product.product.id}`]
                                : (product.quantity - fiQty[`${batchIndex}-${productIndex}`]) || product.quantity,
                            coating: product.coating.id,
                            color: product.color.id,
                            mm: product?.mm || null
                        };
        
                        if (fromFinishInventory[`${batchIndex}-${productIndex}`]) {
                            baseProduct['fiQty'] = Number(fiQty[`${batchIndex}-${productIndex}`]) || 0;
                        }
        
                        return baseProduct;
                    })
                })),
            };

            // Add selfProducts only if it exists
            if (processReviewData.selfProducts && processReviewData.selfProducts.length > 0) {
                dataToSave.selfProducts = processReviewData.selfProducts.map((product: any) => ({
                    product: product.product.id,
                    quantity: Number(product.quantity),
                    coating: product.coating.id,
                    color: product.color.id,
                    mm:product?.mm || null
                }));
            }
            processReviewData.batch.forEach((entry:any)=> {
                entry.products.forEach((item:any) => {
                    if(item.quantity > item.pendingQuantity){
                        toast.error('Quantity can not be greater than pending quantity')
                        throw new Error('Quantity can not be greater than pending quantity')
                    }
                })
            })

            console.log('Data to save:', dataToSave);

            const jobData = await post('/jobs', dataToSave);
            toast.success('Job Created Successfully')
            navigate(PathRoutes.jobs)
        }
        } catch (error) {
            console.error('Error saving data:', error);
        }
        
    };

    const handleSelfProductQuantityChange = (selfProductIndex: number, newValue: number) => {
        const updatedSelfProducts = [...processReviewData.selfProducts];
        updatedSelfProducts[selfProductIndex] = { ...updatedSelfProducts[selfProductIndex], quantity: newValue };
        setProcessReviewData((prevData: any) => ({
            ...prevData,
            selfProducts: updatedSelfProducts
        }));
    };
    console.log('Batch',processReviewData )

    return (
        <PageWrapper name='Review Quantity Status' isProtectedRoute={true}>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <div className='flex h-full flex-wrap content-start'>
                    <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                                <Card>
                                    <CardBody>
                                        <h2 className='text-lg font-semibold mb-2'>Branch Name: {processReviewData && processReviewData.branchId.name}</h2>
                                        {processReviewData.batch.map((batch: any, batchIndex: number) => (
                                            <div key={batchIndex} className='mt-4'>
                                                <h2 className='text-lg font-semibold mb-2'>Customer {batchIndex+1}</h2>
                                                {batch.products
                                                ?.filter((item: any) => item?.coating?.name && item?.color?.name)
                                                ?.map((product: any, productIndex: number) => (
                                                    <div className='col-span-12 lg:col-span-12 flex items-center gap-2' key={productIndex}>
                                                        <div className='mt-2'>
                                                            <Label htmlFor={`productQuantity-${productIndex}`}>
                                                                Product
                                                            </Label>
                                                            <Input
                                                                type='text'
                                                                id={`productQuantity-${productIndex}`}
                                                                name={`productQuantity-${productIndex}`}
                                                                value={product.product.name}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className='mt-2'>
                                                            <Label htmlFor={`productQuantity-${productIndex}`}>
                                                                Pending Quantity
                                                            </Label>
                                                            <Input
                                                                type='text'
                                                                id={`productQuantity-${productIndex}`}
                                                                name={`productQuantity-${productIndex}`}
                                                                value={product.pendingQuantity}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className='mt-2'>
                                                            <Label htmlFor={`quantityInBranch-${productIndex}`}>
                                                                Quantity in Branch
                                                            </Label>
                                                            <Input
                                                                type='text'
                                                                id={`quantityInBranch-${productIndex}`}
                                                                name={`quantityInBranch-${productIndex}`}
                                                                value={productQuantityDetails.find((item: any) => item?._id === product.product.id)?.quantity || 0}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className='mt-2'>
                                                            <Label htmlFor={`productQuantity-${productIndex}`}>
                                                                Quantity
                                                            </Label>
                                                            <Input
                                                                type='number'
                                                                id={`productQuantity-${batchIndex}-${productIndex}`}
                                                                name={`productQuantity-${batchIndex}-${productIndex}`}
                                                                value={
                                                                    fromFinishInventory[`${batchIndex}-${productIndex}`]
                                                                        ? Math.max(
                                                                            productQuantities[`${batchIndex}-${productIndex}`] !== undefined
                                                                                ? (productQuantities[`${batchIndex}-${productIndex}`] - (fiQty[`${batchIndex}-${productIndex}`] || 0))
                                                                                : (product.quantity - (fiQty[`${batchIndex}-${productIndex}`] || 0)),
                                                                            0
                                                                        )
                                                                        : Math.max(
                                                                            productQuantities[`${batchIndex}-${productIndex}`] !== undefined
                                                                                ? (productQuantities[`${batchIndex}-${productIndex}`] - (fiQty[`${batchIndex}-${productIndex}`] || 0))
                                                                                : (product.quantity - (fiQty[`${batchIndex}-${productIndex}`] || 0)),
                                                                            0
                                                                        )
                                                                }
                                                                onChange={(e) => handleQuantityChange(batchIndex, productIndex, parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className='mt-2'>
                                                            <Label htmlFor={'is_fi'}>
                                                                Select From Finish Inventory
                                                            </Label>
                                                            <Checkbox 
                                                                name={`is_fi-${batchIndex}-${productIndex}`}
                                                                id='is_fi'
                                                                checked={fromFinishInventory[`${batchIndex}-${productIndex}`] || false}
                                                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleCheckboxChange(e,batchIndex,productIndex)}
                                                            />
                                                        </div>
                                                        {fromFinishInventory[`${batchIndex}-${productIndex}`] 
                                                        &&
                                                        <div className='mt-2'>
                                                            <Label htmlFor={`productQuantity-${productIndex}`}>
                                                                FinishInv. Qty
                                                            </Label>
                                                            <Input
                                                                type='number'
                                                                id={`fiQty-${batchIndex}-${productIndex}`}
                                                                name={`fiQty-${batchIndex}-${productIndex}`}
                                                                min={0}
                                                                value={fiQty[`${batchIndex}-${productIndex}`]}
                                                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFiQtyChange(e,batchIndex,productIndex)}
                                                            />
                                                        </div>
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        {processReviewData && processReviewData.selfProducts && <h2 className='text-lg font-semibold mt-4'>Self Products</h2>}
                                        {processReviewData && processReviewData.selfProducts && processReviewData.selfProducts.map((selfProduct: any, selfProductIndex: number) => (
                                            <div key={selfProductIndex}>
                                                <div className='col-span-12 lg:col-span-12 flex items-center gap-2'>
                                                    <div className='mt-2'>
                                                        <Label htmlFor={`selfProductName-${selfProductIndex}`}>
                                                            Product
                                                        </Label>
                                                        <Input
                                                            type='text'
                                                            id={`selfProductName-${selfProductIndex}`}
                                                            name={`selfProductName-${selfProductIndex}`}
                                                            value={selfProduct.product.name}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className='mt-2'>
                                                        <Label htmlFor={`selfProductQuantityInBranch-${selfProductIndex}`}>
                                                            Quantity in Branch
                                                        </Label>
                                                        <Input
                                                            type='text'
                                                            id={`selfProductQuantityInBranch-${selfProductIndex}`}
                                                            name={`selfProductQuantityInBranch-${selfProductIndex}`}
                                                            value={productQuantityDetails.find((item: any) => item._id === selfProduct.product.id)?.quantity || 0}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className='mt-2'>
                                                        <Label htmlFor={`selfProductQuantity-${selfProductIndex}`}>
                                                            Quantity
                                                        </Label>
                                                        <Input
                                                            type='number'
                                                            id={`selfProductQuantity-${selfProductIndex}`}
                                                            name={`selfProductQuantity-${selfProductIndex}`}
                                                            value={selfProduct.quantity}
                                                            onChange={(e) => handleSelfProductQuantityChange(selfProductIndex, parseInt(e.target.value))}
                                                        />
                                                    </div>


                                                </div>
                                            </div>
                                        ))}
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <Button
                            variant='solid'
                            color='blue'
                            onClick={handleSaveEntries}
                        >
                            Save Data
                        </Button>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default ReviewQuantityStatus;
