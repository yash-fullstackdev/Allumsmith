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
import { SubheaderRight } from '../../../../components/layouts/Subheader/Subheader';



const columnHelper = createColumnHelper<any>();


const CustomerOrderDetail = ({ customerId }: any) => {


    const [sorting, setSorting] = useState<SortingState>([]);
    const [editedData, setEditedData] = useState<{ [key: string]: any }>({});
    const [selectedBranches, setSelectedBranches] = useState<any>({});
    const [purchaseOrderData, setPurchaseOrderData] = useState<any>()
    console.log("🚀 ~ CustomerOrderDetail ~ purchaseOrderData:", purchaseOrderData)
    const [purchaseEntry, setPurchaseEntry] = useState<any>()
    const [collapseAll, setCollapseAll] = useState<boolean>(false);
    const [accordionStates, setAccordionStates] = useState({
        collapsible: false,
        collapsibleEntryList: false,

    });


    const getPurchaseOrderByid = async () => {

        try {
            const { data: allPurchaseOrderById } = await get(`/customer-order/${customerId}`);
            setPurchaseOrderData(allPurchaseOrderById);
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
        } finally {
        }
    };



    const columns = [
        columnHelper.accessor('product.name', {
            cell: (info) => (
                <div className=''>{`${info.getValue()}`}</div>
            ),
            header: 'Product Name',

        }),
        columnHelper.accessor("coating.name", {
            cell: (info) => (
                <div className=''>{`${info.getValue() || '-'} `}</div>
            ),
            header: 'Coating Name',

        }),
        columnHelper.accessor("color.name", {
            cell: (info) => (
                <div className=''>{`${info.getValue() || '-'}`}</div>
            ),
            header: 'Color Name',

        }),
        columnHelper.accessor('quantity', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Requried Quanity',
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
        data: purchaseOrderData?.entries || [],
        columns,
        state: {
            sorting,
        },
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
    });


    const getPurchaseEntryData = async () => {

        try {
            const { data: allProductList } = await get(`/purchase-order/purchaseEntry/${customerId}`);
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
        const UpdatedEntries: any = saveData.filter(entry => entry.ProductStaus !== 'completed');
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
            const savePurchaseEntry = await post(`/purchase-order/registerPurchaseEntry/${customerId}`, finalUpdatedvalues);
            console.log("savePurchaseEntry", savePurchaseEntry);
            toast.success('Product added to inventory');
            getPurchaseOrderByid()
            getPurchaseEntryData();
            setEditedData({})

        } catch (error: any) {
            console.error("Error Saving Branch", error);
            toast.error('Error Saving Branch', error);
        }
        finally {
            // navigate(PathRoutes.branches);
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
                                        <h2 className='text-gray-700'> Customer Order Products List </h2>
                                    </Button>
                                </div>
                            </div>



                        </CardBody>


                        <Collapse isOpen={!accordionStates.collapsible}>

                            <>
                                <CardBody className='overflow-auto'>
                                    <TableTemplate
                                        className='table-fixed max-md:min-w-[70rem]'
                                        table={table}
                                    />

                                </CardBody>

                                <TableCardFooterTemplate table={table} />
                            </>

                        </Collapse>
                    </Card>
                </Container>
            </PageWrapper >


        </div >
    )

};

export default CustomerOrderDetail;

