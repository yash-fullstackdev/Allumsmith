import React, { useEffect, useState } from 'react';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import _ from 'lodash';
import Button from '../../../../components/ui/Button';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import { finishInvList } from '../../../../mocks/db/finishInventoryList.db';
import { get } from '../../../../utils/api-helper.util';

const FinishInventoryListPage = () => {
    const [finishInventoryList, setFinishInventoryList] = useState<any[]>([]);
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
    const [addFinishModal, setAddFinishModal] = useState<any>();
    const [finishQuantityModal, setFinishQuantityModal] = useState<any>();

    const handleProductClick = (productName: string) => {
        setExpandedProduct(prevProduct => prevProduct === productName ? null : productName);
    };

    const getFinishInventory = async () => {
        const { data } = await get('/finish_inventory');
        setFinishInventoryList(data);
    }

    useEffect(() => {
        getFinishInventory();
    }, [])

    return (
        <PageWrapper name='Finish Inventory List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Finish Inventory</h1></CardTitle>
                        </CardHeaderChild>

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
                                    {Object.entries(_.groupBy(finishInventoryList, 'product.name')).map(([productName, items]) => (
                                        <React.Fragment key={productName}>
                                            <TableRow onClick={() => handleProductClick(productName)}>
                                                <TableCell><h4>{productName}</h4></TableCell>
                                                <TableCell><h4>{items.reduce((acc, item) => acc + item.quantity, 0)}</h4></TableCell>
                                            </TableRow>
                                            {expandedProduct === productName && (
                                                <TableRow>
                                                    <TableCell><h3>Branch</h3></TableCell>
                                                    <TableCell><h3>Coating</h3></TableCell>
                                                    <TableCell><h3>Color</h3></TableCell>
                                                    <TableCell><h3>Quantity</h3></TableCell>
                                                </TableRow>
                                            )}
                                            {expandedProduct === productName && items.map((item: any) => (
                                                <TableRow key={item._id}>
                                                    <TableCell><h4>{item.branch.name}</h4></TableCell>
                                                    <TableCell><h4>{item.coating.name}</h4></TableCell>
                                                    <TableCell><h4>{item.color.name}</h4></TableCell>
                                                    <TableCell><h4>{item.quantity}</h4></TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardBody>
                </Card>

            </Container>
        </PageWrapper>
    );
};

export default FinishInventoryListPage;
