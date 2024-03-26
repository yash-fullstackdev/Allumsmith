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

import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
    CardHeader,
    CardHeaderChild,
    CardTitle,
} from '../../../../../components/ui/Card';
import TableTemplate, {
    TableCardFooterTemplate,
} from '../../../../../templates/common/TableParts.template';
import Badge from '../../../../../components/ui/Badge';
import { get } from '../../../../../utils/api-helper.util';

const columnHelper = createColumnHelper<any>();


const ProductList = ({ productsArray, vendorId }: any) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [purchaseEntry, setPurchaseEntry] = useState<any>()

    const getPurchaseEntryData = async () => {

        try {
            const { data: allProductList } = await get(`/purchase-order/purchaseEntry/${vendorId}`);
            setPurchaseEntry(allProductList);
            purchaseEntryTable.setGlobalFilter(allProductList)
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
        } finally {
        }
    };



    useEffect(() => {
        getPurchaseEntryData()
    }, [])



    const columns = [
        columnHelper.accessor('product.name', {
            cell: (info) => (

                <div className=''>{`${info.getValue()}`}</div>

            ),
            header: 'Name',

        }),
        columnHelper.accessor('product.productCode', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Product Code',
        }),
        columnHelper.accessor('requiredQuantity', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Quantity',
        }),
        columnHelper.accessor('status', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Status',
        }),



    ];

    const table = useReactTable({
        data: productsArray,
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

    const purchaseEntryColumns = [
        columnHelper.accessor('products', {
            cell: (info) => (

                < div className='' > {`${info?.row?.original?.products[0]?.product?.name}`}</div>

            ),
            header: 'Name',

        }),
        columnHelper.accessor('requiredQuantity', {
            cell: (info) => (

                < div className='' > {`${info?.row?.original?.products[0]?.receivedQuantity}`}</div>

            ),
            header: 'Recived Quantity',
        }),
        columnHelper.accessor('requiredQuantity', {
            cell: (info) => (
                < div className='' >{`${info?.row?.original?.products[0]?.receivedQuantity}`}</div>
            ),
            header: 'Quantity',
        }),
        columnHelper.accessor('branch', {
            cell: (info) => (

                < div className='' >{`${info?.row?.original?.products[0]?.branch.name}`}</div>
            ),
            header: 'Branch',
        }),



    ];

    const purchaseEntryTable = useReactTable({
        data: purchaseEntry && purchaseEntry?.length > 0 && purchaseEntry || [],
        columns: purchaseEntryColumns,
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
                                <CardTitle>Purchased Products List</CardTitle>
                                <Badge
                                    variant='outline'
                                    className='border-transparent px-4 '
                                    rounded='rounded-full'>
                                    {table.getFilteredRowModel().rows.length} items
                                </Badge>
                            </CardHeaderChild>
                        </CardHeader>
                        <CardBody className='overflow-auto'>

                            <TableTemplate
                                className='table-fixed max-md:min-w-[70rem]'
                                table={table}
                            />
                        </CardBody>
                        <TableCardFooterTemplate table={table} />
                    </Card>
                </Container>
            </PageWrapper>


            {/* //////purchase Entry table */}

            <PageWrapper name='Product List'>
                <Container>
                    <Card className='h-full'>
                        <CardHeader>
                            <CardHeaderChild>
                                {/* <CardTitle>Purchased Entry List</CardTitle>
                                <Badge
                                    variant='outline'
                                    className='border-transparent px-4 '
                                    rounded='rounded-full'>
                                    {purchaseEntryTable.getFilteredRowModel().rows.length} items
                                </Badge> */}
                            </CardHeaderChild>
                        </CardHeader>
                        <CardBody className='overflow-auto'>

                            <TableTemplate
                                className='table-fixed max-md:min-w-[70rem]'
                                table={purchaseEntryTable}
                            />
                        </CardBody>
                        <TableCardFooterTemplate table={purchaseEntryTable} />
                    </Card>
                </Container>
            </PageWrapper>
        </>
    )

};

export default ProductList;

