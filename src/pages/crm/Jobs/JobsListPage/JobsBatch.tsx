import React, { useEffect, useState } from 'react';
import { get } from '../../../../utils/api-helper.util';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const JobsBatch = ({ jobId }: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jobDataByIdBatch, setJobDataByIdBatch] = useState<any>([]);
    const [customerData, setCustomerData] = useState<any>([]);
    const [selfProducts, setSelfProducts] = useState<any>([]);
    const getJobById = async () => {
        const { data } = await get(`/jobs/${jobId}`);
        setJobDataByIdBatch(data.batch);
        setSelfProducts(data.selfProducts)
    };
    console.log('Job Data By Id', jobDataByIdBatch);
    const getCustomerDetails = async () => {
        const { data } = await get('/customers');
        setCustomerData(data);
    };

    useEffect(() => {
        getCustomerDetails();
        getJobById();
    }, []);

    // Function to find customer name by ID
    const findCustomerName = (customerId: string) => {
        const customer = customerData.find((c: any) => c._id === customerId);
        console.log('Customer', customer);
        return customer ? customer.name : 'Unknown';
    };

    return (
        <PageWrapper name='Jobs List'>
            <Container>
                {jobDataByIdBatch.map((batch: any) => (
                    <TableContainer key={batch.coEntry?.customer} sx={{ marginBottom: '20px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={4}><h2>Customer Name: {findCustomerName(batch.coEntry?.customer?._id)}</h2></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Coating</TableCell>
                                    <TableCell>Color</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {batch.products.map((product: any) => (
                                    <TableRow key={product._id}>
                                        <TableCell>{product.product.name}</TableCell>
                                        <TableCell>{product.coating.name}</TableCell>
                                        <TableCell>{product.color.name}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ))}
                <h1>Self Products</h1>
                <TableContainer sx={{ marginBottom: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Coating</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selfProducts && selfProducts.map((selfProduct: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{selfProduct.product.name}</TableCell>
                                    <TableCell>{selfProduct.coating.name}</TableCell>
                                    <TableCell>{selfProduct.color.name}</TableCell>
                                    <TableCell>{selfProduct.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </PageWrapper>
    );
};

export default JobsBatch;
