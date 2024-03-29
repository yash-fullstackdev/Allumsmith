
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


const JobsBatch = ({ batch, jobId }: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jobDataById, setJobDataById] = useState<any>({});
    const [sorting, setSorting] = useState<SortingState>([]);
    console.log('Id', jobId);

    const getJobById = async () => {
        const { data } = await get(`/jobs/${jobId}`);
        setJobDataById(data);
    }

    useEffect(() => {
        getJobById();
    }, [])
    console.log('Job By Id', jobDataById.batch)
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


    const table = useReactTable({
        data: batch,
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





    return (
        <PageWrapper name='Jobs List'>
            <Container>
                <Card className='h-full'>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle>All Jobs</CardTitle>
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

            </Container>

        </PageWrapper>
    )

};

export default JobsBatch;

