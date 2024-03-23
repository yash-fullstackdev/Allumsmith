
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
        setIsLoading(true);
        try {
            const { data: inventoryList } = await get(`/inventory`);
            setInventoryList(inventoryList);
        } catch (error: any) {
            console.error('Error fetching inventory:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = (productId: any) => {
        // Toggle expanded state for the product
        const updatedProductsArray = productsArray.map((item: any) => {
            if (item.productId === productId) {
                return { ...item, expanded: !item.expanded };
            }
            return item;
        });
        setProductsArray(updatedProductsArray);
    };



    useEffect(() => {
        fetchData();
    }, [stockActionModal]);

    const renderBranches = (branches: any) => {
        return (
            <TableRow>
                <TableCell colSpan={3}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><h5>Branch Name</h5></TableCell>
                                    <TableCell><h5>Quantity</h5></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {branches && branches.map((branch: any) => (
                                    <TableRow key={branch.branchId}>
                                        <TableCell><h6>{branch.branchName}</h6></TableCell>
                                        <TableCell><h6>{branch.quantity}</h6></TableCell>
                                    </TableRow>
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
                                        {productsArray.map((item: any) => (
                                            <React.Fragment key={item.productId}>
                                                <TableRow onClick={() => handleProductClick(item.productId)}>
                                                    <TableCell className='cursor-pointer'><h4> {item.productName} <Button rightIcon={
                                                        item.expanded ?
                                                            'HeroChevronUp'
                                                            : 'HeroChevronDown'
                                                    } /></h4></TableCell>
                                                    <TableCell><h4>{item.totalQuantity}</h4></TableCell>
                                                </TableRow>
                                                {item.expanded && renderBranches(item.branches)}
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
