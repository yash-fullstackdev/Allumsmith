// import React from 'react'

// const AllLedger = () => {
//   return (
//     <div>
//       All Ledger 
//     </div>
//   )
// }

// export default AllLedger

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
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import Collapse from '../../../../components/utils/Collapse';
// import InvoiceCustomerDetail from './InvoiceCustomerDetail';

const AllLedger = ({handleGeneratePdf,  associatedLedger, formik, fetchLedgerDetails, id, accordionStates, setAccordionStates, handleLedgerData }: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jobsList, setJobsList] = useState<any>([]);
    const [isEditModal, setIsEditModal] = useState(false);
    const [productInfo, setProductInfo] = useState<any>()
    const [customerId, setCustomerId] = useState();


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
        columnHelper.accessor('createdAt', {
            cell: (info) => (
                <div className=''>
                    {new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }).format(new Date(info.getValue())) || 'NA'}
                </div>
            ),
            header: 'Created Date',
        }),


        columnHelper.accessor('amount_payable', {
            cell: (info) => (

                <div className=''>
                    {/* {`${info.getValue() || 'NA'} `} */}
                    {info.row.original.type === 'credit' ? `${info.getValue()} - (Paid Amount)` : `${info.getValue()} - (Invoice Amount)`}
                </div>

            ),
            header: 'Amount',
        }),
        columnHelper.accessor('type', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 'NA'} `}
                </div>

            ),
            header: 'Type',
        }),
        columnHelper.accessor('payment_mode', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 'NA'} `}
                </div>

            ),
            header: 'Payment Mode',
        }),


    ];
    console.log('Associated Invoices', associatedLedger);
    const table = useReactTable({
        data: associatedLedger || [],
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
            <div className='flex h-full flex-wrap content-start'>
                <div className='m-5 mt-0 mb-1 grid w-full grid-cols-6 gap-1'>
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
                                                    ledgerDetails: !accordionStates.ledgerDetails,
                                                })
                                            }
                                            rightIcon={
                                                !accordionStates.ledgerDetails
                                                    ? 'HeroChevronUp'
                                                    : 'HeroChevronDown'
                                            }
                                        >
                                            Ledger List
                                        </Button>
                                    </div>
                                </div>

                                <Collapse isOpen={!accordionStates.ledgerDetails} >
                                    <div className='mb-2 mt-4 grid grid-cols-12 gap-1'>

                                        <div className='col-span-12 lg:col-span-2 '>
                                            <Label htmlFor='startDate'>
                                                Start Date
                                            </Label>
                                            <Input
                                                type='date'
                                                id={`startDate`}
                                                name={`startDate`}
                                                value={formik.values.startDate}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        <div className='col-span-12 lg:col-span-2'>
                                            <Label htmlFor='endDate'>
                                                End Date
                                            </Label>
                                            <Input
                                                type='date'
                                                id={`endDate`}
                                                name={`endDate`}
                                                value={formik.values.endDate}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        <div className='col-span-12 lg:col-span-2'>
                                            <Label htmlFor='typr'>
                                                Type
                                            </Label>
                                            <Select
                                                id='type'
                                                name='type'
                                                placeholder='Select Type'
                                                value={formik.values.type}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >

                                                <option value='credit'>Credit</option>
                                                <option value='debit'>Debit</option>
                                            </Select>
                                        </div>
                                        <div className='col-span-12 lg:col-span-1  mt-4 ml-2'>
                                            <Button className='mt-2' variant='solid' color='blue' type='submit' onClick={() => fetchLedgerDetails(id)} >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                                </svg>

                                            </Button>
                                        </div>
                                        <div className='col-span-12 lg:col-span-1 mt-4 w-[200px]  '>
                                            <Button className='mt-2' variant='solid' color='blue' type='submit' onClick={() =>{
                                                
                                                formik.setFieldValue('startDate','');
                                                formik.setFieldValue('endDate','');
                                                formik.setFieldValue('type','');
                                                handleLedgerData();
                                            }}>
                                                Reset Filter

                                            </Button>
                                        </div>
                                        <div className='col-span-12 lg:col-span-1 mt-4 w-[200px] justify-items-end ml-5'>
                                            <Button className='mt-2' variant='solid' color='blue' type='submit' onClick={handleGeneratePdf}>

                                                Generate PDF

                                            </Button>
                                        </div>


                                    </div>
                                    {!isLoading && table.getFilteredRowModel().rows.length > 0 ? (
                                        <div>

                                            <TableTemplate
                                                className='table-fixed max-md:min-w-[70rem]'
                                                table={table}
                                            />
                                        </div>
                                    ) : (
                                        !isLoading && <p className="text-center text-gray-500">No records found</p>
                                    )}

                                    {table.getFilteredRowModel().rows.length > 0 &&
                                        <TableCardFooterTemplate  table={table} />
                                    }
                                </Collapse>
                                

                            </CardBody>

                        </Card>
                    </div>
                </div>
            </div>

        </Container >


    )
}

export default AllLedger
