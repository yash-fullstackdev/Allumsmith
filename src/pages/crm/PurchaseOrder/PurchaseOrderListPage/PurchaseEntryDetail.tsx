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
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
    CardHeader,
    CardHeaderChild,
    CardTitle,
} from '../../../../components/ui/Card';
import TableTemplate, {
    TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';
import { get, post } from '../../../../utils/api-helper.util';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/Button';
import { toast } from 'react-toastify';
import Collapse from '../../../../components/utils/Collapse';
import Input from '../../../../components/form/Input';



const columnHelper = createColumnHelper<any>();


const PurchaseEntryDetail = ({ productsArray, branchesData, poId }: any) => {

    console.log("productsArray", productsArray)

    const [sorting, setSorting] = useState<SortingState>([]);
    const [editedData, setEditedData] = useState<{ [key: string]: any }>({});
    // const [branchesData, setBranchesData] = useState<any>()
    const [selectedBranches, setSelectedBranches] = useState<any>({});

    const [purchaseEntry, setPurchaseEntry] = useState<any>()
    const [isNewPurchaseEntry, setIsNewPurchaseEntry] = useState(false);
    const [collapsible, setCollapsible] = useState(false)
    const [collapsibleEntryList, setCollapsibleEntryList] = useState(false)
    const handleReceivedQuantityChange = (id: string, value: string) => {
        setEditedData((prevData) => ({
            ...prevData,
            [id]: {
                receivedQuantity: value,
                branch: selectedBranches[id] ?? selectedBranches,
            },
        }));
    };

    const handleSave = async () => {
        const saveData = table.getFilteredRowModel().rows.map((row: any) => ({
            product: row.original.product._id,
            receivedQuantity: editedData[row.id]?.receivedQuantity ?? row.original.receivedQuantity,
            branch: selectedBranches,
        }));

        // You can now use the 'saveData' as needed, such as sending it to the server.
        console.log('Save Data:', poId, saveData);
        // try {

        //     const products = saveData
        //     const final = { products }
        //     const branches = await post(`/purchase-order/registerPurchaseEntry/${poId}`, final);
        //     console.log("Branches", branches);
        //     toast.success('product added to inventory')
        // } catch (error: any) {
        //     console.error("Error Saving Branch", error)
        //     toast.error('Error Saving Branch', error)
        // }
        // finally {
        //     // navigate(PathRoutes.branches);
        // }

    };

    const id = ''
    const columns = [
        columnHelper.accessor('product.name', {
            cell: (info) => (

                <div className=''>{`${info.getValue()}`}</div>

            ),
            header: 'Product Name',

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
            header: 'Requried Quanity',
        }),

        columnHelper.accessor('pendingQuantity', {
            cell: (info) => (
                <div className=''>
                    {info?.cell?.row?.original?.requiredQuantity - info?.cell?.row?.original?.receivedQuantity}
                </div>
            ),
            header: 'Pending Quantity',
            // enableHiding: true

        }),

        columnHelper.accessor('receivedQuantity', {
            cell: (info) => (
                <div className=''>
                    <input
                        type='number'
                        value={editedData[info.row.id]?.receivedQuantity ?? info.getValue()}
                        onChange={(e) =>
                            handleReceivedQuantityChange(info.row.id, e.target.value)
                        }
                        disabled={!isNewPurchaseEntry}
                    />
                </div>
            ),
            header: 'Received Quantity',
        }),
        columnHelper.accessor('selectBranch', {
            cell: (info) => (

                // console.log("info", info)
                <div className=''>
                    <Select
                        id={`branch-${info.row.original._id}`}
                        name={`branch-${info.row.original._id}`}
                        value={selectedBranches[id] ?? selectedBranches}
                        placeholder='Select branch'
                        onChange={(e: any) => {
                            setSelectedBranches((prevBranches: any) => ({
                                ...prevBranches,
                                [id]: e.target.value,
                            }));
                        }}
                        disabled={!isNewPurchaseEntry}
                    >
                        {branchesData &&
                            branchesData.length > 0 &&
                            branchesData?.map((data: any) => (
                                <option key={data._id} value={data._id}>
                                    {data.name}
                                </option>
                            ))}
                    </Select>

                </div>
            ),
            header: 'Select Branch',
        }),
        columnHelper.accessor('status', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Status',
        }),
        columnHelper.display({
            cell: () => (
                <div className='font-bold'>
                    <Button onClick={handleSave}>
                        SAVE
                    </Button>
                </div>
            ),
            header: 'Actions',
            size: 80,
        }),

    ];
    const table = useReactTable({
        data: productsArray && productsArray,
        columns,
        state: {
            sorting,
        },
        // onSortingChange: setSorting,
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
    });


    const getPurchaseEntryData = async () => {

        try {
            const { data: allProductList } = await get(`/purchase-order/purchaseEntry/${poId}`);
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

    const handleNewPurchaseEntry = () => {
        setIsNewPurchaseEntry(true);
        console.log('asdsd', isNewPurchaseEntry)
    };

    return (

        <>
            <PageWrapper name='Product List'>
                <Container>
                    <Card className='h-full'>
                        <CardHeader>
                            <CardHeaderChild>
                                <CardTitle
                                    className='cursor-pointer '
                                    onClick={() =>
                                        setCollapsible(!collapsible)
                                    }
                                >Purchased Products List</CardTitle>
                                <Badge
                                    variant='outline'
                                    className='border-transparent px-4 '
                                    rounded='rounded-full'>
                                    {table.getFilteredRowModel().rows.length} items
                                </Badge>
                            </CardHeaderChild>
                            <Collapse isOpen={!collapsible}>
                                <Button variant='solid' icon='HeroPlus' onClick={() => { handleNewPurchaseEntry() }}>
                                    New Purchase Entry
                                </Button>
                            </Collapse>
                        </CardHeader>
                        <Collapse isOpen={!collapsible}>
                            <CardBody className='overflow-auto'>

                                <TableTemplate
                                    className='table-fixed max-md:min-w-[70rem]'
                                    table={table}
                                />
                            </CardBody>

                            <TableCardFooterTemplate table={table} />
                        </Collapse>
                    </Card>
                </Container>
            </PageWrapper >


            <PageWrapper>
                <Container>
                    <Card className='h-full'>
                        <CardHeader>
                            <CardHeaderChild>
                                <CardTitle
                                    className='cursor-pointer'
                                    onClick={() =>
                                        setCollapsibleEntryList(!collapsibleEntryList)
                                    }>Purchased Entry List</CardTitle>
                                <Badge
                                    variant='outline'
                                    className='border-transparent px-4 '
                                    rounded='rounded-full'>
                                    {purchaseEntryTable.getFilteredRowModel().rows.length} items
                                </Badge>
                            </CardHeaderChild>
                        </CardHeader>
                        <Collapse isOpen={!collapsibleEntryList}>
                            <CardBody className='overflow-auto'>

                                <TableTemplate
                                    className='table-fixed max-md:min-w-[70rem]'
                                    table={purchaseEntryTable}
                                />
                            </CardBody>
                            <TableCardFooterTemplate table={purchaseEntryTable} />
                        </Collapse>
                    </Card>
                </Container>
            </PageWrapper>


        </>
    )

};

export default PurchaseEntryDetail;

