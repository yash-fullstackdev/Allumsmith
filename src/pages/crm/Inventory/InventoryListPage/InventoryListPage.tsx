import React, { useEffect, useState } from 'react';
import { get } from '../../../../utils/api-helper.util';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
    CardHeader,
    CardHeaderChild,
    CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import _ from 'lodash';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import StockActionModal from '../StockActionModal/StockActionModal';
import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, type ExpandedState } from '@tanstack/react-table';
import TableTemplate from '../../../../templates/common/TableParts.template';

const columnHelper = createColumnHelper<any>();



const InventoryListPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryList, setInventoryList] = useState<any>([]);
    const [productsArray, setProductsArray] = useState<any>([]);
    const [stockActionModal, setStockActionModal] = useState<any>()
    const [expanded, setExpanded] = React.useState<ExpandedState>({})

    useEffect(() => {
        if (inventoryList.length > 0) {
            const groupedData = _.groupBy(inventoryList, (item: any) => item?.product?._id);
            const resultArray = Object.keys(groupedData).map((productId) => {
                const productData = groupedData[productId];
                if (!productData[0]?.product) return null;

                const branches = productData.map((item) => {
                    if (!item.branch || !item.branch._id || !item.branch.name) return null;
                    return {
                        branchId: item.branch._id,
                        branchName: item.branch.name,
                        quantity: item.quantity,
                    };
                }).filter(Boolean);
                const totalQuantity = branches.reduce((total: number, branch: any) => total + branch.quantity, 0);
                return {
                    productId,
                    productName: productData[0].product.name,
                    totalQuantity,
                    branches,
                    thickness: productData[0].product.thickness,
                    length: productData[0].product.length,
                    productCode: productData[0].product.productCode,
                };
            }).filter(Boolean);

            setProductsArray(resultArray);
        }
    }, [inventoryList]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: inventoryList } = await get(`/inventory`);
            setInventoryList(inventoryList);
        } catch (error: any) {
            console.error('Error fetching inventory:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = (productId: any) => {
        // Toggle expanded state for the product
        const updatedProductsArray = productsArray.map((item: any) => {
            if (item.productId === productId) {
                return { ...item, expanded: !item.expanded };
            }
            return item;
        });
        setProductsArray(updatedProductsArray);
    };

    console.log('Inventory K', inventoryList);


    useEffect(() => {
        fetchData();
    }, [stockActionModal]);

    const columns = [
        columnHelper.accessor('productName', {
            cell: (info) => {
                return (
                    <div className='text-xl min-h-[30px] flex items-center' onClick={info?.row.getToggleExpandedHandler()} style={{ cursor: "pointer" }}>
                        {info?.row.getCanExpand() ? (
                            <Button
                                rightIcon={
                                    info?.row.getIsExpanded() ?
                                        'HeroMinus' : 'HeroPlus'
                                }
                            />
                        ) : null}
                        {`${info.getValue()}`}
                    </div>
                )
            },
            header: () => (
                <div className='text-xl min-h-[30px] flex items-center'>
                    Product Name
                </div>
            )

        }),
        columnHelper.accessor('productCode', {
            cell: (info) => (
                <div className='text-xl'>
                    {`${info.getValue()}`}
                </div>

            ),
            header: () => (
                <div className='text-xl min-h-[30px] flex items-center'>
                    Product Code
                </div>
            )
        }),
        columnHelper.accessor('thickness', {
            cell: (info) => (
                <div className='text-xl'>
                    {`${info.getValue()}`}
                </div>

            ),
            header: () => (
                <div className='text-xl min-h-[30px] flex items-center'>
                    Thickness
                </div>
            )
        }),
        columnHelper.accessor('length', {
            cell: (info) => (
                <div className='text-xl'>
                    {`${info.getValue()}`}
                </div>

            ),
            header: () => (
                <div className='text-xl min-h-[30px] flex items-center'>
                    Length
                </div>
            )
        }),
        columnHelper.accessor('totalQuantity', {
            cell: (info) => (
                <div className='text-xl'>
                    {`${info.getValue()}`}
                </div>

            ),
            header: () => (
                <div className='text-xl min-h-[30px] flex items-center'>
                    Total Quantity(Pcs)
                </div>
            )
        }),
    ];

    const renderSubComponent = ({ row }: { row: any }) => {
        return (
            <div className='pl-3.5'>
                <SubTable data={row.original?.branches} />
            </div>
        )
    }

    const table = useReactTable({
        data: productsArray || [],
        columns,
        state: {
            expanded,
        },
        onExpandedChange: setExpanded,
        getSubRows: (row) => {
            return row.subRows
        },
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true
    });

    return (
        <PageWrapper name='Inventory List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>All Inventory</h1></CardTitle>
                        </CardHeaderChild>
                        <Button variant='solid' icon='HeroPlus' onClick={() => setStockActionModal(true)}>
                            Stock Action
                        </Button>

                    </CardHeader>
                    <CardBody>
                        {!isLoading ? (
                            table.getFilteredRowModel().rows.length > 0 ? (
                                <TableTemplate
                                    className="table-fixed max-md:min-w-[70rem]"
                                    table={table}
                                    renderSubComponent={renderSubComponent}
                                />
                            ) : (
                                <p className="text-center text-gray-500">No records found</p>
                            )
                        ) : (
                            <div className="flex justify-center">
                                <LoaderDotsCommon />
                            </div>
                        )}
                    </CardBody>
                </Card>
                <Modal isOpen={stockActionModal} setIsOpen={setStockActionModal} isScrollable fullScreen='2xl'>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                    >
                        Stock Action
                    </ModalHeader>
                    <ModalBody>
                        <StockActionModal SetStockActionModal={() => setStockActionModal(false)} />
                    </ModalBody>
                </Modal>
            </Container>

        </PageWrapper>
    );
};

const SubTable = ({ data }: any) => {
    const subColumns = [
        columnHelper.accessor('branchName', {
            cell: (info) => (
                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Branch Name',
        }),
        columnHelper.accessor('quantity', {
            cell: (info) => (
                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Quantity',
        }),
    ];

    const table = useReactTable({
        data: data || [],
        columns: subColumns,
        getCoreRowModel: getCoreRowModel(),
    });


    return (
        <TableTemplate
            className='table-fixed max-md:min-w-[70rem]'
            table={table}
            hasFooter={false}
        />
    )
}

export default InventoryListPage;
