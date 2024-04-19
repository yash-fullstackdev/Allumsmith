import React, { useEffect, useState } from 'react';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { inventoryList } from '../../../../mocks/db/inventoryList.db';
import Button from '../../../../components/ui/Button';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import AddPowderQuantity from '../AddPowderQuantity';
import AddPowderModal from '../AddPowderModal/AddPowderModal';
import { get } from '../../../../utils/api-helper.util';
import _ from 'lodash';

const PowderInventoryListPage = () => {
    const [powderInventoryList, setPowderInventoryList] = useState<any[]>([]);
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
    const [addPowderModal, setAddPowderModal] = useState<any>();
    const [powderQuantityModal, setPowderQuantityModal] = useState<any>();
    const handleProductClick = (productName: string) => {
        setExpandedProduct(prevProduct => prevProduct === productName ? null : productName);
    };

    const getPowderList = async () => {
        const { data } = await get('/utility_inventory')
        setPowderInventoryList(data);
    }
    useEffect(() => {
        getPowderList();
    }, [])

    const renderBranches = (items: any) => {
        console.log('Branches', items)
        return (
            <TableRow>
                <TableCell colSpan={3}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><h3>Branch</h3></TableCell>
                                    <TableCell><h3>Quantity</h3></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items && items.map((branch: any) => (
                                    <TableRow key={branch._id}>
                                    <TableCell><h4>{branch?.branch?.name || "NA"}</h4></TableCell>
                                    <TableCell><h4>{branch?.quantity || "NA"}</h4></TableCell>
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
                            <CardTitle><h1>Raw Material Inventory</h1></CardTitle>
                        </CardHeaderChild>
                        <div className='flex justify-end gap-5'>
                            <Button variant='solid' icon='HeroPlus' onClick={() => setAddPowderModal(true)}>
                                Add Raw Material
                            </Button>
                            <Button variant='solid' icon='HeroPlus' onClick={() => setPowderQuantityModal(true)}>
                                Add Raw Material Quantity
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><h3>Product Name</h3></TableCell>
                                        <TableCell><h3>Total Quantity</h3></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(_.groupBy(powderInventoryList, 'utility.name')).map(([productName, items]) => (
                                        <React.Fragment key={productName}>
                                            <TableRow onClick={() => handleProductClick(productName)}>
                                                {/* <TableCell><h4>{productName}</h4></TableCell> */}
                                                <TableCell className='cursor-pointer'><h4> {productName} <Button rightIcon={
                                                    expandedProduct ?
                                                        'HeroChevronUp'
                                                        : 'HeroChevronDown'
                                                } /></h4></TableCell>
                                                <TableCell><h4>{items.reduce((acc, item) => acc + item.quantity, 0)}</h4></TableCell>
                                            </TableRow>
                                            {expandedProduct && renderBranches(items)}
                                            {/* {expandedProduct === productName && (
                                                <TableRow>
                                                    <TableCell><h3>Branch</h3></TableCell>
                                                    <TableCell><h3>Quantity</h3></TableCell>
                                                </TableRow>
                                            )}
                                            {expandedProduct === productName && items.map((item: any) => (
                                                <TableRow key={item._id}>
                                                    <TableCell><h4>{item.branch.name}</h4></TableCell>
                                                    <TableCell><h4>{item.quantity}</h4></TableCell>
                                                </TableRow>
                                            ))} */}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardBody>
                </Card>
                <Modal isOpen={addPowderModal} setIsOpen={setAddPowderModal} isScrollable fullScreen='2xl'>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold gap-5'
                    >
                        Add Powder
                    </ModalHeader>
                    <ModalBody>
                        <AddPowderModal SetAddPowderModal={() => setAddPowderModal(false)} getPowderList = {getPowderList}/>
                    </ModalBody>
                </Modal>
                <Modal isOpen={powderQuantityModal} setIsOpen={setPowderQuantityModal} isScrollable fullScreen='2xl'>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                    >
                        Add Powder Quantity
                    </ModalHeader>
                    <ModalBody>
                        <AddPowderQuantity setPowderQuantityModal={setPowderQuantityModal} getPowderList = {getPowderList} />
                    </ModalBody>
                </Modal>
            </Container>
        </PageWrapper>
    );
};

export default PowderInventoryListPage;
