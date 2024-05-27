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
import Modal, { ModalBody, ModalFooter, ModalFooterChild, ModalHeader } from '../../../../components/ui/Modal';
import EditBranchModal from '../../Branches/BranchesPage/EditBranchModal';
import TransactionListPage from './TransactionListPage';
import LedgerDetailModal from './LedgerDetailModal';
import Subheader, { SubheaderLeft } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';


const LedgerListPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [transactionListModal, setTransactionModal] = useState<boolean>(false);
    const [customerId, setCustomerId] = useState<any>('')
    const [deleteModal,setDeleteModal] = useState<boolean>(false);
    const [deleteId,setDeleteId] = useState<string>('');
    const [ledgerModal, setLedgerModal] = useState<boolean>(false);
    const [customerData, setCustomerData] = useState<any>();
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data } = await get(`/customers`);
            const filteredData = data.filter((customer: any) => customer.associatedInvoices.length > 0);
            filteredData.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
            setData(filteredData);
            setIsLoading(false);
        } catch (error: any) {
            console.error('Error fetching customer:', error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    console.log('Customer Data', data);
    

    useEffect(() => {
        fetchData();
    }, [])

    console.log('Data', data);

    const handleClickDelete = (id: any) => {
		setDeleteModal(true);
		setDeleteId(id);
	};

	const handleDeleteLedger= async (id: any) => {
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
	};
  



    const columns = [

        columnHelper.accessor('name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue() || 'NA'} `}
                </div>

            ),
            header: 'Customer Name',
        }),
        columnHelper.accessor('credit_amount', {
            cell: (info) => (

                <div className=''>
                    {`${(info.getValue() || 0).toFixed(2)} `}
                </div>

            ),
            header: 'Credit Amount',
        }),

        columnHelper.accessor('pending_amount', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue().toFixed(2) || 0} `}
                </div>

            ),
            header: 'Pending Amount',
        }),

     

        columnHelper.display({
            cell: (info:any) => (
                <div className='font-bold'>
                    <Link 
                    to={`${PathRoutes.add_ledger}/${info.row.original._id}`}
                   
                    >
                    <Button
                      onClick={() => setCustomerData(info.row.original)}  
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                    </Button>
                    </Link>

                </div>
            ),
            header: 'Actions',
            size: 80,
        }),


    ];
    const table = useReactTable({
        data: data,
        columns,
        state:{
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (
        <PageWrapper name='Ledger List'>
            <Subheader>
				<SubheaderLeft>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							globalFilter && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() => setGlobalFilter('')}
								/>
							)
						}>
						<Input
							className='pl-8'
							id='searchBar'
							name='searchBar'
							placeholder='Search...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
			</Subheader>
            <Container>
                <Card>
                    {/* <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Customer List</h1></CardTitle>
                        </CardHeaderChild>
                        <CardHeaderChild>
                            
                                <Button variant='solid' icon='HeroPlus' onClick={() => setLedgerModal(true)}>
                                    New Ledger
                                </Button>
                           
                        </CardHeaderChild>

                    </CardHeader> */}
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
            <Modal isOpen={ledgerModal} setIsOpen={setLedgerModal} isScrollable fullScreen ='2xl'>
                <ModalHeader
                    className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                // onClick={() => formik.resetForm()}
                >
                    Add Ledger Entry
                </ModalHeader>
                <ModalBody>
                    <LedgerDetailModal />
                </ModalBody>
            </Modal>
            
        </PageWrapper>
    )
}

export default LedgerListPage
