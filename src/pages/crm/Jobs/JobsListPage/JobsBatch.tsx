
import React from 'react'
import { useEffect, useState } from 'react';
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
    CardHeader,
    CardHeaderChild,
    CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import TableTemplate, {
    TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { PathRoutes } from '../../../../utils/routes/enum';
import { get } from '../../../../utils/api-helper.util';




const columnHelper = createColumnHelper<any>();


const JobsBatch = ({ jobId }: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jobDataById, setJobDataById] = useState<any>({});
    const [jobDataByIdBatch, setJobDataByIdBatch] = useState<any>([])
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selfProductsById, setSelfProductsById] = useState<any>([]);
    const [customerData, setCustomerData] = useState<any>({});
    console.log('Id', jobId);

    const getJobById = async () => {
        const { data } = await get(`/jobs/${jobId}`);
        console.log('Data', data);
        setJobDataById(data);
        setJobDataByIdBatch(data.batch)
        setSelfProductsById(data.selfProducts);
    }


    useEffect(() => {
        getJobById();
    }, [])
    console.log('Job By Id', jobDataByIdBatch)
    const columns = [

        columnHelper.accessor('coEntry.customer', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Customer Name',
        }),

    ];

    const selfProductsColumns = [

        columnHelper.accessor('product.name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Product Name',
        }),
        columnHelper.accessor('coating.name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Coating Name',
        }),
        columnHelper.accessor('color.name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Color Name',
        }),
        columnHelper.accessor('quantity', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Quantity',
        }),

    ];

    const table = useReactTable({
        data: jobDataByIdBatch,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const selfProducts = useReactTable({
        data: selfProductsById,
        columns: selfProductsColumns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });



    return (
        <PageWrapper name='Jobs List'>
            <Container>
                <Card className='h-full'>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle>All Batches</CardTitle>
                            <Badge
                                variant='outline'
                                className='border-transparent px-4 '
                                rounded='rounded-full'>
                                {table?.getFilteredRowModel()?.rows?.length} items
                            </Badge>
                        </CardHeaderChild>



                    </CardHeader>
                    <CardBody className='overflow-auto'>
                        {!isLoading && (
                            <TableTemplate
                                className='table-fixed max-md:min-w-[70rem]'
                                table={table}
                            />
                        )}
                        <div className='flex justify-center'>
                            {isLoading && <LoaderDotsCommon />}
                        </div>
                    </CardBody>
                    <TableCardFooterTemplate table={table} />
                </Card>
                <Card className='h-full'>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle>All Self Products</CardTitle>
                            <Badge
                                variant='outline'
                                className='border-transparent px-4 '
                                rounded='rounded-full'>
                                {selfProducts?.getFilteredRowModel()?.rows?.length} items
                            </Badge>
                        </CardHeaderChild>



                    </CardHeader>
                    <CardBody className='overflow-auto'>
                        {!isLoading && selfProducts.getFilteredRowModel().rows.length > 0 ? (
                            <TableTemplate
                                className='table-fixed max-md:min-w-[70rem]'
                                table={selfProducts}
                            />
                        ) : (
                            <p className="text-center text-gray-500">No records found</p>
                        )}
                        <div className='flex justify-center'>
                            {isLoading && <LoaderDotsCommon />}
                        </div>
                    </CardBody>
                    <TableCardFooterTemplate table={selfProducts} />
                </Card>
            </Container>

        </PageWrapper>
    )

};

export default JobsBatch;

