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
import AdddPowderModal from '../AddPowderModal/AddPowderModal';


const PowderInventoryListPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [powderInventoryList, setPowderInventoryList] = useState<any>([]);
    const [productsArray, setProductsArray] = useState<any>([]);
    const [addPowderModal, setAddPowderModal] = useState<any>()

    // useEffect(() => {
    //     if (powderInventoryList.length > 0) {
    //         const groupedData = _.groupBy(powderInventoryList, (item: any) => item?._id);
    //         const resultArray = Object.keys(groupedData).map((productId) => {
    //             const productData = groupedData[productId];
    //             if (!productData[0]?.name) return null;

    //             const branches = productData.map((item) => {
    //                 if (!item.branch || !item.branch._id || !item.branch.name) return null;
    //                 return {
    //                     branchId: item.branch._id,
    //                     branchName: item.branch.name,
    //                     quantity: item.quantity,
    //                 };
    //             }).filter(Boolean);
    //             const totalQuantity = branches.reduce((total: number, branch: any) => total + branch.quantity, 0);
    //             return {
    //                 productId,
    //                 productName: productData[0].product.name,
    //                 totalQuantity,
    //                 branches,
    //             };
    //         }).filter(Boolean);

    //         setProductsArray(resultArray);
    //     }
    // }, [powderInventoryList]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data: powderInventoryList } = await get(`/utilities`);
                setPowderInventoryList(powderInventoryList);
            } catch (error: any) {
                console.error('Error fetching Powder inventory:', error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }
        , []);

    const handleProductClick = (productId: any) => {
        const updatedProductsArray = powderInventoryList.map((item: any) => {
            if (item._id === productId) {
                return { ...item, expanded: !item.expanded };
            }
            return item;
        });
        setProductsArray(updatedProductsArray);
    };



    // useEffect(() => {
    //     fetchData();
    // }, [stockActionModal]);

    const renderBranches = (powderInventoryList: any) => {
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
                                {powderInventoryList && powderInventoryList.map((branch: any) => (
                                    <TableRow>
                                        <TableCell><h6>{branch.branch}</h6></TableCell>
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
        <PageWrapper name='Powder Inventory List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Powder Inventory</h1></CardTitle>
                        </CardHeaderChild>
                        <Button variant='solid' icon='HeroPlus' onClick={() => setAddPowderModal(true)}>
                            Add Powder
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
                                        {powderInventoryList && powderInventoryList.map((item: any) => (
                                            <React.Fragment key={item._id}>
                                                <TableRow onClick={() => handleProductClick(item._id)}>
                                                    <TableCell className='cursor-pointer'><h4> {item.name} <Button rightIcon={
                                                        item.expanded ?
                                                            'HeroChevronUp'
                                                            : 'HeroChevronDown'
                                                    } /></h4></TableCell>
                                                    <TableCell><h4>{item.quantity}</h4></TableCell>
                                                </TableRow>
                                                {item.expanded && renderBranches(item)}
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
                <Modal isOpen={addPowderModal} setIsOpen={setAddPowderModal} isScrollable fullScreen='2xl'>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                    >
                        Add Powder
                    </ModalHeader>
                    <ModalBody>
                        <AdddPowderModal SetAddPowderModal={() => setAddPowderModal(false)} />
                    </ModalBody>
                </Modal>
            </Container>

        </PageWrapper>
    );
};

export default PowderInventoryListPage;