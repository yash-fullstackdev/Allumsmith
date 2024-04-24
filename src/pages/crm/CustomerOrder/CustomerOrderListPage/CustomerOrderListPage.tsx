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
import CustomerEntryDetail from './CustomerOrderDetail';
import { post } from '../../../../utils/api-helper.util';

const columnHelper = createColumnHelper<any>();


const CustomerOrderListPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [customerOrderList, setCustomerOrderList] = useState<any[]>([]);
    const [vedorProductModal, setVendorProductModal] = useState<boolean>(false)
    const [customerId, setCustomerId] = useState()
    const [branchesData, setBranchesData] = useState<any>()
    const [vendorInfo, setVendorInfo] = useState<any>()

    console.log("customerId", customerId)
    console.log("vendorInfo", vendorInfo)



    const fetchCoData = async () => {
        setIsLoading(true);
        try {
            const { data: CustomerOrderList } = await get(`/customer-order`);
            CustomerOrderList.sort((a:any,b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            setCustomerOrderList(CustomerOrderList);
            setIsLoading(false);
        } catch (error: any) {
            console.error('Error fetching customer data:', error.message);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGeneratePDF = async (id: any) => {
        try {
            console.log(`PDF GENERATED Sucessfully for ${id}`)
            const response = await post(`/customer-order/generateReciept/${id}`, {});
            console.log(response.data.data);
            if (response && response.status === 201 && response.data && response.data.data) {
                const pdfData = response.data.data;
                console.log('PDF DATA', pdfData);

                const url = window.URL.createObjectURL(new Blob([new Uint8Array(pdfData).buffer], { type: 'application/pdf' }));

                window.open(url, '_blank');
            } else {
                console.error('Error: PDF data not found in response');
            }
        } catch (error) {
            console.error('Error Generating PDF', error)
        }

    }

    useEffect(() => {
        fetchCoData();
    }, [])

    const handleClickDelete = async (id: any) => {
        console.log('Id', id);
        try {
            const { data: allUsers } = await deleted(`/customer-order/${id}`);
            console.log("allUsers", allUsers);
            toast.success('customer Order  deleted Successfully!')
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
            setIsLoading(false);
            toast.error('Error deleting customer Order', error);
        } finally {
            setIsLoading(false);
            fetchCoData();
        }
    }
    const columns = [
        columnHelper.accessor('customer.name', {
            cell: (info) => (

             

                <div className=''>
                    {`${info?.row?.original?.customer?.name} (${info?.row?.original?.customerOrderNumber})`}
                </div>

            ),
            header: 'Name',
        }),

        columnHelper.accessor('phone', {
            cell: (info) => (

                <div className=''>
                    {`${info?.row?.original?.customer?.phone}`}</div>
            ),
            header: 'Phone',
        }),
        columnHelper.accessor('email', {
            cell: (info) => (


                <div className=''>{`${info?.row?.original?.customer?.email}`}</div>
            ),
            header: 'Email',
        }),
        columnHelper.display({
            cell: (info) => (
                <div className='font-bold'>
                    <Button
                        onClick={() => {
                            setVendorProductModal(true),
                                setCustomerId(info?.row?.original?._id),
                                setVendorInfo(info?.row?.original)
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                    </Button>
                    <Button
                        onClick={() => {
                            handleGeneratePDF(info.row.original._id)
                        }}
                        icon='DuoFile'
                    />
                        
                     
                    <Button
                        onClick={() => {
                            handleClickDelete(info?.row?.original?._id);
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
        data: customerOrderList && customerOrderList,
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
        <>
            <PageWrapper name='Product List'>
                <Container>
                    <Card className='h-full'>
                        <CardHeader>
                            <CardHeaderChild>
                                <CardTitle>All Customer Order</CardTitle>
                                <Badge
                                    variant='outline'
                                    className='border-transparent px-4 '
                                    rounded='rounded-full'>
                                    {table.getFilteredRowModel().rows.length} items
                                </Badge>
                            </CardHeaderChild>

                            <CardHeaderChild>
                                <Link to={`${PathRoutes.add_customer_order}`}>
                                    <Button variant='solid' icon='HeroPlus'>
                                        New Customer Order
                                    </Button>
                                </Link>
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
                <Modal isOpen={vedorProductModal} setIsOpen={setVendorProductModal} isScrollable fullScreen>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                    >
                        <div>
                            <h2 className="italic capitalize text-xl">
                                Customer Name: {vendorInfo?.customer?.name}
                            </h2>
                            <h4 className="italic text-sm mt-2 text-gray-500">
                                Phone Number: {vendorInfo?.customer?.phone}
                            </h4>
                            <div>
                                <h4 className="italic text-sm text-gray-500">
                                    email: {vendorInfo?.customer?.email}
                                </h4>
                            </div>
                            {/* <h4 className="italic text-sm text-gray-500">
                                GST Number: {vendorInfo?.customer?.gstNumber}
                            </h4> */}
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <CustomerEntryDetail customerId={customerId} />
                    </ModalBody>
                </Modal>
            </PageWrapper>
        </>
    )

};

export default CustomerOrderListPage;

