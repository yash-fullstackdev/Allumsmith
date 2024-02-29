import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
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
import Badge from '../../../../components/ui/Badge';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import _ from 'lodash';

const InventoryListPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryList, setInventoryList] = useState<any>([]);
    const [productsArray, setProductsArray] = useState<any>([]);

    useEffect(() => {
        fetchData();
    }, []);

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

                // Calculate total quantity for the product
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

    const renderBranches = (branches: any) => {
        return (
            <TableRow>
                <TableCell colSpan={3}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Branch Name</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {branches.map((branch: any) => (
                                    <TableRow key={branch.branchId}>
                                        <TableCell>{branch.branchName}</TableCell>
                                        <TableCell>{branch.quantity}</TableCell>
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
                            <CardTitle>All Inventory</CardTitle>
                        </CardHeaderChild>

                    </CardHeader>
                    <CardBody>
                        {!isLoading ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell>Total Quantity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productsArray.map((item: any) => (
                                            <React.Fragment key={item.productId}>
                                                <TableRow onClick={() => handleProductClick(item.productId)}>
                                                    <TableCell className='cursor-pointer'>{item.productName}</TableCell>
                                                    <TableCell>{item.totalQuantity}</TableCell>
                                                </TableRow>
                                                {item.expanded && renderBranches(item.branches)}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <LoaderDotsCommon />
                        )}
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default InventoryListPage;
