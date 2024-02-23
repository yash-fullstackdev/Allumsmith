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
import { PathRoutes } from '../../../../utils/routes/enum';
import { get } from '../../../../utils/api-helper.util';

const columnHelper = createColumnHelper<any>();


const VendorProductList = ({ purchaseOrderList }: any) => {

    console.log("?????purchaseOrderList", purchaseOrderList)
    const [sorting, setSorting] = useState<SortingState>([]);
    const [productListData, setProductListData] = useState()


    console.log("productListData", productListData)



    const getPurchaseOrderList = async () => {
        // setIsLoading(true);
        try {
            const { data: allUsers } = await get(`/purchase-order/${purchaseOrderList}`);
            setProductListData(allUsers);
            // setIsLoading(false);
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
            // setIsLoading(false);
        } finally {
            // setIsLoading(false);
        }
    };


    useEffect(() => {
        getPurchaseOrderList();
    }, [])
    const columns = [
        columnHelper.accessor('product.name', {
            cell: (info) => (

                <div className=''>{`${info.getValue()}`}</div>

            ),
            header: 'Name',

        }),
        columnHelper.accessor('quantity', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Quantity',
        }),
        // columnHelper.accessor('length', {
        //     cell: (info) => (

        //         <div className=''>
        //             {`${info.getValue()}`}
        //         </div>
        //     ),
        //     header: 'Length',

        // }),
        // columnHelper.accessor('thickness', {
        //     cell: (info) => (

        //         <div className=''>{`${info.getValue()}`}</div>
        //     ),
        //     header: 'Thickness',
        // }),
        // columnHelper.accessor('weight', {
        //     cell: (info) => (

        //         <div className=''>{`${info.getValue()}`}</div>
        //     ),
        //     header: 'Weight',
        // }),


    ];
    const table = useReactTable({
        data: purchaseOrderList && purchaseOrderList[0].products,
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
        <PageWrapper name='Product List'>
            <>siv</>
            {/* <Container>
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
            </Container> */}

        </PageWrapper>
    )

};

export default VendorProductList;

