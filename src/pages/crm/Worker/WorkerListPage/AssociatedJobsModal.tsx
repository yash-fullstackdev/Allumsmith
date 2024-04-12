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
import { deleted, get } from '../../../../utils/api-helper.util';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import { toast } from 'react-toastify';
;



const columnHelper = createColumnHelper<any>();


const AssociatedJobsModal = ({ associatedJobs }: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);


    

    const columns = [

        columnHelper.accessor('name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Name',
        }),
        




    ];

    const table = useReactTable({
        data: associatedJobs,
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
        <PageWrapper>
            <Container>
                <Card className='h-full'>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle>Jobs</CardTitle>
                            <Badge
                                variant='outline'
                                className='border-transparent px-4 '
                                rounded='rounded-full'>
                                {table.getFilteredRowModel().rows.length} items
                            </Badge>
                        </CardHeaderChild>


                    </CardHeader>
                    <CardBody className='overflow-auto'>
                        {!isLoading && table.getFilteredRowModel().rows.length > 0 ? (
                            <TableTemplate
                                className='table-fixed max-md:min-w-[70rem]'
                                table={table}
                            />
                        ) : (
                            !isLoading && <p className="text-center text-gray-500">No records found</p>
                        )}
                        <div className='flex justify-center'>
                            {isLoading && <LoaderDotsCommon />}
                        </div>
                    </CardBody>
                    { table.getFilteredRowModel().rows.length > 0 &&
                        <TableCardFooterTemplate table={table} />
                    }
                </Card>

            </Container>


        </PageWrapper>
    )

};

export default AssociatedJobsModal;

