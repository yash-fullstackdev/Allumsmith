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
import { Link, useNavigate } from 'react-router-dom';

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
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import EditJobModal from '../JobsPage/EditJobModal';
import StatusModal from '../JobsPage/StatusModal';
import Collapse from '../../../../components/utils/Collapse';
import WithoutJobBatch from '../JobsPage/WithoutMaterial/WithoutJobBatch';

const data = [
    {
      "_id": "66150816b58091900b0577a8",
      "status": "pending",
      "batch": [
        {
          "coEntry": "66150715d552be361fdf1b8d",
          "products": [
            {
              "product": "testing_1",
              "quantity": 50,
              "coating": "65eefc87d89d7dd26a0698fa",
              "color": "65f9568731389ebed5e5cd96"
            }
          ]
        }
      ],
      "selfProducts": [],
      "branch": "65ddd17a9cc860ed6000a83f",
      "name": "test_jobwm",
      "withoutMaterial": true,
      "createdAt": "2024-04-09T09:19:18.144Z",
      "updatedAt": "2024-04-09T09:19:18.144Z",
      "__v": 0
    },
    {
      "_id": "661527c6817be66699af6662",
      "status": "pending",
      "batch": [
        {
          "coEntry": "66150715d552be361fdf1b8d",
          "products": [
            {
              "product": "testing_1",
              "quantity": 50,
              "coating": "65eefc87d89d7dd26a0698fa",
              "color": "65f9568731389ebed5e5cd96"
            },
            {
              "product": "testing_12",
              "quantity": 50,
              "coating": "65eefc87d89d7dd26a0698fa",
              "color": "65f9568731389ebed5e5cd96"
            }
          ]
        }
      ],
      "selfProducts": [],
      "withoutMaterial": true,
      "createdAt": "2024-04-09T11:34:30.677Z",
      "updatedAt": "2024-04-09T11:34:30.677Z",
      "__v": 0
    },
    {
      "_id": "661528b3817be66699af6687",
      "status": "pending",
      "batch": [
        {
          "coEntry": "66152363719dd515fbbd8f7c",
          "products": [
            {
              "product": "testing_1",
              "quantity": 20,
              "coating": "65eefc87d89d7dd26a0698fa",
              "color": "65f9568731389ebed5e5cd96"
            },
            {
              "product": "testing_12",
              "quantity": 50,
              "coating": "65eefc87d89d7dd26a0698fa",
              "color": "65f9568731389ebed5e5cd96"
            },
            {
              "product": "test_67",
              "quantity": 67,
              "coating": "65eefc87d89d7dd26a0698fa",
              "color": "65f9568731389ebed5e5cd96"
            }
          ]
        }
      ],
      "selfProducts": [],
      "withoutMaterial": true,
      "createdAt": "2024-04-09T11:38:27.912Z",
      "updatedAt": "2024-04-09T11:38:27.912Z",
      "__v": 0
    }
  ]


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
    const [statusModal, setStatusModal] = useState<boolean>(false);
    const [status, setStatus] = useState<any>('')
    const navigate = useNavigate();
    const [collapsible, setCollapsible] = useState<boolean[]>(jobsList.map(() => false));
    const [withoutbatchModal, setWithOutBatchModal] = useState<boolean>(false);
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
    console.log('JobList', jobsList)
    const columns = [

        columnHelper.accessor((row) => row.name, {
            cell: (info) => (
                <div className=''>
                    {`${info.getValue() || "NA"} `}
                </div>
            ),
            header: 'Name',

        }),

        // columnHelper.accessor('branch.name', {
        //     cell: (info) => (

        //         <div className=''>
        //             {`${info.getValue()}`}
        //         </div>

        //     ),
        //     header: 'Branch Name',
        // }),
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
                    <Button onClick={() => {
                        setStatusModal(true)
                        setStatus(info.row.original.status)
                        setJobId(info.row.original._id)
                    }}
                        isDisable={info.row.original.status === 'completed'}
                    ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
                        </svg>
                    </Button>
                    <Button
                        onClick={() => {
                            setBatchModal(true);
                            setJobId(info.row.original._id)
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                    </Button>
                    <Button
                        onClick={() => {
                            // setIsEditModal(true)
                            // setJobId(info.row.original._id);
                            navigate(`${PathRoutes.edit_jobs}/${info.row.original._id}`)
                        }}
                        isDisable={info.row.original.status === 'in_progress' || info.row.original.status === 'completed'}
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

    // for without material 

    const withoutMaterial = [

        columnHelper.accessor((row) => row.name, {
            cell: (info) => (
                <div className=''>
                    {`${info.getValue() || "NA"} `}
                </div>
            ),
            header: 'Name',

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
                    <Button onClick={() => {
                        setStatusModal(true)
                        setStatus(info.row.original.status)
                        setJobId(info.row.original._id)
                    }}
                        isDisable={info.row.original.status === 'completed'}
                    ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
                        </svg>
                    </Button>
                    <Button
                        onClick={() => {
                            setWithOutBatchModal(true);
                            setJobId(info.row.original._id)
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                    </Button>
                    <Button
                        onClick={() => {
                            // setIsEditModal(true)
                            // setJobId(info.row.original._id);
                            navigate(`${PathRoutes.ediwihtoutmaterial_jobs}/${info.row.original._id}`)
                        }}
                        isDisable={info.row.original.status === 'in_progress' || info.row.original.status === 'completed'}
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


    const withoutdata = useReactTable({
        data: data,
        columns:withoutMaterial,
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

    const toggleCollapse = (index: number) => {
        const updatedCollapsible = [...collapsible];
        updatedCollapsible[index] = !updatedCollapsible[index];
        setCollapsible(updatedCollapsible);
    };

    return (
        <PageWrapper name='Jobs List'>
            <Subheader>
                <SubheaderRight>
                    <Link to={`${PathRoutes.add_jobs}`}>
                        <Button variant='solid' icon='HeroPlus'>
                            New Job
                        </Button>
                    </Link>
                </SubheaderRight>
            </Subheader>
            <Container>

                <Card className='h-full'>
                    <div className='flex'>
                        <div className='bold w-full'>
                            <Button
                                variant='outlined'
                                className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                rightIcon={
                                    !collapsible[table.getFilteredRowModel().rows.length]
                                        ? 'HeroChevronUp'
                                        : 'HeroChevronDown'
                                }
                                onClick={() => toggleCollapse(table.getFilteredRowModel().rows.length)}
                            >
                               <CardHeader>
                                <CardHeaderChild>
                                    <CardTitle>With Material Jobs</CardTitle>
                                    <Badge
                                        variant='outline'
                                        className='border-transparent px-4 '
                                        rounded='rounded-full'>
                                        {table.getFilteredRowModel().rows.length} items
                                    </Badge>
                                </CardHeaderChild>
                                <CardHeaderChild>

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
                                </CardHeaderChild>

                            </CardHeader>
                            </Button>
                        </div>
                    </div>
                    <Collapse isOpen={!collapsible[table.getFilteredRowModel().rows.length]}>
                        <div>
                            
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
                            {table.getFilteredRowModel().rows.length > 0 &&
                                <TableCardFooterTemplate table={table} />
                            }
                        </div>
                    </Collapse>
                </Card>

            </Container>

            {/* start of wihtout material */}

            <Container>

<Card className='h-full'>
    <div className='flex'>
        <div className='bold w-full'>
            <Button
                variant='outlined'
                className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                rightIcon={
                    !collapsible[withoutdata.getFilteredRowModel().rows.length]
                        ? 'HeroChevronUp'
                        : 'HeroChevronDown'
                }
                onClick={() => toggleCollapse(withoutdata.getFilteredRowModel().rows.length)}
            >
               <CardHeader>
                <CardHeaderChild>
                    <CardTitle>With Out Material Jobs</CardTitle>
                    <Badge
                        variant='outline'
                        className='border-transparent px-4 '
                        rounded='rounded-full'>
                        {withoutdata.getFilteredRowModel().rows.length} items
                    </Badge>
                </CardHeaderChild>
                <CardHeaderChild>

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
                </CardHeaderChild>

            </CardHeader>
            </Button>
        </div>
    </div>
    <Collapse isOpen={!collapsible[withoutdata.getFilteredRowModel().rows.length]}>
        <div>
            
            <CardBody className='overflow-auto'>
                {!isLoading && withoutdata.getFilteredRowModel().rows.length > 0 ? (
                    <TableTemplate
                        className='table-fixed max-md:min-w-[70rem]'
                        table={withoutdata}
                    />
                ) : (
                    !isLoading && <p className="text-center text-gray-500">No records found</p>
                )}
                <div className='flex justify-center'>
                    {isLoading && <LoaderDotsCommon />}
                </div>
            </CardBody>
            {withoutdata.getFilteredRowModel().rows.length > 0 &&
                <TableCardFooterTemplate table={withoutdata} />
            }
        </div>
    </Collapse>
</Card>

</Container>

            {/* end of without material */}
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
                    <JobsBatch batch={batch} jobId={jobId} />
                </ModalBody>
            </Modal>
            <Modal isOpen={withoutbatchModal} setIsOpen={setWithOutBatchModal} isScrollable fullScreen>
                <ModalHeader
                    className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'

                >
                    All Batch WithOut Material
                </ModalHeader>
                <ModalBody>
                    <WithoutJobBatch batch={batch} jobId={jobId} />
                </ModalBody>
            </Modal>
            <Modal isOpen={statusModal} setIsOpen={setStatusModal} isScrollable fullScreen="lg">
                <ModalHeader
                    className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'

                >
                    Status
                </ModalHeader>
                <ModalBody>
                    <StatusModal status={status} setStatus={setStatus} jobId={jobId} setStatusModal={setStatusModal} fetchData={fetchData} />
                </ModalBody>
            </Modal>

        </PageWrapper >
    )

};

export default JobsListPage;

