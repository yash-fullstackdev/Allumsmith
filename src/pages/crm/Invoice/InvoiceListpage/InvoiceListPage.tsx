import React, { useEffect, useState } from 'react';
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
import InvoiceCustomerDetail from './InvoiceCustomerDetail';

const InvoiceListPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jobsList, setJobsList] = useState<any>([]);
    const [isEditModal, setIsEditModal] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<any>()
    const [customerId, setCustomerId] = useState()

    const data = [{
        "_id": "660a85c965ccbec7eba02cc5",
        "customerEmail": "example@example.com",
        "customerPhone": "1234567890",
        "customerName": {
          "_id": "660a5e8705d54635a2e217ef",
          "name": "Test Dev"
        },
        "products": [
          {
            "product": {
              "_id": "66065aab3e2068bbb4535483",
              "name": "7\" test product",
              "rate": 90
            },
            "delieveryQuantity": 10,
            "rate": 5,
            "discount": 2,
            "weight": 5,
            "amount": 49,
            "coating":"Premium",
            "color":"green"
          },
          {
            "product": {
              "_id": "65e1cbd0e0f0e9d34ac9911f",
              "name": "3/4\" interlock",
              "rate": 240
            },
            "delieveryQuantity": 5,
            "rate": 5,
            "discount": 2,
            "weight": 6,
            "amount": 24.5,
            "coating":"Wooden",
            "color":"green"
          },
          {
            "product": {
              "_id": "65e1cbd0e0f0e9d34ac99121",
              "name": "3/4\" top bottom",
              "rate": 240
            },
            "delieveryQuantity": 15,
            "rate": 2,
            "discount": 3,
            "weight": 4,
            "amount": 29.1,
            "coating":"Premium",
            "color":"blue"
          }
        ],
        "alluminiumRate": 20,
        "sendMail": false,
        "coatingDiscount": 10,
        "customerDiscount": 5,
        "totalAmount": 2902.087,
        "gst": 9,
        "other_tax": 5,
        "origin_point": "Ahmedabad",
        "delievery_point": "Bhavnagar",
        "finished_weight": 140,
        "createdAt": "2024-04-01T10:00:41.559Z",
        "updatedAt": "2024-04-01T10:00:41.559Z",
        "__v": 0
      }]
 useEffect(()=>{
    setJobsList(data)
 },[])

 const handleClickDelete = async () => {
    try {
        toast.success('Invoice deleted Successfully');
    } catch (error: any) {
        console.error('Error deleted Invoice:', error);
        setIsLoading(false);
        toast.error('Error deleting Invoice', error);
    } finally {
        setIsLoading(false);
    }
}
 const columns = [

    columnHelper.accessor((row) => row.customerName.name, {
        cell: (info) => (
            <div className=''>
                {`${info.getValue() || "NA"} `}
            </div>
        ),
        header: 'Name',

    }),
    columnHelper.accessor((row) => row.customerPhone, {
        cell: (info) => (
            <div className=''>
                {`${info.getValue() || "NA"} `}
            </div>
        ),
        header: 'Phone',

    }),
    columnHelper.accessor((row) => row.customerEmail, {
        cell: (info) => (
            <div className=''>
                {`${info.getValue() || "NA"} `}
            </div>
        ),
        header: 'Email',

    }),
   
    columnHelper.display({
        cell: (info) => (
            <div className='font-bold'>
                <Button
                    onClick={() => {
                        setIsEditModal(true),
                        setCustomerId(info?.row?.original?._id)
                        setCustomerInfo(info?.row?.original)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                </Button>
                <Button
                    onClick={() => {
                        handleClickDelete();
                    }}>
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
        data: jobsList,
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
        <PageWrapper name='Invoice List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Invoice List</h1></CardTitle>
                        </CardHeaderChild>
                        <CardHeaderChild>
                            <Link to={`${PathRoutes.add_invoice}`}>
                                <Button variant='solid' icon='HeroPlus'>
                                    New Invoice
                                </Button>
                            </Link>
                        </CardHeaderChild>

                    </CardHeader>
                    <CardBody>
                            <TableTemplate
                                className='table-fixed max-md:min-w-[70rem]'
                                table={table}
                            />
                        {/* <div className='flex justify-center'>
                            {isLoading && <LoaderDotsCommon />}
                        </div> */}
                    </CardBody>
                    <TableCardFooterTemplate table={table} />

                </Card>
            </Container>
<Modal isOpen={isEditModal} setIsOpen={setIsEditModal} isScrollable fullScreen>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                    >
                        <div>
                            <h2 className="italic capitalize text-xl">
                                Vendor Name: {customerInfo?.customerName?.name}
                            </h2>
                            <h4 className="italic text-sm mt-2 text-gray-500">
                                Phone Number: {customerInfo?.customerPhone}
                            </h4>
                            <div>
                                <h4 className="italic text-sm text-gray-500">
                                    email: {customerInfo?.customerEmail}
                                </h4>
                            </div>
                            <h4 className="italic text-sm text-gray-500">
                                GST Number: {customerInfo?.gst}
                            </h4>
                        </div>





                    </ModalHeader>
                    <ModalBody>
                        <InvoiceCustomerDetail jobsList={jobsList} />
                    </ModalBody>
                </Modal>
        </PageWrapper>
    )
}

export default InvoiceListPage
