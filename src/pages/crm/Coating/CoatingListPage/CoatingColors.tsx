
import {  useState } from 'react';
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
import Badge from '../../../../components/ui/Badge';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { Container, PageWrapper } from '../../../../components/layouts';
import { Card, CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui';



const columnHelper = createColumnHelper<any>();


const CoatingColors = ({ colors }: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);




    const columns = [

        columnHelper.accessor('name', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Name',
        }),
        columnHelper.accessor('code', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Code',
        }),
        columnHelper.accessor('type', {
            cell: (info) => (

                <div className=''>
                    {info.getValue() !== undefined ? info.getValue() : "Type not add"}
                </div>

            ),
            header: 'Type',
        }),




    ];

    const table = useReactTable({
        data: colors,
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
        <PageWrapper name='Inventory List'>
            <Container>
                <Card className='h-full'>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle>Coating</CardTitle>
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
                    { table.getFilteredRowModel().rows.length > 0 &&
                        <TableCardFooterTemplate table={table} />
                    }
                </Card>
            </Container>
        </PageWrapper>
    )

};

export default CoatingColors;

