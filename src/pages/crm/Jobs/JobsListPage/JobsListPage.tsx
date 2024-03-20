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
import JobsBatch from './JobsBatch';
import Subheader, { SubheaderLeft } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import EditJobModal from '../JobsPage/EditJobModal';




const columnHelper = createColumnHelper<any>();


const JobsListPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [jobsList, setJobsList] = useState<any>([]);
    const [jobId, setJobId] = useState('')
    const [isEditModal, setIsEditModal] = useState(false);
    const [batchModal, setBatchModal] = useState<boolean>(false);
    const [batch, setBatch] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');


    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: jobList } = await get(`/jobs`);
            setJobsList(jobList);
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
    const handleClickDelete = async (id: any) => {
        try {
            const { data: jobs } = await deleted(`/jobs/${id}`);
            console.log("jobs", jobs)
            toast.success('Jobs deleted Successfully');
        } catch (error: any) {
            console.error('Error deleted Jobs:', error);
            setIsLoading(false);
            toast.error('Error deleting Jobs', error);
        } finally {
            setIsLoading(false);
            fetchData();
        }
    }
    console.log('Job List', jobsList)
    const columns = [

        columnHelper.accessor('name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Name',
        }),

        columnHelper.accessor('branch.name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Branch Name',
        }),
        columnHelper.accessor('status', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'status',
        }),


        columnHelper.display({
            cell: (info) => (
                <div className='font-bold'>
                    <Button
                        onClick={() => {
                            setBatchModal(true);
                            setBatch(info.row.original.batch);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                    </Button>
                    <Button
                        onClick={() => {
                            setIsEditModal(true)
                            setJobId(info.row.original._id);
                        }}
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
                                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
                            />
                        </svg>

                    </Button>
                    <Button
                        onClick={() => {
                            handleClickDelete(info.row.original._id);
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
        state: {
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
        <PageWrapper name='Jobs List'>
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
                <Card className='h-full'>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle>All Jobs</CardTitle>
                            <Badge
                                variant='outline'
                                className='border-transparent px-4 '
                                rounded='rounded-full'>
                                {table.getFilteredRowModel().rows.length} items
                            </Badge>
                        </CardHeaderChild>

                        <CardHeaderChild>
                            <Link to={`${PathRoutes.add_jobs}`}>
                                <Button variant='solid' icon='HeroPlus'>
                                    New Job
                                </Button>
                            </Link>
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
            <Modal isOpen={isEditModal} setIsOpen={setIsEditModal} isScrollable fullScreen>
                <ModalHeader
                    className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'

                >
                    Edit Job
                </ModalHeader>
                <ModalBody>
                    <EditJobModal jobId={jobId} setIsEditModal={setIsEditModal} fetchData={fetchData} />
                </ModalBody>
            </Modal>
            <Modal isOpen={batchModal} setIsOpen={setBatchModal} isScrollable fullScreen>
                <ModalHeader
                    className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'

                >
                    All Batch
                </ModalHeader>
                <ModalBody>
                    <JobsBatch batch={batch} />
                </ModalBody>
            </Modal>

        </PageWrapper>
    )

};

export default JobsListPage;

