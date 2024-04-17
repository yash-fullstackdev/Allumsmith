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

const InvoiceCustomerDetail = ({ productInfo }: any) => {

    console.log('JobList', productInfo)
    const columns = [
        columnHelper.accessor('name', {
            cell: (info) => (
                // <div className=''>
                //         {`${info.getValue()}`}
                //     </div>
                <div className=''>{info.getValue()}</div>
            ),
            header: 'Product Name',

        }),
        columnHelper.accessor('amount', {
            cell: (info) => (
                // <div className=''>
                //         {`${info.getValue()}`}
                //     </div>
                <div className=''>{info.getValue()}</div>
            ),
            header: 'Amount',

        }),
        columnHelper.accessor('coatingDiscount', {
            cell: (info) => (
                // <div className=''>
                //         {`${info.getValue()}`}
                //     </div>
                <div className=''>{info.getValue()|| 0}</div>
            ),
            header: 'Discount',

        }),


    ];

    const table = useReactTable({
        data: productInfo,
        columns,
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
                        {table.getFilteredRowModel().rows.length > 0 &&
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


                    </Card>
                </Container>
            </PageWrapper >


        </div >
    )
}

export default InvoiceCustomerDetail;
