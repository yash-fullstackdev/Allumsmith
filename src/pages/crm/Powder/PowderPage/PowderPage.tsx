import React, { useEffect, useMemo, useState } from 'react';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { inventoryList } from '../../../../mocks/db/inventoryList.db';
import Button from '../../../../components/ui/Button';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import AddPowderQuantity from '../AddPowderQuantity';
import AddPowderModal from '../AddPowderModal/AddPowderModal';
import { get } from '../../../../utils/api-helper.util';
import _ from 'lodash';
import { createColumnHelper, getCoreRowModel, getExpandedRowModel, useReactTable, type ExpandedState } from '@tanstack/react-table';
import TableTemplate from '../../../../templates/common/TableParts.template';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';

const columnHelper = createColumnHelper<any>();
const PowderInventoryListPage = () => {
    const [powderInventoryList, setPowderInventoryList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
    const [addPowderModal, setAddPowderModal] = useState<any>();
    const [powderQuantityModal, setPowderQuantityModal] = useState<any>();
    const [expanded, setExpanded] = React.useState<ExpandedState>({});

    const handleProductClick = (productName: string) => {
        setExpandedProduct(prevProduct => prevProduct === productName ? null : productName);
    };


    const getPowderList = async () => {
        setIsLoading(true);
        try {
            const { data } = await get('/utility_inventory')
            setPowderInventoryList(data)
        } catch (error: any) {
            console.error('Error fetching inventory:', error.message);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getPowderList();
    }, [])

    const renderBranches = (items: any) => {
        console.log('Branches', items)
        return (
            <TableRow>
                <TableCell colSpan={3}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><h3>Branch</h3></TableCell>
                                    <TableCell><h3>Quantity</h3></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items && items.map((branch: any) => (
                                    <TableRow key={branch._id}>
                                        <TableCell><h4>{branch?.branch?.name || "NA"}</h4></TableCell>
                                        <TableCell><h4>{branch?.quantity || "NA"}</h4></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TableCell>
            </TableRow>
        );
    };

    const powderInventoryData = useMemo(() => {
        const aggregatedData = [] as any[];
        powderInventoryList.forEach(item => {
            const { name: productName } = item.utility;
            const existingProduct = aggregatedData.find(product => product.name === productName);
            const subDataEntry = {
                branch: item?.branch?.name,
                quantity: item?.quantity
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
    }, [powderInventoryList]);

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
                <div className='text-xl  min-h-[30px] flex items-center'>
                    {`${info.getValue()}`}
                </div>
            ),
            header: () => (
                <div className='text-xl min-h-[30px] flex items-center'>
                    Total Quantity(kg)
                </div>
            )
        }),
    ];

    const table = useReactTable({
        data: powderInventoryData || [],
        columns,
        state: {
            expanded,
        },
        onExpandedChange: setExpanded,
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true
    });

    const renderSubComponent = ({ row }: { row: any }) => {
        return (
            <div className='pl-3.5'>
                <SubTable data={row.original?.subData} />
            </div>
        )
    }

    return (
        <PageWrapper name='Powder Inventory List'>
            <Container>
                <Card>
                    <CardHeader>
                        <CardHeaderChild>
                            <CardTitle><h1>Raw Material Inventory</h1></CardTitle>
                        </CardHeaderChild>
                        <div className='flex justify-end gap-5'>
                            <Button variant='solid' icon='HeroPlus' onClick={() => setAddPowderModal(true)}>
                                Add Raw Material
                            </Button>
                            <Button variant='solid' icon='HeroPlus' onClick={() => setPowderQuantityModal(true)}>
                                Add Raw Material Quantity
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>

                        {!isLoading ? (
                            table.getFilteredRowModel().rows.length > 0 ? (
                                <TableTemplate
                                    className='table-fixed max-md:min-w-[70rem]'
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
                <Modal isOpen={addPowderModal} setIsOpen={setAddPowderModal} isScrollable fullScreen='2xl'>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold gap-5'
                    >
                        Add Raw Material
                    </ModalHeader>
                    <ModalBody>
                        <AddPowderModal SetAddPowderModal={() => setAddPowderModal(false)} getPowderList={getPowderList} />
                    </ModalBody>
                </Modal>
                <Modal isOpen={powderQuantityModal} setIsOpen={setPowderQuantityModal} isScrollable fullScreen='2xl'>
                    <ModalHeader
                        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
                    >
                        Add Raw Material Quantity
                    </ModalHeader>
                    <ModalBody>
                        <AddPowderQuantity setPowderQuantityModal={setPowderQuantityModal} getPowderList={getPowderList} />
                    </ModalBody>
                </Modal>
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

export default PowderInventoryListPage;
