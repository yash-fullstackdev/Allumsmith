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
import Collapse from '../../../../components/utils/Collapse';
// import InvoiceCustomerDetail from './InvoiceCustomerDetail';

const AllInvoice = ({ associatedInvoices, accordionStates, setAccordionStates }: any) => {
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

    const columns: any = [

        columnHelper.accessor('Invoice Name', {
            cell: (cellContext) => (
                <div className=''>
                    {`Invoice ${cellContext.row.index + 1}`}
                </div>
            ),
            header: 'Invoice Name',
        }),
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
        <PageWrapper >
            <Container>
                <div className='flex h-full flex-wrap content-start'>
                    <div className='m-5 mt-0 grid w-full grid-cols-6 gap-1'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                                <Card>
                                <CardBody>
                                    <div className='flex'>
                                        <div className='bold w-full'>
                                            <Button
                                                variant='outlined'
                                                className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                                onClick={() =>
                                                    setAccordionStates({
                                                        ...accordionStates,
                                                        invoiceDetails: !accordionStates.invoiceDetails,
                                                    })
                                                }
                                                rightIcon={
                                                    !accordionStates.invoiceDetails
                                                        ? 'HeroChevronUp'
                                                        : 'HeroChevronDown'
                                                }
                                            >
                                                Invoice Details
                                            </Button>
                                        </div>
                                    </div>
                                                
                                    <Collapse isOpen={!accordionStates.invoiceDetails}>        
                                                
                                        {!isLoading && table.getFilteredRowModel().rows.length > 0 ? (
                                            <TableTemplate

                                                className='table-fixed max-md:min-w-[70rem] mt-3'
                                                table={table}
                                            />
                                        ) : (
                                            !isLoading && <p className="text-center text-gray-500">No records found</p>
                                        )}
                                        {/* <div className='flex justify-center'>
                            {isLoading && <LoaderDotsCommon />}
                        </div> */}
                                    
                                    {table.getFilteredRowModel().rows.length > 0 &&
                                        <TableCardFooterTemplate table={table} />
                                    }
                                    </Collapse> 
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>

    )
}

export default AllInvoice
