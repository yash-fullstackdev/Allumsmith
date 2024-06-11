import React, { useEffect, useMemo, useState } from 'react';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import _ from 'lodash';
import Button from '../../../../components/ui/Button';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import { finishInvList } from '../../../../mocks/db/finishInventoryList.db';
import { get } from '../../../../utils/api-helper.util';
import { createColumnHelper, getCoreRowModel, getExpandedRowModel, useReactTable, type ExpandedState } from '@tanstack/react-table';
import TableTemplate from '../../../../templates/common/TableParts.template';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';

const columnHelper = createColumnHelper<any>();
const FinishInventoryListPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [finishInventoryList, setFinishInventoryList] = useState<any[]>([]);
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
    const [expanded, setExpanded] = React.useState<ExpandedState>({})

    const [addFinishModal, setAddFinishModal] = useState<any>();
    const [finishQuantityModal, setFinishQuantityModal] = useState<any>();

    const handleProductClick = (productName: string) => {
        setExpandedProduct(prevProduct => prevProduct === productName ? null : productName);
    };

    const getFinishInventory = async () => {
        try {
            const { data } = await get('/finish_inventory');
            setFinishInventoryList(data);
        } catch (error: any) {
            console.error('Error fetching inventory:', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getFinishInventory();
    }, [])
    const renderSubComponent = ({ row }: { row: any }) => {
        return (
            <div className='pl-3.5'>
                <SubTable data={row.original?.subData} />
            </div>
        )
    }

    const finishInventoryData = useMemo(() => {
        const aggregatedData = [] as any[];
        finishInventoryList.forEach(item => {
            const { name: productName } = item.product;
            const existingProduct = aggregatedData.find(product => product.name === productName);

            const subDataEntry = {
                branch: item.branch.name,
                coating: item.coating.name,
                color: item.color.name,
                quantity: item.quantity
            };

            if (existingProduct) {
                existingProduct.totalQty += item.quantity;
                existingProduct.subData.push(subDataEntry);
            } else {
                aggregatedData.push({
                    name: productName,
                    totalQty: item.quantity,
                    subData: [subDataEntry]
                });
            }
        });
        return aggregatedData;
    }, [finishInventoryList]);


    const columns = [
        columnHelper.accessor('name', {
            cell: (info) => {
                return (
                    <div className='text-xl  min-h-[30px]  flex items-center' onClick={info?.row.getToggleExpandedHandler()} style={{ cursor: "pointer" }}>
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
        columnHelper.accessor('totalQty', {
            cell: (info) => (
                <div className='text-xl  min-h-[30px]  flex items-center'>
                    {`${info.getValue()}`}
                </div>
            ),
            header: () => (
                <div className='text-xl min-h-[30px] flex items-center'>
                    Total Quantity
                </div>
            )
        }),
    ];

    const table = useReactTable({
        data: finishInventoryData || [],
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
        <PageWrapper name='Finish Inventory List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Finish Inventory</h1></CardTitle>
                        </CardHeaderChild>

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

            </Container>
        </PageWrapper>
    );
};

const SubTable = ({ data }: any) => {
    const subColumns = [
        columnHelper.accessor('branch', {
            cell: (info) => (
                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Branch',
        }),
        columnHelper.accessor('coating', {
            cell: (info) => (
                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Coating',
        }),
        columnHelper.accessor('color', {
            cell: (info) => (
                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Color',
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

export default FinishInventoryListPage;
