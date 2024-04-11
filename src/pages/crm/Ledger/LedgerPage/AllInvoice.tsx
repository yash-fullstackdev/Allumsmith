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
// import InvoiceCustomerDetail from './InvoiceCustomerDetail';

const AllInvoice = ({associatedInvoices}:any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jobsList, setJobsList] = useState<any>([]);
    const [isEditModal, setIsEditModal] = useState(false);
    const [productInfo, setProductInfo] = useState<any>()
    const [customerId, setCustomerId] = useState()

    console.log('JobList', jobsList)
    const getInvoiceList = async () => {
        try {
            const { data } = await get('/invoice')
            setJobsList(data);
        } catch (error) {

        }
    }

    useEffect(() => {
        getInvoiceList();
    }, [])
   
    const columns = [

        columnHelper.accessor('totalAmount', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 'NA'} `}
                </div>

            ),
            header: 'Total Amount',
        }),
        

    ];
    console.log('Associated Invoices', associatedInvoices);
    const table = useReactTable({
        data: associatedInvoices,
        columns,
        // state: {
        //     sorting,
        //     globalFilter,
        // },
        // onSortingChange: setSorting,
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (
        
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Invoice List</h1></CardTitle>
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
                        {/* <div className='flex justify-center'>
                            {isLoading && <LoaderDotsCommon />}
                        </div> */}
                    </CardBody>
                    {table.getFilteredRowModel().rows.length > 0 &&
                        <TableCardFooterTemplate table={table} />
                    }
                </Card>
            </Container>
            
        
    )
}

export default AllInvoice
