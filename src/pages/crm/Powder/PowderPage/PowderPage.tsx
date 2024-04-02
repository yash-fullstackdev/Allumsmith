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
import AddPowderQuantity from '../AddPowderQuantity';


const PowderInventoryListPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [powderInventoryList, setPowderInventoryList] = useState<any>([]);
    const [productsArray, setProductsArray] = useState<any>([]);
    const [addPowderModal, setAddPowderModal] = useState<any>();
    const [powderQuantityModal, setPowderQuantityModal] = useState<any>();

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
    }, []);
    console.log('Powder INv Ls', powderInventoryList)
    const handleProductClick = (productId: any) => {
        const updatedProductsArray = powderInventoryList.map((item: any) => {
            if (item._id === productId) {
                return { ...item, expanded: !item.expanded };
            }
            return item;
        });
        setProductsArray(updatedProductsArray);
    };

    const renderBranches = (branches: any[]) => {
        return branches.map((branch: any, index: number) => (
            <TableRow key={index}>
                <TableCell><h6>{branch.branch}</h6></TableCell>
                <TableCell><h6>{branch.quantity}</h6></TableCell>
            </TableRow>
        ));
    };

    return (
        <PageWrapper name='Powder Inventory List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Powder Inventory</h1></CardTitle>
                        </CardHeaderChild>
                        <div className='flex justify-end'>
                            <Button variant='solid' icon='HeroPlus' onClick={() => setAddPowderModal(true)}>
                                Add Powder
                            </Button>
                            <Button variant='solid' icon='HeroPlus' onClick={() => setPowderQuantityModal(true)}>
                                Add Powder Quantity
                            </Button>
                        </div>
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
                                                {item.expanded && (
                                                    renderBranches(item.branches)
                                                )}
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
                <Modal isOpen={powderQuantityModal} setIsOpen={setPowderQuantityModal} isScrollable fullScreen='2xl'>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                    >
                        Add Powder Quantity
                    </ModalHeader>
                    <ModalBody>
                        <AddPowderQuantity />
                    </ModalBody>
                </Modal>
            </Container>

        </PageWrapper>
    );
};

export default PowderInventoryListPage;
