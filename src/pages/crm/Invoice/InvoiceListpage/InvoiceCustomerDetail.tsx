import React, { useState } from 'react'
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper'
import { SubheaderRight } from '../../../../components/layouts/Subheader/Subheader'
import Button from '../../../../components/ui/Button'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardHeaderChild } from '../../../../components/ui/Card'
import Collapse from '../../../../components/utils/Collapse'
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const columnHelper = createColumnHelper<any>();

const InvoiceCustomerDetail = ({jobsList}:any) => {
    

const columns = [
    columnHelper.accessor('products', {
        cell: (info) => (
            // <div className=''>
            //         {`${info.getValue()}`}
            //     </div>
            <div className=''>{info?.row?.original?.products.map((product: any, index: number) => (
                <div key={index}>{product.product.name}</div>
            ))}</div>
        ),
        header: 'Product Name',

    }),
    columnHelper.accessor('products', {
        cell: (info) => (
            <div className=''>{info?.row?.original?.products.map((product: any, index: number) => (
                <div key={index}>{product.amount}</div>
            ))}</div>
        ),
        header: 'Product Amount',

    }),
    columnHelper.accessor('products', {
        cell: (info) => (
            <div className=''>{info?.row?.original?.products.map((product: any, index: number) => (
                <div key={index}>{product.delieveryQuantity}</div>
            ))}</div>
        ),
        header: 'Deliveried Quantity',

    }),
    columnHelper.accessor('products', {
        cell: (info) => (
            <div className=''>{info?.row?.original?.products.map((product: any, index: number) => (
                <div key={index}>{product.coating}</div>
            ))}</div>
        ),
        header: 'Coating',

    }),
    columnHelper.accessor('products', {
        cell: (info) => (
            <div className=''>{info?.row?.original?.products.map((product: any, index: number) => (
                <div key={index}>{product.color}</div>
            ))}</div>
        ),
        header: 'Color',

    }),
];

const table = useReactTable({
    data: jobsList || '',
    columns,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
});

const OtherColumns = [
    columnHelper.accessor('alluminiumRate', {
        cell: (info) => (
            <div className=''>{info?.row?.original?.alluminiumRate}</div>
        ),
        header: 'Alluminium Rate',

    }),
    columnHelper.accessor('coatingDiscount', {
        cell: (info) => (
            <div className=''>{info?.row?.original?.coatingDiscount}</div>
        ),
        header: 'Coating Discount',

    }),
    columnHelper.accessor('customerDiscount', {
        cell: (info) => (
            <div className=''>{info?.row?.original?.customerDiscount}</div>
        ),
        header: 'Customer Discount',

    }),
    columnHelper.accessor('finished_weight', {
        cell: (info) => (
            <div className=''>{info?.row?.original?.finished_weight}</div>
        ),
        header: 'Finished Weight',

    }),
    
];

const Othertable = useReactTable({
    data: jobsList,
    columns: OtherColumns,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
});
  return (
    <div>
            <PageWrapper name='Product List'>
                <Container>
                    <Card >
                        <CardBody>
                            <div className='flex'>
                                <div className='bold w-full'>
                                    <Button
                                        variant='outlined'
                                        className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
                                        <h2 className='text-gray-700'> Purchased Products List </h2>
                                    </Button>
                                </div>
                            </div>
                        </CardBody>

                                <CardBody className='overflow-auto'>
                                    {table.getFilteredRowModel().rows.length > 0 ? (
                                        <TableTemplate
                                            className='table-fixed max-md:min-w-[70rem]'
                                            table={table}
                                        />
                                    ) : (
                                        <p className="text-center text-gray-500">No records found</p>
                                    )}
                                </CardBody>
                                { table.getFilteredRowModel().rows.length > 0 &&
                                    <TableCardFooterTemplate table={table} />
                                }
                    </Card>

                    <Card >
                        <CardBody>
                            <div className='flex'>
                                <div className='bold w-full'>
                                    <Button
                                        variant='outlined'
                                        className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
                                        <h2 className='text-gray-700'> Other Detail </h2>
                                    </Button>
                                </div>
                            </div>
                        </CardBody>

                                <CardBody className='overflow-auto'>
                                   {Othertable.getFilteredRowModel().rows.length > 0 ? (
                                        <TableTemplate
                                            className='table-fixed max-md:min-w-[70rem]'
                                            table={Othertable}
                                        />
                                    ) : (
                                        <p className="text-center text-gray-500">No records found</p>
                                    )}
                                </CardBody>
                                { Othertable.getFilteredRowModel().rows.length > 0 &&
                                    <TableCardFooterTemplate table={Othertable} />
                                }
                    </Card>
                </Container>
            </PageWrapper >


        </div >
  )
}

export default InvoiceCustomerDetail;
