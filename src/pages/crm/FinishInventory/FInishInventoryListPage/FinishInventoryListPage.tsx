
import React, { useEffect, useState } from 'react';
import { get } from '../../../../utils/api-helper.util';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
    CardHeader,
    CardHeaderChild,
    CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import _ from 'lodash';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';

const FinishInventoryListPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryList, setInventoryList] = useState<any>([]);
    const [productsArray, setProductsArray] = useState<any>([]);
    const [stockActionModal, setStockActionModal] = useState<any>()
    const [isExpanded, setIsExpanded] = useState<{ activeIndex: number | null, state: boolean }>({
        activeIndex: null,
        state: false
    });
    const [isExpandedCoating, setIsExpandedCoating] = useState(false);

    const data = [
        {
            _id: "84sd512asdy89456",
            name: "handle",
            total_quantity: "40",
            coating: [{
                name: "preminum",
                variants: [{ color: "red", quantity: 30 }, { color: "green", quantity: 20 }]
            },
            {
                name: "wooden",
                variants: [{ color: "red", quantity: 20 }, { color: "green", quantity: 50 }]

            }
            ]
        },
        {
            _id: "84sd512asdy8547",
            name: "lock",
            total_quantity: "40",
            coating: [{
                name: "coating",
                variants: [{ color: "orange", quantity: 30 }, { color: "green", quantity: 20 }]
            },
            {
                name: "wooden",
                variants: [{ color: "red", quantity: 20 }, { color: "green", quantity: 50 }]

            }
            ]
        }
    ]

    useEffect(() => {
        if (inventoryList.length > 0) {
            const groupedData = _.groupBy(inventoryList, (item: any) => item?._id);
            const resultArray = Object.keys(groupedData).map((productId) => {
                const productData = groupedData[productId];
                const coating = productData.map((item) => {
                    if (!item._id) return null;
                    return {
                        product_id: item._id,
                        productName: item.name,
                        total_quantity: item.total_quantity,
                        coating: item.coating,
                    }
                })
                return coating;
            })
            setProductsArray(resultArray);

        }
    }, [])

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // const { data: data } = await get(`/inventory`);
            setInventoryList(data);
        } catch (error: any) {
            console.error('Error fetching inventory:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = (index: any) => {
        setIsExpanded((prevState: any) => ({
            ...prevState,
            activeIndex: index,
            state: !prevState.state
        }));
    };

    const handleCoatingClick = () => {
        setIsExpandedCoating(!isExpandedCoating);
    };

    useEffect(() => {
        fetchData();
    }, [stockActionModal]);

    const renderCoating = (coatingDeatil: any) => {
        return (
            <TableRow>
                <TableCell colSpan={3}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><h5>Color</h5></TableCell>
                                    <TableCell><h5>Quantity</h5></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coatingDeatil.map((coatingVarinats: any, index: number) => (
                                    <>
                                        <TableRow key={index}>
                                            <TableCell ><h6>{coatingVarinats.color}</h6></TableCell>
                                            <TableCell ><h6>{coatingVarinats.quantity}</h6></TableCell>
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TableCell>
            </TableRow>
        );
    };
    console.log(isExpanded, "isExpnaded")
    const renderProduct = (coating: any) => {
        return (
            <TableRow>
                <TableCell colSpan={3}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><h5>Coating Name</h5></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coating.map((coatingName: any, index: number) => (
                                    <React.Fragment>
                                        <TableRow key={index} className='cursor-pointer' onClick={handleCoatingClick}>
                                            <TableCell ><h6>{coatingName.name}</h6></TableCell>
                                            <Button rightIcon={isExpandedCoating ? 'HeroChevronUp' : 'HeroChevronDown'} />
                                        </TableRow>
                                        {isExpandedCoating && renderCoating(coatingName.variants)}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <PageWrapper name='Inventory List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Finished Inventory</h1></CardTitle>
                        </CardHeaderChild>
                        <Button variant='solid' icon='HeroPlus' onClick={() => setStockActionModal(true)}>
                            Stock Action
                        </Button>

                    </CardHeader>
                    <CardBody>
                        {!isLoading ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><h3> Product Name</h3></TableCell>
                                            <TableCell><h3>Total Quantity</h3></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productsArray.map((item: any, index: any) => (
                                            <React.Fragment key={index}>
                                                {Array.isArray(item) && item.map((subItem: any,) => (
                                                    <React.Fragment key={subItem.product_id}>
                                                        <TableRow onClick={() => handleProductClick(index)}>
                                                            <TableCell className='cursor-pointer' >
                                                                <h4>{subItem.productName}</h4>
                                                                <Button rightIcon={isExpanded.state ? 'HeroChevronUp' : 'HeroChevronDown'} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <h4>{subItem.total_quantity}</h4>
                                                            </TableCell>
                                                        </TableRow>
                                                        {isExpanded.state && renderProduct(subItem.coating)}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <div className='flex justify-center'>
                                <LoaderDotsCommon />
                            </div>
                        )}
                    </CardBody>
                </Card>
                <Modal isOpen={stockActionModal} setIsOpen={setStockActionModal} isScrollable fullScreen='2xl'>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                    >
                        Stock Action
                    </ModalHeader>
                    <ModalBody>
                        Hello
                    </ModalBody>
                </Modal>
            </Container>

        </PageWrapper>
    );
};

export default FinishInventoryListPage;
