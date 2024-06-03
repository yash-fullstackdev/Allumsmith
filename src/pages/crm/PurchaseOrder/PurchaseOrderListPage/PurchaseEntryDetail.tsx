import { useEffect, useState, useRef, memo } from 'react';
// import Moment from 'moment';
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
import { SubheaderRight } from '../../../../components/layouts/Subheader/Subheader';

import { PathRoutes } from '../../../../utils/routes/enum';
import { useNavigate } from 'react-router-dom';



const columnHelper = createColumnHelper<any>();

const PurchaseEntryDetail = ({ branchesData, poId }: any) => {


    const [sorting, setSorting] = useState<SortingState>([]);
    const [editedData, setEditedData] = useState<{ [key: string]: any }>({});
    const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input element
    const [selectedBranches, setSelectedBranches] = useState<any>({});
    const [purchaseOrderData, setPurchaseOrderData] = useState<any>()
    const [purchaseEntry, setPurchaseEntry] = useState<any>()
    const [isNewPurchaseEntry, setIsNewPurchaseEntry] = useState(false);
    const [collapseAll, setCollapseAll] = useState<boolean>(false);
    const [accordionStates, setAccordionStates] = useState({
        collapsible: false,
        collapsibleEntryList: false,

    });
    const [currentState, setCurrentState] = useState<any>('');
    const navigate = useNavigate()



    const getPurchaseOrderByid = async () => {

        try {
            const { data: allPurchaseOrderById } = await get(`/purchase-order/${poId}`);
            setPurchaseOrderData(allPurchaseOrderById);
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
        } finally {
        }
    };

    const handleReceivedQuantityChange = (id: string, value: string) => {
        setEditedData((prevData) => ({
            ...prevData,
            [id]: {
                ...prevData[id],
                receivedQuantity: value,
            },
        }));
    }
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

        columnHelper.accessor(row => `${row.requiredQuantity - row.receivedQuantity}`, {
            cell: (info) => (
                <div className=''>
                    {`${info.getValue()}`}
                </div>
            ),
            header: 'Pending Quantity',
            // enableHiding: true

        }),

        columnHelper.accessor('receivedQuantity', {
            cell: (info) => (

                <div className=''>
                    <Input
                        type='number'
                        value={editedData[info.row.id]?.receivedQuantity}
                        onChange={(e) => { handleReceivedQuantityChange(info.row.id, e.target.value) }}
                        disabled={!isNewPurchaseEntry || info.row.original.status === 'completed'}
                        id={`receivedQuantity-${info.row.id}`}
                        name={`receivedQuantity-${info.row.id}`}
                        placeholder='Received Quantity'
                        onClick={() => setCurrentState(info.row.id)}
                        autoFocus={info.row.id === currentState}

                    />

                </div>

            ),





            header: 'Received Quantity',
        }),

        columnHelper.accessor('selectBranch', {
            cell: (info) => (
                <div className=''>
                    <Select
                        id={`branch-${info.row.id}`}
                        name={`branch-${info.row.id}`}
                        value={selectedBranches[info.row.id] ?? selectedBranches[info.row.id]}
                        placeholder='Select branch'
                        onChange={(e: any) => {
                            setSelectedBranches((prevBranches: any) => ({
                                ...prevBranches,
                                [info.row.id]: e.target.value,
                            }));
                        }}
                        disabled={!isNewPurchaseEntry || info.row.original.status === 'completed'}
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

    ];
    const table = useReactTable({
        data: purchaseOrderData?.products || [],
        columns,
        state: {
            sorting,
        },
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
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
        getPurchaseOrderByid()
    }, [])

    const purchaseEntryColumns = [
        columnHelper.accessor('date', {
            cell: (info) => (
                <div>
                    {new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }).format(new Date(info?.row?.original?.createdAt)) || '-'}
                </div>
            ),
            header: 'Date',
        }),
        columnHelper.accessor('products', {
            cell: (info) => (
                <div>
                    {info?.row?.original?.products.map((product: any, index: number) => (
                        <div key={index}>{product.product.name}</div>
                    ))}
                </div>
            ),
            header: 'Name',
        }),
        columnHelper.accessor('recivedquanity', {
            cell: (info) => (
                <div>
                    {info?.row?.original?.products.map((product: any, index: number) => (
                        <div key={index}>{product.receivedQuantity}</div>
                    ))}
                </div>
            ),
            header: 'Received Quantity',
        }),

        columnHelper.accessor('branch', {
            cell: (info) => (
                <div>
                    {info?.row?.original?.products.map((product: any, index: number) => (
                        <div key={index}>{product.branch.name}</div>
                    ))}
                </div>
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

    };
    const collapseAllAccordians = () => {
        setAccordionStates({
            collapsible: !collapseAll,
            collapsibleEntryList: !collapseAll
        });
        setCollapseAll(!collapseAll);
    };
    const handleSave = async () => {
        const saveData = table.getFilteredRowModel().rows.map((row: any, index: number) => ({
            ProductStaus: row.original.status,
            product: row.original.product._id,
            receivedQuantity: parseFloat(editedData[row.id]?.receivedQuantity ?? row.original.receivedQuantity),
            requiredQuantity: parseFloat(row.original.requiredQuantity),
            branch: selectedBranches[index],
        }));
        const UpdatedEntries: any = saveData.filter(entry => entry.ProductStaus !== 'completed' && entry?.branch && entry.receivedQuantity);
        try {
            const invalidEntries = purchaseOrderData?.products?.some((entry: any) =>
                (entry.requiredQuantity - entry.receivedQuantity) < UpdatedEntries?.receivedQuantity
            );
            if (invalidEntries) {
                toast.error('Received quantity cannot be greater than required quantity for some products');
                return;
            }

            if (UpdatedEntries.length === 0) {
                toast.error('All Products Data status has completed');
                return;
            }
            const products = UpdatedEntries
            const final = { products }
            const finalUpdatedvalues = JSON.parse(JSON.stringify(final))
            console.log("finalUpdatedvalues", finalUpdatedvalues);

            const savePurchaseEntry = await post(`/purchase-order/registerPurchaseEntry/${poId}`, finalUpdatedvalues);
            // console.log("savePurchaseEntry", savePurchaseEntry);
            toast.success('Product added to inventory');
            getPurchaseOrderByid()
            getPurchaseEntryData();
            setEditedData({});
            setSelectedBranches({})
            setIsNewPurchaseEntry(false)

        } catch (error: any) {
            console.error("Error Saving Branch", error);
            toast.error('Error Saving Branch', error);
        }
        finally {
            
            navigate(PathRoutes.purchase_order);
        }
    };

    return (
        <div>
            <PageWrapper name='Product List'>
                <SubheaderRight>
                    <div className='col-span-1'>
                        <Button
                            variant='solid'
                            color='emerald'
                            className='mr-5 mt-4'
                            onClick={() => collapseAllAccordians()}
                        >

                            {!collapseAll ? 'Collapse All Information' : 'Expand All Information'}
                        </Button>
                    </div>
                </SubheaderRight>
                <Container>
                    <Card >
                        <CardBody>
                            <div className='flex'>
                                <div className='bold w-full'>
                                    <Button
                                        variant='outlined'
                                        className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                        onClick={() =>
                                            setAccordionStates({
                                                ...accordionStates,
                                                collapsible: !accordionStates.collapsible,
                                            })
                                        }
                                        rightIcon={
                                            !accordionStates.collapsible
                                                ? 'HeroChevronUp'
                                                : 'HeroChevronDown'
                                        }>
                                        <h2 className='text-gray-700'> Purchased Products List </h2>
                                    </Button>
                                </div>
                            </div>


                            <Collapse isOpen={!accordionStates.collapsible}>
                                <div className="flex justify-end mt-5 ">
                                    <Button variant='solid' icon='HeroPlus' onClick={() => { handleNewPurchaseEntry() }}>
                                        New Purchase Entry
                                    </Button>

                                </div>
                            </Collapse>
                        </CardBody>


                        <Collapse isOpen={!accordionStates.collapsible}>

                            <>
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
                                <div style={{ display: "flex", justifyContent: "end", marginRight: "15px", marginTop: "20px" }}>

                                    <Button variant='solid' isDisable={!isNewPurchaseEntry} onClick={handleSave} >
                                        SAVE Purchase Entry
                                    </Button>
                                </div>
                            </>

                        </Collapse>
                    </Card>
                </Container>
            </PageWrapper >
            <PageWrapper>
                <Container>
                    <Card>
                        <CardBody>
                            <div className='flex'>
                                <div className='bold w-full'>
                                    <Button
                                        variant='outlined'
                                        className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                        onClick={() =>
                                            setAccordionStates({
                                                ...accordionStates,
                                                collapsibleEntryList: !accordionStates.collapsibleEntryList,
                                            })
                                        }
                                        rightIcon={
                                            !accordionStates.collapsibleEntryList
                                                ? 'HeroChevronUp'
                                                : 'HeroChevronDown'
                                        }>
                                        <h2 className='text-gray-700'>Purchased Entry List</h2>
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                        <Collapse isOpen={!accordionStates.collapsibleEntryList}>
                            <CardHeader className='mt-5'>
                                <CardHeaderChild>
                                </CardHeaderChild>
                            </CardHeader>
                            {
                                purchaseEntry?.length > 0 ?
                                    (
                                        <CardBody className='overflow-auto'>

                                            <TableTemplate
                                                className='table-fixed max-md:min-w-[70rem]'
                                                table={purchaseEntryTable}
                                            />
                                            <TableCardFooterTemplate table={purchaseEntryTable} />
                                        </CardBody>
                                    ) :
                                    <div style={{ textAlign: 'center' }}>
                                        No Purchase Entry Records Available
                                    </div>
                            }
                        </Collapse>
                    </Card>
                </Container>
            </PageWrapper>


        </div >
    )

};

export default PurchaseEntryDetail;

