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
import TableTemplate, {
    TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import {  get } from '../../../../utils/api-helper.util';
import { Container, PageWrapper } from '../../../../components/layouts';
import { Badge, Card, CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui';


const columnHelper = createColumnHelper<any>();


const AssociatedJobsModal = ({ associatedJobs }: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [workerData, setWorkerData] = useState<any>()

    const fetchData = async () => {
        setIsLoading(true);
        try {            
            const { data: workerData } = await get(`/workers/${associatedJobs}`);
            console.log('data',workerData);
            
            setWorkerData(workerData);           
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
    }, [associatedJobs])


    const columns = [

        columnHelper.accessor('name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Job Name',
        },
        ),
        columnHelper.accessor('branch.name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Branch Name',
        },
        ),
        // columnHelper.accessor('associatedJobs.powder.powder.name', {
        //     cell: (info) => (

        //         <div className=''>
        //             {`${info.getValue()}`}
        //         </div>

        //     ),
        //     header: 'Powder Name',
        // },
        // ),
        // columnHelper.accessor('associatedJobs.powder.powderInKgs', {
        //     cell: (info) => (

        //         <div className=''>
        //             {`${info.getValue()}`}
        //         </div>

        //     ),
        //     header: 'Powder Quantity',
        // },
        // )

    ];

    const table = useReactTable({
        data: workerData && workerData?.associatedJobs || [],
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
        <PageWrapper>
            <Container>
                <Card className='h-full'>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle>Jobs</CardTitle>
                            <Badge
                                variant='outline'
                                className='border-transparent px-4 '
                                rounded='rounded-full'>
                                {table.getFilteredRowModel().rows.length} items
                            </Badge>
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
                    {table.getFilteredRowModel().rows.length > 0 &&
                        <TableCardFooterTemplate table={table} />
                    }
                </Card>

            </Container>


        </PageWrapper>
    )

};

export default AssociatedJobsModal;

