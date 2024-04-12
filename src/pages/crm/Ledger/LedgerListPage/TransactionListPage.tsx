

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



const TransactionListPage = ({customerId}:any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const [transactionDetail, setTransactionDetails] = useState<any>([]);
    const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data } = await get(`/customers/${customerId}`);
			setTransactionDetails(data.associatedLedgers)
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

    console.log('Transaction Details', transactionDetail)


   
    const columns = [

        columnHelper.accessor('amount_payable', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 'NA'} `}
                </div>

            ),
            header: 'Last Paid Amount',
        }),
        columnHelper.accessor('grandTotal', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 0} `}
                </div>

            ),
            header: 'Grand Total',
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

        


    ];
    const table = useReactTable({
        data: transactionDetail || [],
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
                            <CardTitle><h1>TransactionListPage</h1></CardTitle>
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

        </PageWrapper>
    )
}

export default TransactionListPage
