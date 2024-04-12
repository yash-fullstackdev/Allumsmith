import React, { useEffect, useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
    CardHeader,
    CardHeaderChild,
    CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import _ from 'lodash';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { deleted } from '../../../../utils/api-helper.util';
const columnHelper = createColumnHelper<any>();
import { toast } from 'react-toastify';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import EditBranchModal from '../../Branches/BranchesPage/EditBranchModal';
import TransactionListPage from './TransactionListPage';


const LedgerListPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const [transactionListModal, setTransactionModal] = useState<boolean>(false);
    const [customerId, setCustomerId] = useState<any>('')
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data } = await get(`/ledger`);

            setData(data);
            setIsLoading(false);
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [])

    console.log('Data', data);
    const handleClickDelete = async (id: any) => {
        console.log("id", id)
        try {
            const { data: products } = await deleted(`/ledger/${id}`);
            toast.success('Product deleted Successfully !');
        } catch (error: any) {
            console.error('Error deleting product:', error.message);
            toast.error('Error deleting Product', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            fetchData();
        }
    }



    const columns = [

        columnHelper.accessor('customer.name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 'NA'} `}
                </div>

            ),
            header: 'Customer Name',
        }),
        columnHelper.accessor('customer.credit_amount', {
            cell: (info) => (

                <div className=''>
                    {`${(info.getValue() || 0).toFixed(2)} `}
                </div>

            ),
            header: 'Credit Amount',
        }),

        columnHelper.accessor('customer.pending_amount', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 0} `}
                </div>

            ),
            header: 'Pending Amount',
        }),

        columnHelper.accessor('payment_mode', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 'NA'} `}
                </div>

            ),
            header: 'Payment Mode',
        }),
        columnHelper.accessor('remarks', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 'NA'} `}
                </div>

            ),
            header: 'Remarks',
        }),

        columnHelper.display({
            cell: (info) => (
                <div className='font-bold'>
                    <Button
                        onClick={() => {
                            setCustomerId(info.row.original.customer._id)
                            console.log(info.row.original.customer._id)
                            setTransactionModal(true)
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                    </Button>
                    <Button
                        onClick={() => handleClickDelete(info.row.original._id)}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='h-6 w-6'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                            />
                        </svg>
                    </Button>

                </div>
            ),
            header: 'Actions',
            size: 80,
        }),


    ];
    const table = useReactTable({
        data: data,
        columns,
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (
        <PageWrapper name='Ledger List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Ledger List</h1></CardTitle>
                        </CardHeaderChild>
                        <CardHeaderChild>
                            <Link to={`${PathRoutes.add_ledger}`}>
                                <Button variant='solid' icon='HeroPlus'>
                                    New Ledger
                                </Button>
                            </Link>
                        </CardHeaderChild>

                    </CardHeader>
                    <CardBody>
                        {!isLoading && table.getFilteredRowModel().rows.length > 0 ? (
                            <TableTemplate
                                className='table-fixed max-md:min-w-[70rem]'
                                table={table}
                            />
                        ) : (
                            !isLoading && <p className="text-center text-gray-500">No records found</p>
                        )}
                    </CardBody>
                    {table.getFilteredRowModel().rows.length > 0 &&
                        <TableCardFooterTemplate table={table} />
                    }
                </Card>
            </Container>
            <Modal isOpen={transactionListModal} setIsOpen={setTransactionModal} isScrollable fullScreen>
                <ModalHeader
                    className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                // onClick={() => formik.resetForm()}
                >
                    Edit Branch
                </ModalHeader>
                <ModalBody>
                    <TransactionListPage customerId={customerId} />
                </ModalBody>
            </Modal>
        </PageWrapper>
    )
}

export default LedgerListPage
